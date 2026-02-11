from google import genai
import chromadb
from chromadb import Documents, EmbeddingFunction, Embeddings
from typing import List, Optional
import os

class GeminiEmbeddingFunction(EmbeddingFunction):
    def __init__(self, api_key: str, model_name: str = "models/gemini-embedding-001"):
        self.client = genai.Client(api_key=api_key)
        self.model_name = model_name

    def __call__(self, input: Documents) -> Embeddings:
        # Batch embedding support
        response = self.client.models.embed_content(
            model=self.model_name,
            contents=input
        )
        return [e.values for e in response.embeddings]

class VectorStore:
    def __init__(self):
        # Use a persistent client for now (or ephemeral for hackathon speed)
        self.client = chromadb.PersistentClient(path="./chroma_db")
        
        # Use Google Generative AI Embeddings
        # Note: You need to set GOOGLE_API_KEY env var
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
            
        self.embedding_fn = GeminiEmbeddingFunction(
            api_key=api_key,
            model_name="models/gemini-embedding-001"
        )
        
        self.collection = self.client.get_or_create_collection(
            name="legal_docs",
            embedding_function=self.embedding_fn
        )

    def add_documents(self, chunks: List[str], metadatas: List[dict]):
        ids = [str(i) for i in range(len(chunks))]
        self.collection.add(
            documents=chunks,
            metadatas=metadatas,
            ids=ids
        )

    def query(self, query_text: str, n_results: int = 5):
        """
        Returns (documents, metadatas)
        """
        results = self.collection.query(
            query_texts=[query_text],
            n_results=n_results
        )
        return results['documents'][0], results['metadatas'][0]

    def clear(self):
        self.client.delete_collection("legal_docs")
        self.collection = self.client.create_collection(
            name="legal_docs",
            embedding_function=self.embedding_fn
        )
