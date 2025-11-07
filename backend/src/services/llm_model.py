from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_community.chat_message_histories import ChatMessageHistory
from src.services.vector_store import VectorStore
import os

class LLMModel:
    def __init__(self, session_id: str = None):
        """Initialize LLM model with optional session ID"""
        self.session_id = session_id
        print(f"[LLMModel] Initialized for session: {session_id}")
        
        # Create the endpoint with conversational task
        llm = HuggingFaceEndpoint(
            repo_id="deepseek-ai/DeepSeek-V3.2-Exp",
            huggingfacehub_api_token=os.getenv("HUGGINGFACE_API_KEY"),
            task="conversational",
            max_new_tokens=1500,
            temperature=0.7,
            top_p=0.9,
        )
        
        # Wrap it in ChatHuggingFace for chat interface
        self.model = ChatHuggingFace(llm=llm)
        self.chat_history = ChatMessageHistory()

    def prompt(self, question: str, session_id: str = None):
        """Build prompt with context from session-specific vector store"""
        
        # Use provided session_id or instance session_id
        current_session_id = session_id or self.session_id
        print(f"[LLMModel] Building prompt for session: {current_session_id}")
        print(f"[LLMModel] Question: {question}")
        
        # Try to get context from vector store if available
        context = ""
        context_found = False
        
        if current_session_id:
            try:
                print(f"[LLMModel] Attempting to retrieve context...")
                
                # Get session-specific vector store
                vector_store = VectorStore(session_id=current_session_id)
                retriever = vector_store.get_retriever(k=5)  # Get top 5 most relevant chunks
                
                # Retrieve relevant documents from THIS session's PDF only
                context_docs = retriever.invoke(question)
                
                print(f"[LLMModel] Retrieved {len(context_docs)} documents")
                
                if context_docs:
                    context = "\n\n---\n\n".join([
                        f"[Chunk {i+1}]\n{doc.page_content}" 
                        for i, doc in enumerate(context_docs)
                    ])
                    context_found = True
                    print(f"[LLMModel] Context length: {len(context)} characters")
                    print(f"[LLMModel] First 200 chars of context: {context[:200]}...")
                else:
                    print("[LLMModel] WARNING: No documents retrieved")
                    
            except Exception as e:
                print(f"[LLMModel] Error retrieving context: {str(e)}")
                import traceback
                traceback.print_exc()
        
        # Build messages for conversational model
        messages = []
        
        # System message with instructions
        if context_found and context:
            system_message = """You are a helpful research assistant. Answer questions based ONLY on the context provided from the uploaded PDF document.

STRICT RULES:
1. ONLY use information from the Context chunks below
2. If the answer is not in the Context, respond with: "This information is not available in the uploaded document."
3. Do NOT use your general knowledge
4. Do NOT make assumptions beyond what's written
5. Quote relevant parts from the chunks when answering
6. Be specific and cite which chunk number you're referencing"""
            
            messages.append(SystemMessage(content=system_message))
            messages.append(HumanMessage(content=f"Here is the context from the PDF:\n\n{context}"))
            print("[LLMModel] Added context to messages")
        else:
            system_message = """You are a helpful assistant. 

IMPORTANT: No PDF document context is available. Please inform the user that they need to upload a PDF document first to get answers based on its content."""
            messages.append(SystemMessage(content=system_message))
            print("[LLMModel] No context available - default message added")
        
        # Add chat history
        history_count = len(self.chat_history.messages)
        for message in self.chat_history.messages:
            messages.append(message)
        print(f"[LLMModel] Added {history_count} messages from chat history")
        
        # Add current question
        messages.append(HumanMessage(content=question))
        
        # Store the question in history
        self.add_HumanMessage(question)
        
        print(f"[LLMModel] Total messages in prompt: {len(messages)}")
        return messages

    def add_HumanMessage(self, message: str):
        """Add human message to chat history"""
        self.chat_history.add_message(HumanMessage(content=message))

    def add_AIMessage(self, message: str):
        """Add AI message to chat history"""
        self.chat_history.add_message(AIMessage(content=message))