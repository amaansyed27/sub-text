from typing import List, Dict, Optional
from schemas import AnalysisReport, RedFlag
import os
from google import genai
from google.genai import types
from db import VectorStore
import json
import asyncio

class LegalAgent:
    def __init__(self):
        # Initialize Gemini 3 Client
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print("WARNING: GOOGLE_API_KEY not found. Agent will fail if called.")
            self.client = None
        else:
            self.client = genai.Client(api_key=api_key)
            
        # Using gemini-3-flash-preview as requested
        self.model_name = "gemini-3-flash-preview"
        
        self.categories = [
            "Data Privacy & Selling",
            "Hidden Fees & Subscriptions",
            "Liability & Arbitration",
            "Account Termination",
            "IP Rights & Content Ownership"
        ]

    def _query_db(self, category: str) -> str:
        """Retrieve relevant context for a category with page numbers."""
        # Query DB for context
        try:
            db = VectorStore()
            docs, metadatas = db.query(category, n_results=5)
            if not docs:
                return ""
            
            context_parts = []
            for doc, meta in zip(docs, metadatas):
                page_num = meta.get('page', '?')
                context_parts.append(f"[Page {page_num}] {doc}")
                
            return "\n\n".join(context_parts)
        except Exception as e:
            print(f"DB Query Error: {e}")
            return ""

    async def _analyze_category_gemini3(self, category: str, context: str) -> List[RedFlag]:
        """
        Uses Gemini 3 Flash with thinking_level='high' to deeply analyze clauses.
        """
        prompt = f"""
        Context Clauses (with Page Numbers):
        {context}
        
        Task:
        Identify any "Red Flags" in the above clauses regarding "{category}".
        A "Red Flag" is a clause that is predatory, unfair, or dangerous to the user.
        
        Output JSON format only:
        [
            {{
                "risk_level": "High" | "Medium" | "Low",
                "description": "Brief explanation of the risk",
                "quote": "Direct quote from the text verifying this risk",
                "page_number": int (Extract the page number from the [Page X] tag preceding the quote. Return null if unclear.)
            }}
        ]
        """
        
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    thinking_config=types.ThinkingConfig(thinking_level="high")
                )
            )
            
            # Simple cleanup for JSON parsing just in case
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:-3]
            data = json.loads(text)
            
            red_flags = []
            for item in data:
                red_flags.append(RedFlag(
                    category=category,
                    risk_level=item.get("risk_level", "Low"),
                    description=item.get("description", "Unknown risk"),
                    quote=item.get("quote", ""),
                    page_number=item.get("page_number")
                ))
            return red_flags
        except Exception as e:
            print(f"Error analyzing {category}: {e}")
            return []

    async def analyze_document(self, file_path: str) -> AnalysisReport:
        """
        Main agent loop:
        1. Query DB for each category.
        2. Analyze context with Gemini 3.
        3. Aggregate results.
        """
        all_red_flags = []
        
        # Parallel execution would be faster, but let's keep it simple for now
        # Actually, let's use asyncio.gather for speed since LLM calls are I/O bound
        tasks = []
        for category in self.categories:
            context = self._query_db(category)
            if context:
                tasks.append(self._analyze_category_gemini3(category, context))
        
        results = await asyncio.gather(*tasks)
        for flags in results:
            all_red_flags.extend(flags)
        
        # Calculate score (100 - penalties)
        score = 100
        for flag in all_red_flags:
            if flag.risk_level == "High": score -= 5
            elif flag.risk_level == "Medium": score -= 2
            elif flag.risk_level == "Low": score -= 1
        score = max(0, score)

        # Generate Executive Summary
        summary = await self._generate_executive_summary(all_red_flags)

        return AnalysisReport(
            summary=summary,
            red_flags=all_red_flags,
            overall_risk_score=score
        )

    async def _generate_executive_summary(self, red_flags: List[RedFlag]) -> str:
        """
        Generates a qualitative executive summary based on the findings.
        """
        if not red_flags:
            return "No significant risks were found in this document. It appears to be relatively safe, but always read carefully."
            
        findings_text = "\n".join([f"- [{f.risk_level}] {f.category}: {f.description}" for f in red_flags])
        
        prompt = f"""
        Based on the following list of identified risks in a contract, write a 2-3 sentence "Executive Summary" 
        that a user would read to instantly understand the main "catch" or danger of this document.
        Be direct, professional, and slightly cautionary if needed. Do not use markdown formatting like bolding.
        
        Risks Found:
        {findings_text}
        """
        
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    thinking_config=types.ThinkingConfig(thinking_level="medium")
                )
            )
            return response.text
        except Exception as e:
            print(f"Summary Generation Error: {e}")
            return f"Analysis complete. Found {len(red_flags)} issues that require your attention."

    async def chat(self, query: str, history: List[dict]) -> str:
        """
        Handles chat with "Thought Signature" circulation for reasoning continuity.
        """
        context = self._query_db(query)
        
        # Construct history compatible with Gemini 3
        # Note: In a real app, we'd persist the actual thought signatures from previous turns.
        # Here, we mock the history structure but ensure we use the client correctly.
        
        # For simplicity in this demo, we'll treat each chat as a fresh turn with history context
        # but in a real persistent session, we'd need to store the `thought_signature`.
        
        prompt = f"""
        Context from document:
        {context}
        
        User Query: {query}
        
        Answer the user's question based strictly on the document context.
        """
        
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    thinking_config=types.ThinkingConfig(thinking_level="medium") # Speed/Quality balance for Chat
                )
            )
            return response.text
        except Exception as e:
            print(f"Chat Error: {e}")
            return "I apologize, but I encountered an error while thinking about your question."
