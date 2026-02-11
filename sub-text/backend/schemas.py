from pydantic import BaseModel
from typing import List, Optional

class AnalyzeRequest(BaseModel):
    file_path: str  # For local hackathon demo, we just pass the path after upload

class RedFlag(BaseModel):
    category: str
    risk_level: str  # "High", "Medium", "Low"
    description: str
    quote: str
    page_number: Optional[int] = None

class AnalysisReport(BaseModel):
    summary: str
    red_flags: List[RedFlag]
    overall_risk_score: int  # 0-100

class ChatRequest(BaseModel):
    query: str
    history: List[dict] = []
