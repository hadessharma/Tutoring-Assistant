# Tutoring Assistant

A course-centric, compliant, Socratic tutoring assistant built for university environments. The assistant helps students understand concepts and work through problems without ever providing direct solutions, strictly adhering to academic integrity policies.

## Architecture

This project is designed to be deployed on a 100% free hobby stack:
- **Frontend:** Next.js / React / Tailwind CSS (Deployable on Vercel)
- **Backends:** Python / FastAPI / LangChain (Deployable on Render/Koyeb)
  - `student-backend`: Handles low-latency chat, RAG retrieval, and guardrails.
  - `admin-backend`: Handles data-heavy tasks like document ingestion, embeddings, and analytics.
  - `shared-core`: Local Python package for shared database models and AI logic.
- **Database:** Supabase / PostgreSQL with `pgvector` for RAG capabilities
- **LLM Engine:** Google Gemini 1.5 Flash via Google AI Studio

## Local Setup

### 1. Database (Supabase)
1. Create a new project on [Supabase](https://supabase.com/).
2. Navigate to the SQL Editor in your Supabase dashboard.
3. Copy the contents of `student-backend/schema.sql` and run it to set up the necessary tables and enable the `pgvector` extension.
4. Retrieve your Project URL and anon/service_role API Key from the project settings.

### 2. Backend Services Setup

The backend is split into two microservices (`student-backend` and `admin-backend`) that share code via a local `shared-core` package.

1. **Install Shared Core:**
   The shared core is installed as an editable dependency (`-e ../shared-core`) within each backend's requirements.

2. **Student Backend Setup:**
   ```bash
   cd student-backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env  # Fill in GEMINI_API_KEY, SUPABASE_URL, SUPABASE_KEY
   uvicorn main:app --reload --port 8000
   ```

3. **Admin Backend Setup:**
   In a new terminal window:
   ```bash
   cd admin-backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cp ../student-backend/.env .env  # Use the same credentials
   uvicorn main:app --reload --port 8001
   ```

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

### 1. Deploying the Backends (Render)

You will need to create two "Web Services" on Render, one for the student API and one for the admin API.

1. Create an account on [Render](https://render.com/) and click "New Web Service".
2. Connect your GitHub repository.
3. Set the following configuration for the **Student Backend**:
   - **Root Directory:** `student-backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 10000`
4. Set the following configuration for the **Admin Backend**:
   - **Root Directory:** `admin-backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 10001`
5. Add your Environment Variables (`GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`) to both services.

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
