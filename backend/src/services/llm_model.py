import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder, PromptTemplate
from src.services.vector_store import VectorStore
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

load_dotenv()

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
class LLMModel:
    def __init__(self):
        self.llm = HuggingFaceEndpoint(
            repo_id="deepseek-ai/DeepSeek-V3.2-Exp",
            task="text-generation",
            huggingfacehub_api_token=HUGGINGFACE_API_KEY
        )
        self.model = ChatHuggingFace(llm=self.llm)
        self.chat_history = []
        self.chat_template = ChatPromptTemplate([SystemMessage("You are a helpful AI Assistant, you are provided with a context you can use that context to frame your answers."), MessagesPlaceholder(variable_name="chat_history")])

    def prompt(self, question: str) -> str:
        retrieved_docs = VectorStore().vector_store.similarity_search_with_score(query=question, k=5)

        valid_docs = []
        for doc, score in retrieved_docs:
            if score < 0.8:
                page_content = doc.page_content.strip()
                valid_docs.append(page_content)

        context = "\n\n".join(valid_docs)

        prompt = f"Context: {context}\n Question: {question}"
        
        self.chat_history.append(HumanMessage(prompt))

        res = self.chat_template.invoke({"chat_history": self.chat_history})

        return res
    
    def add_AIMessage(self, ai_message: str):
        self.chat_history.append(AIMessage(ai_message))