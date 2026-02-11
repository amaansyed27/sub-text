import requests
import time

BASE_URL = "http://127.0.0.1:8000"

def test_analyze():
    print("\n--- Testing /analyze Endpoint ---")
    files = {'file': open('predatory_terms.pdf', 'rb')}
    try:
        response = requests.post(f"{BASE_URL}/analyze", files=files)
        if response.status_code == 200:
            print("SUCCESS: /analyze call worked!")
            data = response.json()
            print(f"Summary: {data.get('summary')}")
            print(f"Overall Risk Score: {data.get('overall_risk_score')}")
            print(f"Red Flags Found: {len(data.get('red_flags', []))}")
            for flag in data.get('red_flags', []):
                print(f" - [{flag['risk_level']}] {flag['category']}: {flag['description']}")
        else:
            print(f"FAILED: /analyze returned {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"ERROR: {e}")

def test_chat():
    print("\n--- Testing /chat RAG Endpoint ---")
    payload = {
        "query": "Can I cancel my subscription without paying?",
        "history": []
    }
    try:
        response = requests.post(f"{BASE_URL}/chat", json=payload)
        if response.status_code == 200:
            print("SUCCESS: /chat call worked!")
            print(f"Agent Response: {response.json().get('response')}")
        else:
            print(f"FAILED: /chat returned {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_analyze()
    # Wait a bit for indexing if needed (though analyze usually waits)
    time.sleep(2) 
    test_chat()
