# Tutoring Assistant

A course-centric, compliant, Socratic tutoring assistant built for university environments. The assistant helps students understand concepts and work through problems without ever providing direct solutions, strictly adhering to academic integrity policies.

## Architecture

This project is designed to be deployed on a 100% free hobby stack:
- **Frontend:** Next.js / React / Tailwind CSS (Deployable on Vercel)
- **Backend:** Python / FastAPI / LangChain (Deployable on Render/Koyeb)
- **Database:** Supabase / PostgreSQL with `pgvector` for RAG capabilities
- **LLM Engine:** Google Gemini 1.5 Flash via Google AI Studio

## Local Setup

### 1. Database (Supabase)
1. Create a new project on [Supabase](https://supabase.com/).
2. Navigate to the SQL Editor in your Supabase dashboard.
3. Copy the contents of `backend/schema.sql` and run it to set up the necessary tables and enable the `pgvector` extension.
4. Retrieve your Project URL and anon/service_role API Key from the project settings.

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
5. Fill in the `.env` file with your `GEMINI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_KEY`.
6. Start the development server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be available at `http://localhost:8000`.

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`.

## Production Deployment

### 1. Deploying the Backend (Render)
1. Create an account on [Render](https://render.com/) and click "New Web Service".
2. Connect your GitHub repository.
3. Set the following configuration:
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 10000`
4. Add your Environment Variables (`GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`).
5. Click **Deploy Web Service**.

### 2. Deploying the Frontend (Vercel)
1. Create an account on [Vercel](https://vercel.com/) and click "Add New Project".
2. Import your GitHub repository.
3. Vercel will automatically detect that it is a Next.js project.
4. If your frontend makes absolute URL calls to the backend, make sure to update the base URL in your frontend fetch calls to point to your deployed Render backend URL.
5. Click **Deploy**.

## Features
- **Strict Socratic Guardrails**: Prevents code generation or direct answers. 
- **Course Isolation**: All sessions are strictly partitioned by course code to maintain contextual accuracy.
- **RAG Pipeline**: Retrieves course-specific materials stored in vector databases to inform tutoring sessions.
- **Curriculum Generation**: Automatically compiles study plans based on identified student weaknesses.
