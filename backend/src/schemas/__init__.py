from .user_schema import UserBase, UserCreate, UserLogin, UserWithPDFs, UserWithChats
from .pdf_schema import PDFBase, PDFCreate, PDFWithChats
from .chat_schema import ChatBase, ChatCreate

# Resolve forward references
UserWithPDFs.model_rebuild()
UserWithChats.model_rebuild()
PDFWithChats.model_rebuild()