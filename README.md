# SUBTEXT: AI-Powered Contract Auditor

**"Don't Sign Your Soul."**

Subtext is an advanced, agentic AI tool designed to analyze Terms & Conditions, Privacy Policies, and Contracts. It uses **Gemini 3 Flash** and **Vector Embeddings** to identify predatory clauses, hidden fees, and data privacy risks, presenting them in a high-impact **Neo-Brutalist** dashboard.

---

## 🚀 Features

### Core Analysis
-   **AI Risk Detection**: Automatically scans PDFs for High, Medium, and Low-risk clauses.
-   **Executive Summary**: Generates a custom, qualitative summary of the document's dangers using Gemini 3.
-   **Vector Search**: Uses ChromaDB to semantically search the document for relevant context.

### User Interface (Neo-Brutalism)
-   **"Paper & Ink" Aesthetic**: High-contrast, monochromatic design with hard shadows and bold typography.
-   **Three-View Dashboard**:
    1.  **Summary View**: Overall "Safety Score" and executive breakdown.
    2.  **Deep Dive**: Interactive PDF viewer that **jumps directly to the page** of a specific risk.
    3.  **AI Chat**: Full-screen, markdown-supported chat interface to query the document.

### Technical Highlights
-   **Agentic Workflow**: The backend "Agent" loops through multiple risk categories (Privacy, Liability, Fees, etc.) to perform a comprehensive audit.
-   **Page-Aware Parsing**: The ingestion engine tracks page numbers, enabling precise navigation in the frontend.
-   **Streaming "Thoughts"**: (Planned) Visualizing the AI's reasoning process.

---

## 🛠️ Tech Stack

### Frontend
-   **Framework**: React 19 + Vite
-   **Styling**: TailwindCSS (Custom "Paper" Theme)
-   **UI Library**: Framer Motion (Animations), Lucide React (Icons)
-   **Routing**: React Router DOM v7
-   **Markdown**: `react-markdown` + `remark-gfm`

### Backend
-   **Framework**: FastAPI (Python 3.12+)
-   **AI Models**: Google Gemini 3 Flash (via Vertex AI / GenAI SDK)
-   **Embeddings**: Google Gemini Embeddings (`models/gemini-embedding-001`)
-   **Vector DB**: ChromaDB (Persistent local storage)
-   **PDF Processing**: PyMuPDF (`fitz`)

---

## 📂 Project Structure

```text
sub-text/
├── backend/                # Python FastAPI Backend
│   ├── main.py             # API Entry Point
│   ├── agent.py            # AI Logic & Analysis Loop
│   ├── ingest.py           # PDF Parsing & Chunking
│   ├── db.py               # ChromaDB Vector Store Wrapper
│   ├── schemas.py          # Pydantic Models
│   ├── requirements.txt    # Python Dependencies
│   └── .env                # Environment Variables (API Keys)
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components (Dashboard, Chat, etc.)
│   │   ├── App.jsx         # Routes & State
│   │   └── main.jsx        # Entry Point
│   ├── index.css           # Tailwind & Global Styles
│   └── tailwind.config.js  # Theme Configuration
│
└── README.md               # You are here
```

---

## ⚡ Setup & Installation

### Prerequisites
-   **Node.js** (v18+)
-   **Python** (v3.12+)
-   **Google Cloud API Key** (with Gemini API access)

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment:
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
PORT=8000
```

Run the server:
```bash
# Development mode with hot reload
python main.py
```
*Server will start at `http://localhost:8000`*

### 2. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```
*Frontend will run at `http://localhost:5173`*

---

## 📖 Usage Guide

1.  **Upload**: Drag & drop a PDF contract (e.g., Terms of Service) into the "Upload Zone".
2.  **Wait**: The "Agent" parses the PDF, embeds it into the vector database, and runs the analysis loop.
3.  **Review**:
    -   Check the **Safety Score** and **Executive Summary**.
    -   Click **"Deep Dive"** to see specific red flags. Click the arrows to jump to the exact page in the PDF.
    -   Use **"AI Chat"** to ask questions like *"Can they sell my data?"* or *"Is there a class action waiver?"*

---

## ⚠️ Notes

-   **Beta Software**: This is a prototype. Always consult a real lawyer for legal advice.
-   **PDF Only**: Currently supports `.pdf` files up to 50MB.

---
*Built with ❤️ (and caffeine) for the Git Together Hackathon by the CSI Society, VIT Bhopal*
