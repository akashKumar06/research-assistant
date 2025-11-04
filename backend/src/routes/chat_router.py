import os
import shutil
from fastapi import APIRouter, UploadFile, File, Form
from src.services.vector_store import VectorStore
from src.services.loader import DocumentLoader
from src.services.splitter import DocumentSplitter
from src.services.llm_model import LLMModel
from pydantic import BaseModel
import asyncio
from fastapi.responses import StreamingResponse

class Query(BaseModel):
    query: str

router = APIRouter()

UPLOAD_DIRECTORY = "./data/pdfs"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)
llm = LLMModel()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """uploads a pdf and process it into a vector store"""

    file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)

    try:
        with open (file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        ## load the pdf
        doc_loader = DocumentLoader(file_path)
        document = doc_loader.load()

        ## split the documents
        doc_splitter = DocumentSplitter()
        chunks = doc_splitter.split_documents(document)

        # print(f"document of {len(document)} size is chunked into {len(chunks)} size")

        # create a vector store for the documents
        vector_store = VectorStore()
        vector_store.create_store(chunks)        

    except Exception as e:
        return {"message": f"There was an error uploading the file: {e}"}, 500
    finally:
        await file.close()
    return {"message": "PDF uploaded successfully and vector store created"}

@router.post("/chat")
async def query_pdf(question: Query):
    """Takes a user question and returns an answer based on the uploaded PDF"""
    model = llm.model
    prompt = llm.prompt(question.query)

    async def generate():
        ai_response = ""
        async for chunk in model.astream(prompt):
            if chunk.content:
                ai_response += chunk.content
                yield chunk.content
            await asyncio.sleep(0.01)

        llm.add_AIMessage(ai_response)
        
    return StreamingResponse(generate(), media_type="text/event-stream")