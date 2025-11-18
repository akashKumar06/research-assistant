import os
import uuid
import traceback
import asyncio
import tempfile

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends
)
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel

from src.routes.user_routes import get_current_user
from src.config.db import get_db

from src.services.file_storage import upload_pdf_to_cloudinary
from src.services.vector_store import VectorStore
from src.services.loader import DocumentLoader
from src.services.splitter import DocumentSplitter
from src.services.llm_model import LLMModel

from src.models.pdf_model import PDF
from src.models.user_model import User
from src.models.chat_model import Chat


router = APIRouter(prefix="/chat", tags=["Chat"])

class Query(BaseModel):
    question: str


# -------------------------------------------------------
#                UPLOAD & INDEX PDF
# -------------------------------------------------------

@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Uploads a PDF → Cloudinary → Splits → Embeds in Pinecone → Saves metadata"""

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files allowed")

    pdf_id = str(uuid.uuid4())  # also Pinecone namespace

    try:
        # 1️⃣ Read file bytes
        file_bytes = await file.read()

        # 2️⃣ Upload to Cloudinary
        cloud_url = upload_pdf_to_cloudinary(file_bytes, file.filename)


        # 3️⃣ Save temp file (loader expects local path)
        tmp_dir = tempfile.gettempdir()
        temp_path = os.path.join(tmp_dir, f"{pdf_id}.pdf")

        with open(temp_path, "wb") as f:
            f.write(file_bytes)

        # 4️⃣ Load + split PDF
        loader = DocumentLoader(temp_path)
        docs = loader.load()

        splitter = DocumentSplitter()
        chunks = splitter.split_documents(docs)

        # 5️⃣ Add embeddings to Pinecone
        vector_store = VectorStore(pdf_id)
        vector_store.add_embeddings(chunks)

        # 6️⃣ Save metadata in PostgreSQL
        new_pdf = PDF(
            id=pdf_id,
            user_id=user.id,
            file_name=file.filename,
            file_url=cloud_url,
            vector_namespace=pdf_id
        )

        db.add(new_pdf)
        db.commit()
        db.refresh(new_pdf)

        return {
            "message": "PDF uploaded and indexed successfully",
            "pdf_id": pdf_id,
            "file_url": cloud_url,
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            500,
            detail=f"PDF upload error: {str(e)}"
        )


# -------------------------------------------------------
#                   CHAT WITH PDF (RAG)
# -------------------------------------------------------

@router.post("/{pdf_id}")
async def chat_with_pdf(
    pdf_id: str,
    query: Query,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Chat with a specific PDF using RAG (Pinecone + LLMModel)."""

    # 1️⃣ Ensure PDF belongs to user
    pdf = (
        db.query(PDF)
        .filter(PDF.id == pdf_id, PDF.user_id == user.id)
        .first()
    )

    if not pdf:
        raise HTTPException(404, "PDF not found or unauthorized")

    # 2️⃣ Initialize LLM with PDF namespace
    llm = LLMModel(pdf_id=pdf_id)

    try:
        # 3️⃣ Create prompt (RAG done internally)
        messages = llm.prompt(query.question, pdf_id=pdf_id)
        model = llm.model

        # 4️⃣ Streaming generator for deepseek
        async def stream_response():
            ai_response = ""

            async for chunk in model.astream(messages):
                if hasattr(chunk, "content") and chunk.content:
                    ai_response += chunk.content
                    yield chunk.content
                await asyncio.sleep(0.01)

            # Save chat in DB after model finishes
            chat_entry = Chat(
                user_id=user.id,
                pdf_id=pdf_id,
                role="user",
                message=query.question,
                response=ai_response,
            )
            
            db.add(chat_entry)
            db.commit()

        return StreamingResponse(stream_response(), media_type="text/event-stream")

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, f"Chat error: {str(e)}")


# -------------------------------------------------------
#                   CHAT HISTORY
# -------------------------------------------------------

