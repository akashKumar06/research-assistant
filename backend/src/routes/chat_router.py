import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, Header
from typing import Optional
from src.services.vector_store import VectorStore
from src.services.loader import DocumentLoader
from src.services.splitter import DocumentSplitter
from src.services.llm_model import LLMModel
from pydantic import BaseModel
import asyncio
from fastapi.responses import StreamingResponse
import uuid
import traceback

class Query(BaseModel):
    query: str

router = APIRouter()

UPLOAD_DIRECTORY = "./data/pdfs"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

# Store session data in memory (use Redis for production)
sessions = {}

# Default session for backward compatibility
DEFAULT_SESSION_ID = "default"

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """Uploads a PDF and processes it into a session-specific vector store"""
    
    # Generate unique session ID
    session_id = str(uuid.uuid4())
    
    file_path = os.path.join(UPLOAD_DIRECTORY, f"{session_id}_{file.filename}")

    try:
        print(f"Starting upload for file: {file.filename}")
        
        # Validate file type
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Save file
        print(f"Saving file to: {file_path}")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        print(f"File saved. Loading PDF...")
        # Load the PDF
        doc_loader = DocumentLoader(file_path)
        document = doc_loader.load()
        print(f"PDF loaded. Document count: {len(document)}")

        # Split the documents
        print("Splitting documents...")
        doc_splitter = DocumentSplitter()
        chunks = doc_splitter.split_documents(document)
        print(f"Documents split into {len(chunks)} chunks")

        # Create session-specific vector store
        print("Creating vector store...")
        vector_store = VectorStore(session_id=session_id)
        vector_store.create_store(chunks)
        print("Vector store created successfully")
        
        # Store session data
        sessions[session_id] = {
            "file_path": file_path,
            "filename": file.filename,
            "vector_store": vector_store,
            "llm": LLMModel(session_id=session_id)
        }
        
        print(f"Upload complete for session: {session_id}")

    except Exception as e:
        # Print full traceback
        print(f"Error during upload: {str(e)}")
        print(traceback.format_exc())
        
        # Cleanup on error
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Cleaned up file: {file_path}")
        
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
    finally:
        await file.close()
    
    return {
        "message": "PDF uploaded successfully and vector store created",
        "session_id": session_id,
        "filename": file.filename
    }

@router.post("")
async def query_pdf(question: Query, session_id: Optional[str] = Header(None, alias="session-id")):
    """Takes a user question and returns an answer based on the uploaded PDF"""
    
    print(f"[ChatRouter] Received query: {question.query}")
    print(f"[ChatRouter] Session ID from header: {session_id}")
    
    # Require session ID - don't use default
    if session_id is None:
        raise HTTPException(
            status_code=400,
            detail="No session ID provided. Please upload a PDF first to get a session ID."
        )
    
    # Check if session exists
    if session_id not in sessions:
        print(f"[ChatRouter] Session {session_id} not found")
        print(f"[ChatRouter] Available sessions: {list(sessions.keys())}")
        raise HTTPException(
            status_code=404, 
            detail=f"Session '{session_id}' not found. Please upload a PDF first."
        )
    
    session_data = sessions[session_id]
    llm = session_data["llm"]
    
    print(f"[ChatRouter] Using session: {session_id}")
    print(f"[ChatRouter] Session has file: {session_data.get('filename', 'None')}")
    
    # Verify the session has a vector store with documents
    vector_store = session_data.get("vector_store")
    if vector_store and hasattr(vector_store, 'vector_store') and vector_store.vector_store:
        doc_count = vector_store.vector_store._collection.count()
        print(f"[ChatRouter] Vector store has {doc_count} documents")
        if doc_count == 0:
            raise HTTPException(
                status_code=400,
                detail="No documents found in this session. Please upload a PDF first."
            )
    
    try:
        # Build messages with session-specific retriever
        messages = llm.prompt(question.query, session_id=session_id)
        model = llm.model

        async def generate():
            ai_response = ""
            chunk_count = 0
            
            async for chunk in model.astream(messages):
                chunk_count += 1
                if hasattr(chunk, 'content') and chunk.content:
                    ai_response += chunk.content
                    yield chunk.content
                await asyncio.sleep(0.01)
            
            print(f"[ChatRouter] Generated response with {chunk_count} chunks")
            print(f"[ChatRouter] Response length: {len(ai_response)} characters")
            
            llm.add_AIMessage(ai_response)
            
        return StreamingResponse(generate(), media_type="text/event-stream")
    except Exception as e:
        print(f"[ChatRouter] Error in query_pdf: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@router.delete("/session/{session_id}")
async def delete_session(session_id: str):
    """Delete a session and cleanup resources"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session_data = sessions[session_id]
    
    # Cleanup file
    if session_data["file_path"] and os.path.exists(session_data["file_path"]):
        os.remove(session_data["file_path"])
    
    # Cleanup vector store
    session_data["vector_store"].delete_store()
    
    # Remove from sessions
    del sessions[session_id]
    
    return {"message": "Session deleted successfully"}