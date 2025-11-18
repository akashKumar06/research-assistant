import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def upload_pdf_to_cloudinary(file_bytes, filename: str):
    """
    Upload a PDF to Cloudinary.
    Returns a secure URL to store in PostgreSQL.
    """

    result = cloudinary.uploader.upload(
        file_bytes,
        resource_type="raw",  # required for PDFs
        public_id=f"research_assistant/pdfs/{filename}",
        overwrite=True
    )

    return result.get("secure_url")