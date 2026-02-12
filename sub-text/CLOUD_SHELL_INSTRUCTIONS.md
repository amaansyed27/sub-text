# 🚨 CRITICAL FIX: Force New Build via Cloud Shell

**Project: sub-text-ai**

**The Problem:**
The "Edit & Deploy" button you are clicking is just re-deploying the **OLD** version of your code. It is NOT building the new code (with the CORS fixes). That is why the error persists.

**The Solution:**
We will use **Google Cloud Shell** (a terminal inside your browser) to force a fresh build.

### Steps (Do this NOW):

1.  **Open Cloud Shell**:
    *   Look at the top-right of the Google Cloud Console.
    *   Click the icon that looks like a **Terminal Prompt `>_`** (Activate Cloud Shell).
    *   Wait for it to connect.

2.  **Run these commands** (Copy and paste them one by one):

    ```bash
    # 1. Clone your code
    git clone https://github.com/amaansyed27/sub-text.git

    # 2. Go to the backend folder
    cd sub-text/backend

    # 3. Deploy from source to the CORRECT PROJECT
    gcloud run deploy subtext-backend --source . --region asia-south1 --project sub-text-ai --allow-unauthenticated
    ```

3.  **Answer the prompts**:
    *   If it asks "authorized to perform this action?", press **y** (or just Enter).
    *   If it asks about "API enabling", press **y**.

4.  **Wait for the Green Checkmark**:
    *   It will say "Service [sub-text-backend] has been deployed..."
    *   **Verify the URL**: It might give you a slightly different URL. If it does, update Vercel. If it's the same, you're good.

5.  **Test**:
    *   Go to your site (`https://sub-text.vercel.app`) and refresh.
    *   Upload a PDF. It should work now! 🚀
