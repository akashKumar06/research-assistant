from fastapi import FastAPI
from src.routes import chat_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Research Paper Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router.router, prefix="/api", tags=["Chat"])

@app.get("/")
def root():
    return {"message": "Backend server is running successfully!"}