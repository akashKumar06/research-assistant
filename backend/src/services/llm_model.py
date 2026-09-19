from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_community.chat_message_histories import ChatMessageHistory
from src.services.vector_store import VectorStore
import os

class LLMModel:
    """
    LLM model wrapper handling:
    - Retrieval from Pinecone
    - Prompt assembly (context + history)
    - Streaming compatibility
    - Chat history storage
    """

    def __init__(self, pdf_id: str = None):
        """
        pdf_id = ID of uploaded PDF (acts as vector namespace)
        """
        self.pdf_id = pdf_id
        print(f"[LLMModel] Loaded for PDF: {pdf_id}")

        # Load HuggingFace LLM model
        llm = HuggingFaceEndpoint(
            repo_id="deepseek-ai/DeepSeek-V3.2-Exp",
            huggingfacehub_api_token=os.getenv("HUGGINGFACE_API_KEY"),
            task="conversational",
            max_new_tokens=1500,
            temperature=0.7,
            top_p=0.9,
        )

        self.model = ChatHuggingFace(llm=llm)
        self.chat_history = ChatMessageHistory()


    def build_rag_prompt(self, question: str, context_chunks: list):
        """
        Build final message list: system + context + history + question
        """

        messages = []

        # SYSTEM INSTRUCTIONS
        if context_chunks:
            system = SystemMessage(
                content=(
                    "You are a research assistant. Answer ONLY using the "
                    "context provided from the PDF. Follow these rules:\n"
                    "1. Use ONLY the text chunks as your knowledge source.\n"
                    "2. If the answer is not in chunks, reply:\n"
                    "\"This information is not available in the uploaded document.\"\n"
                    "3. Do NOT use general knowledge.\n"
                    "4. Cite chunk numbers.\n"
                )
            )

            messages.append(system)

            # Build combined context message
            combined_context = ""
            for i, chunk in enumerate(context_chunks):
                if "text" in chunk.metadata:
                    combined_context += f"\n\n[Chunk {i+1}]\n{chunk.metadata['text']}"

            messages.append(
                HumanMessage(
                    content=f"Relevant PDF chunks:\n{combined_context}\n\n"
                )
            )

        else:
            # No context available
            messages.append(
                SystemMessage(
                    content=(
                        "No PDF context available. Ask the user to upload a PDF first."
                    )
                )
            )

        # Add past conversation
        for msg in self.chat_history.messages:
            messages.append(msg)

        # Add new question
        messages.append(HumanMessage(content=question))
        self.add_HumanMessage(question)

        print(f"[LLMModel] Prompt built with {len(messages)} messages.")
        return messages
    
    def prompt(self, question: str, pdf_id: str = None):
        """
        Main entry point:
        - Retrieve chunks from Pinecone
        - Build final messages
        """

        current_pdf_id = pdf_id or self.pdf_id
        print(f"[LLMModel] RAG prompt for PDF: {current_pdf_id}")

        context_chunks = []

        if current_pdf_id:
            try:
                vector_store = VectorStore(pdf_id=current_pdf_id)
                context_chunks = vector_store.search(question)
                print(f"[LLMModel] Retrieved {len(context_chunks)} context chunks.")
            except Exception as e:
                print(f"[LLMModel] Retrieval error: {str(e)}")

        return self.build_rag_prompt(question, context_chunks)
    
    def add_HumanMessage(self, content: str):
        self.chat_history.add_message(HumanMessage(content=content))

    def add_AIMessage(self, content: str):
        self.chat_history.add_message(AIMessage(content=content))