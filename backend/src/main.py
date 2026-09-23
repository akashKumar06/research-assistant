from fastapi import FastAPI
from src.config.db import Base, engine
from src.routes.user_routes import router as user_router
from src.routes.chat_routes import router as chat_router
from src.routes.research_routes import router as research_router


from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Research Paper Assistant")


@app.on_event("startup")
def create_tables():
    # Deferred from import time: this opens a real connection to Neon, whose
    # free-tier compute auto-suspends after inactivity (see config/db.py).
    # Running it at import time meant even tooling that just imports this
    # module (tests, scripts) paid for a DB round-trip / cold-start retry.
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