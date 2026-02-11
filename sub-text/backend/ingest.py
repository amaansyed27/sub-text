import fitz  # PyMuPDF
from typing import List
from db import VectorStore
import os

def chunk_text(text: str, chunk_size: int = 1500, overlap: int = 150) -> List[str]:
    """Splits text into chunks."""
    if not text:
        return []
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunk = text[start:end]
        chunks.append(chunk)
        if end == len(text):
            break
        start += chunk_size - overlap
    return chunks

def ingest_document(file_path: str):
    """
    Parses PDF page-by-page, chunks text, and stores directly in ChromaDB with metadata.
    """
    db = VectorStore()
    
    # Open Document
    doc = fitz.open(file_path)
    
    all_chunks = []
    all_metadatas = []
    
    filename = os.path.basename(file_path)

    for page_num, page in enumerate(doc, start=1):
        text = page.get_text()
        if not text.strip():
            continue
            
        # Chunk this page's text
        page_chunks = chunk_text(text)
        
        for chunk in page_chunks:
            all_chunks.append(chunk)
            all_metadatas.append({
                "source": filename,
                "page": page_num
            })
    
    if not all_chunks:
        print("Warning: No text extracted from PDF.")
        return 0

    # Clear previous and add new
    db.clear()
    db.add_documents(all_chunks, all_metadatas)
    
    return len(all_chunks)
