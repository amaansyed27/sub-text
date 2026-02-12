import os
import shutil
from dotenv import load_dotenv

# Load env vars *before* importing local modules that use them (like ingest/db)
load_dotenv()

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from ingest import ingest_document
from agent import LegalAgent
from schemas import AnalysisReport, ChatRequest

app = FastAPI(title="Subtext API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Agent
agent = LegalAgent()

@app.get("/")
def read_root():
    return {"message": "Subtext Backend is Running. Beware the Fine Print."}

@app.post("/analyze", response_model=AnalysisReport)
async def analyze_document(file: UploadFile = File(...)):
    """
    1. Save file locally.
    2. Ingest into ChromaDB.
    3. Run Agent Analysis.
    """
    try:
        file_location = f"temp_{file.filename}"
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
            
        # Ingest
        num_chunks = ingest_document(file_location)
        print(f"Ingested {num_chunks} chunks from {file.filename}")
        
        # Analyze
        report = await agent.analyze_document(file_location)
        
        # Cleanup
        os.remove(file_location)
        
        return report
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_with_doc(request: ChatRequest):
    response = await agent.chat(request.query, request.history)
    return {"response": response}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
