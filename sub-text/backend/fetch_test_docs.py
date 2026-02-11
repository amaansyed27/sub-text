import requests
import os

DOCS = {
    "GDPR_Full_Text.pdf": "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32016R0679",
    "Apple_Media_Services.pdf": "https://www.apple.com/legal/internet-services/itunes/us/terms.html", # Note: This is HTML, usually needs conversion. Let's find a real PDF.
    # Using a stable PDF source for a large doc:
    "Constitution_USA.pdf": "https://constitutioncenter.org/media/files/constitution.pdf", # approx 20 pages but dense
    "AI_Act_EU.pdf": "https://www.europarl.europa.eu/doceo/document/TA-9-2024-0138_EN.pdf" # Huge doc
}

def download_docs():
    for name, url in DOCS.items():
        if "pdf" not in url and "html" in url:
            print(f"Skipping {name} (HTML source, please print to PDF manually)")
            continue
            
        print(f"Downloading {name}...")
        try:
            response = requests.get(url, timeout=30)
            with open(name, 'wb') as f:
                f.write(response.content)
            print(f"Saved {name} ({len(response.content)//1024} KB)")
        except Exception as e:
            print(f"Failed to download {name}: {e}")

if __name__ == "__main__":
    download_docs()
