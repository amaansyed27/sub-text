import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

client = genai.Client(api_key=api_key)

try:
    print("Listing available models...")
    # There is no direct list_models in the new client?? 
    # The new SDK might differ. Let's try the embedding directly with different names.
    
    candidates = [
        "text-embedding-004",
        "models/text-embedding-004",
        "gemini-embedding-001",
        "models/gemini-embedding-001"
    ]
    
    text = ["Hello world"]
    
    for model in candidates:
        print(f"\nTesting model: {model}")
        try:
            response = client.models.embed_content(
                model=model,
                contents=text
            )
            print(f"SUCCESS with {model}!")
            print(f"Dims: {len(response.embeddings[0].values)}")
            break
        except Exception as e:
            print(f"Failed with {model}: {e}")
            
except Exception as e:
    print(f"General Error: {e}")
