from dotenv import load_dotenv
load_dotenv()

from ingest import parse_pdf, chunk_text
from db import VectorStore
import os

def debug():
    file_path = "predatory_terms.pdf"
    if not os.path.exists(file_path):
        print("PDF not found!")
        return

    print(f"--- Debugging {file_path} ---")
    
    # 1. Parse
    text = parse_pdf(file_path)
    print(f"Extracted Text Length: {len(text)}")
    print(f"First 100 chars: {text[:100]}")
    
    if len(text) == 0:
        print("ERROR: No text extracted!")
        return

    # 2. Chunk
    chunks = chunk_text(text)
    print(f"Generated {len(chunks)} chunks")
    
    if not chunks:
        print("ERROR: No chunks generated!")
        return
        
    print(f"First chunk: {chunks[0][:100]}...")

    # 3. Store
    print("Initializing VectorStore...")
    try:
        db = VectorStore()
        print("VectorStore initialized.")
        
        metadatas = [{"source": os.path.basename(file_path)} for _ in chunks]
        
        print("Adding documents...")
        db.add_documents(chunks, metadatas)
        print("Documents added.")
        
        # 4. Verify Query
        print("Testing Query...")
        results = db.query("cancellation fee")
        print(f"Query returned {len(results)} results.")
        print(f"Top result: {results[0][:100]}...")
        
    except Exception as e:
        print(f"DB Error: {e}")

if __name__ == "__main__":
    debug()
