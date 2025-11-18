from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

from src.services.arxiv_tools import get_research_tools

import os
import json

load_dotenv()

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")


class ToolAgent:

    def __init__(self):
        """Initialize LLM, tools, history and template"""

        # ---- LLM ----
        hf_llm = HuggingFaceEndpoint(
            repo_id="deepseek-ai/DeepSeek-V3.2-Exp",
            task="text-generation",
            huggingfacehub_api_token=HUGGINGFACE_API_KEY
        )
        self.chat_model = ChatHuggingFace(llm=hf_llm)

        # ---- Tools ----
        self.tools = get_research_tools()
        self.agent = self.chat_model.bind_tools(tools=self.tools)

        # ---- Memory ----
        self.chat_history = []

        # ---- Prompt Template ----
        self.chat_template = ChatPromptTemplate([
            SystemMessage(
                "You are a research assistant. Use the provided context "
                "when available. If the context contains research papers, "
                "summarize them and include clickable download links."
            ),
            MessagesPlaceholder(variable_name="chat_history")
        ])

    # ----------------------------------------------------------------------
    # TOOL HANDLING
    # ----------------------------------------------------------------------

    def _execute_tool_call(self, tool_call):
        """Execute a single tool call and return its result in clean format."""

        tool_name = tool_call["function"]["name"]

        try:
            args = json.loads(tool_call["function"]["arguments"])
        except json.JSONDecodeError:
            args = {}

        # Find tool
        for tool in self.tools:
            if tool.name == tool_name:
                result = tool.run(tool_input=args)
                # Convert each item to a dict
                result = [r.model_dump() for r in result]

                # Add downloadable PDF link
                for r in result:
                    if "pdf_url" in r:
                        r["download_link"] = r["pdf_url"]

                return result

        return {"error": f"Tool '{tool_name}' not found"}

    # ----------------------------------------------------------------------
    # CONTEXT GENERATION (WITH TOOL CALL SUPPORT)
    # ----------------------------------------------------------------------

    def get_research_context(self, query: str):
        """Runs the model with tool-calling enabled and returns context."""

        llm_result = self.agent.invoke(query)

        # Check if tool-calling happened
        tool_calls = getattr(llm_result, "additional_kwargs", {}).get("tool_calls")

        if tool_calls:
            final_tool_results = []
            for call in tool_calls:
                result = self._execute_tool_call(call)
                final_tool_results.append(result)

            return {"tool_results": final_tool_results}

        # No tool calls → direct answer
        return {"response": llm_result.content}

    # ----------------------------------------------------------------------
    # MAIN INVOCATION
    # ----------------------------------------------------------------------

    def invoke(self, query: str):
        """Main function used by your backend route."""
        context = self.get_research_context(query)

        # Prepare message for history + final LLM
        user_message = f"Context: {json.dumps(context, indent=2)}\n\nUser Query: {query}"
        self.chat_history.append(HumanMessage(user_message))

        # Now ask chat model to form final answer
        final_answer = self.chat_template.invoke(
            {"chat_history": self.chat_history}
        )

        return final_answer

    # ----------------------------------------------------------------------
    # ADD AI MESSAGE TO HISTORY
    # ----------------------------------------------------------------------

    def add_AIMessage(self, message: str):
        self.chat_history.append(AIMessage(message))
