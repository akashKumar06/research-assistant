from fastapi import FastAPI
from src.config.db import Base, engine
from src.routes.user_routes import router as user_router
from src.routes.chat_routes import router as chat_router
from src.routes.research_routes import router as research_router


from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Research Paper Assistant")


# Create all tables in Neon
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(chat_router)
app.include_router(research_router)

@app.get("/")
def root():
    return {"message": "Backend server is running successfully!"}