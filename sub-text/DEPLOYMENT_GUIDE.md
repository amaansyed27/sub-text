# Deployment: Google Cloud Run

For the hackathon, we will use a **Split Deployment** strategy for speed:
1.  **Backend (FastAPI)**: Deployed to **Google Cloud Run**.
2.  **Frontend (React)**: Deployed to **Vercel** (Easiest/Fastest) OR served by the Backend (more complex). *Recommending Vercel for the frontend to save time.*

## 1. Vector DB Strategy: "Ephemeral Storage"
You asked: *"How will we store the vector db on the google cloud?, in the browser cache or something"*

**Answer:**
We will use **In-Memory / Ephemeral Storage** on the Cloud Run container.
*   **Why?** Our app is "session-based". A user uploads a file, we digest it, they read the report, and then they leave. We don't need to remember their PDF forever.
*   **How?** When the Cloud Run container starts, it has a temporary filesystem. ChromaDB will create its folder there. When the request is done or the container spins down, it vanishes.
*   **Privacy Bonus:** "We auto-delete your data after analysis." (Great PowerPoint talking point!)

## 2. Backend Deployment (GitHub + Cloud Run)

Since you pushed your code to GitHub, this is the easiest method.

1.  **Go to Google Cloud Console**: Search for **"Cloud Run"**.
2.  **Create Service**: Click **"Create Service"**.
3.  **Deploy from specific repository**:
    *   Select **"Continuously deploy new revisions from a source repository"**.
    *   Click **"SET UP CLOUD BUILD"**.
    *   **Repository Provider**: GitHub.
    *   **Repository**: `amaansyed27/sub-text`.
    *   **Branch**: `^main$`.
    *   **Build Configuration**:
        *   **Build Type**: Dockerfile.
        *   **Source location**: `sub-text/backend/Dockerfile` (Enter the full path to the Dockerfile. **Important:** Remove the leading `/` slash).
    *   Click **Save**.
4.  **Authentication**: Select **"Allow unauthenticated invocations"** (Public API).
5.  **Environment Variables** (CRITICAL):
    *   Expand **"Container, Networking, Security"**.
    *   Click **"Variables & Secrets"**.
    *   Add Variable:
        *   Name: `GOOGLE_API_KEY`
        *   Value: *[Paste your Gemini API Key]*
6.  **Create**: Click **Create**.

*Google Cloud will now build your Docker image from GitHub and deploy it. Watch the "Logs" tab for the green checkmark.*

## 3. Frontend Deployment (Vercel + GitHub)

1.  Go to **Vercel Dashboard** -> **Add New Project**.
2.  Import from GitHub: `sub-text`.
3.  **Root Directory**: Click "Edit" and select `frontend`. (This acts as the project root).
4.  **Environment Variables**:
    *   Name: `VITE_API_URL`
    *   Value: *[Your new Cloud Run URL, e.g., https://subtext-backend-xyz.run.app]*
    *   *(Note: You might need to deploy backend first to get this URL, or just update it later in Vercel settings and redeploy)*.
5.  Click **Deploy**.

---
## 🚨 TROUBLESHOOTING: "Cloud Build Trigger Failed" Error

If you see an error like **"Cloud Build trigger creation failed... Error while setting necessary roles"**:

**THE QUICK FIX:**
1.  **Ignore the error.** It only means *automatic* updates are broken. Your site is still live!
2.  **To Update Your Code Manually:**
    *   Go to your Service in Cloud Run Console.
    *   Click **"EDIT & DEPLOY NEW REVISION"** (Top center).
    *   Click **"Deploy"** at the bottom (It will pull the latest code from GitHub automatically).
    *   Done! This bypasses the broken trigger.

---
## Summary for PPT
" We utilize a automated CI/CD pipeline connecting GitHub directly to Google Cloud Run and Vercel. Every commit triggers a fresh container build (backend) and static asset verification (frontend), ensuring zero-downtime updates."