@router.get("/{pdf_id}/history")
def get_chat_history(
    pdf_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get all chat history for a given PDF."""

    pdf = (
        db.query(PDF)
        .filter(PDF.id == pdf_id, PDF.user_id == user.id)
        .first()
    )

    if not pdf:
        raise HTTPException(404, "PDF not found or unauthorized")

    history = (
        db.query(Chat)
        .filter(Chat.pdf_id == pdf_id, Chat.user_id == user.id)
        .order_by(Chat.created_at.asc())
        .all()
    )

    return history


# -------------------------------------------------------
#                  DELETE PDF + VECTORS
# -------------------------------------------------------

@router.delete("/{pdf_id}")
def delete_pdf(
    pdf_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Remove PDF metadata + Pinecone embeddings."""

    pdf = (
        db.query(PDF)
        .filter(PDF.id == pdf_id, PDF.user_id == user.id)
        .first()
    )

    if not pdf:
        raise HTTPException(404, "PDF not found")

    # Delete embeddings
    vector_store = VectorStore(pdf_id)
    vector_store.delete_pdf_vectors()

    # Delete PDF DB record
    db.delete(pdf)
    db.commit()

    return {"message": "PDF and its embeddings deleted successfully"}


# import os
# import shutil
# from fastapi import APIRouter, UploadFile, File, HTTPException, Header
# from typing import Optional
# from src.services.vector_store import VectorStore
# from src.services.loader import DocumentLoader
# from src.services.splitter import DocumentSplitter
# from src.services.llm_model import LLMModel
# from pydantic import BaseModel
# import asyncio
# from fastapi.responses import StreamingResponse
# import uuid
# import traceback

# class Query(BaseModel):
#     query: str

# router = APIRouter()

# UPLOAD_DIRECTORY = "./data/pdfs"
# os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

# # Store session data in memory (use Redis for production)
# sessions = {}

# # Default session for backward compatibility
# DEFAULT_SESSION_ID = "default"

# @router.post("/upload")
# async def upload_pdf(file: UploadFile = File(...)):
#     """Uploads a PDF and processes it into a session-specific vector store"""
    
#     # Generate unique session ID
#     session_id = str(uuid.uuid4())
    
#     file_path = os.path.join(UPLOAD_DIRECTORY, f"{session_id}_{file.filename}")

#     try:
#         print(f"Starting upload for file: {file.filename}")
        
#         # Validate file type
#         if not file.filename.endswith('.pdf'):
#             raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
#         # Save file
#         print(f"Saving file to: {file_path}")
#         with open(file_path, "wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)
        
#         print(f"File saved. Loading PDF...")
#         # Load the PDF
#         doc_loader = DocumentLoader(file_path)
#         document = doc_loader.load()
#         print(f"PDF loaded. Document count: {len(document)}")

#         # Split the documents
#         print("Splitting documents...")
#         doc_splitter = DocumentSplitter()
#         chunks = doc_splitter.split_documents(document)
#         print(f"Documents split into {len(chunks)} chunks")

#         # Create session-specific vector store
#         print("Creating vector store...")
#         vector_store = VectorStore(session_id=session_id)
#         vector_store.create_store(chunks)
#         print("Vector store created successfully")
        
#         # Store session data
#         sessions[session_id] = {
#             "file_path": file_path,
#             "filename": file.filename,
#             "vector_store": vector_store,
#             "llm": LLMModel(session_id=session_id)
#         }
        
#         print(f"Upload complete for session: {session_id}")

#     except Exception as e:
#         # Print full traceback
#         print(f"Error during upload: {str(e)}")
#         print(traceback.format_exc())
        
#         # Cleanup on error
#         if os.path.exists(file_path):
#             os.remove(file_path)
#             print(f"Cleaned up file: {file_path}")
        
#         raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
#     finally:
#         await file.close()
    
#     return {
#         "message": "PDF uploaded successfully and vector store created",
#         "session_id": session_id,
#         "filename": file.filename
#     }

# @router.post("")
# async def query_pdf(question: Query, session_id: Optional[str] = Header(None, alias="session-id")):
#     """Takes a user question and returns an answer based on the uploaded PDF"""
    
#     print(f"[ChatRouter] Received query: {question.query}")
#     print(f"[ChatRouter] Session ID from header: {session_id}")
    
#     # Require session ID - don't use default
#     if session_id is None:
#         raise HTTPException(
#             status_code=400,
#             detail="No session ID provided. Please upload a PDF first to get a session ID."
#         )
    
#     # Check if session exists
#     if session_id not in sessions:
#         print(f"[ChatRouter] Session {session_id} not found")
#         print(f"[ChatRouter] Available sessions: {list(sessions.keys())}")
#         raise HTTPException(
#             status_code=404, 
#             detail=f"Session '{session_id}' not found. Please upload a PDF first."
#         )
    
#     session_data = sessions[session_id]
#     llm = session_data["llm"]
    
#     print(f"[ChatRouter] Using session: {session_id}")
#     print(f"[ChatRouter] Session has file: {session_data.get('filename', 'None')}")
    
#     # Verify the session has a vector store with documents
#     vector_store = session_data.get("vector_store")
#     if vector_store and hasattr(vector_store, 'vector_store') and vector_store.vector_store:
#         doc_count = vector_store.vector_store._collection.count()
#         print(f"[ChatRouter] Vector store has {doc_count} documents")
#         if doc_count == 0:
#             raise HTTPException(
#                 status_code=400,
#                 detail="No documents found in this session. Please upload a PDF first."
#             )
    
#     try:
#         # Build messages with session-specific retriever
#         messages = llm.prompt(question.query, session_id=session_id)
#         model = llm.model

#         async def generate():
#             ai_response = ""
#             chunk_count = 0
            
#             async for chunk in model.astream(messages):
#                 chunk_count += 1
#                 if hasattr(chunk, 'content') and chunk.content:
#                     ai_response += chunk.content
#                     yield chunk.content
#                 await asyncio.sleep(0.01)
            
#             print(f"[ChatRouter] Generated response with {chunk_count} chunks")
#             print(f"[ChatRouter] Response length: {len(ai_response)} characters")
            
#             llm.add_AIMessage(ai_response)
            
#         return StreamingResponse(generate(), media_type="text/event-stream")
#     except Exception as e:
#         print(f"[ChatRouter] Error in query_pdf: {str(e)}")
#         import traceback
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

# @router.delete("/session/{session_id}")
# async def delete_session(session_id: str):
#     """Delete a session and cleanup resources"""
#     if session_id not in sessions:
#         raise HTTPException(status_code=404, detail="Session not found")
    
#     session_data = sessions[session_id]
    
#     # Cleanup file
#     if session_data["file_path"] and os.path.exists(session_data["file_path"]):
#         os.remove(session_data["file_path"])
    
#     # Cleanup vector store
#     session_data["vector_store"].delete_store()
    
#     # Remove from sessions
#     del sessions[session_id]
    
#     return {"message": "Session deleted successfully"}