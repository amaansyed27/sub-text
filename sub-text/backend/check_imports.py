try:
    import fitz
    print(f"Fitz imported successfully: {fitz.__file__}")
except ImportError as e:
    print(f"Error importing fitz: {e}")

try:
    import chromadb
    print(f"Chromadb imported successfully: {chromadb.__file__}")
except ImportError as e:
    print(f"Error importing chromadb: {e}")
