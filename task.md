# Tutoring Assistant - Project Tasks

## Phase 1: Project Initialization
- [X] Rename `PRD.txt` to `PRD.md`
- [X] Initialize Git repository
- [X] Create `task.md` for tracking progress (Done)

## Phase 2: Frontend Setup (Next.js)
- [X] Initialize Next.js project with TypeScript and Tailwind CSS
- [X] Clean up boilerplate code
- [X] Set up basic routing and layout

## Phase 3: Backend Setup (Python/FastAPI)
- [X] Initialize Python environment (venv)
- [X] Install FastAPI, Uvicorn, LangChain, and other dependencies
- [X] Create basic FastAPI server structure

## Phase 4: Database Setup (Supabase/PostgreSQL)
- [X] Set up Supabase/Neon project
- [X] Enable `pgvector` extension
- [X] Execute SQL DDL to create tables (`course_knowledge_base`, `tutoring_sessions`, `interaction_logs`)

## Phase 5: Core Features Implementation
- [ ] **Feature 1: Course Selection UI**
  - [ ] Build UI to force course code selection before chat
  - [ ] Pass `course_id` to all backend requests
- [ ] **Feature 2: Dual-Layer Socratic Guardrails**
  - [ ] Implement pre-processing prompt guardrails
  - [ ] Implement post-processing audit (Llama 3 Guard)
- [ ] **Feature 3: Course-Filtered RAG Pipeline**
  - [ ] Implement embedding generation for course materials
  - [ ] Build hybrid retrieval query with `course_id` metadata filtering
- [ ] **Feature 4: Thematic Curriculum Generator**
  - [ ] Analyze interaction logs for weaknesses
  - [ ] Generate markdown-formatted study curriculums

## Phase 6: UI Polish & Integration
- [ ] Connect Frontend chat interface to Backend API
- [ ] Implement Optimistic UI / Loading states to mask cold starts
- [ ] Ensure full responsiveness and accessibility

## Phase 7: Deployment
- [ ] Deploy Frontend to Vercel
- [ ] Deploy Backend to Render/Koyeb
- [ ] End-to-End testing
