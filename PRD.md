# Product Requirement Document (PRD)

**Project:** Tutoring Assistant (Course-Centric & Compliant Architecture)  
**Version:** 1.0  
**Status:** Approved for Implementation  
**Target Environment:** 100% Free Hobby Stack  

---

## 1. Executive Summary & Product Vision

### 1.1 Problem Statement
University tutoring centers face a dual challenge: handling high volumes of varied student requests while strictly enforcing academic integrity guidelines. Traditional AI solutions often act as "answer engines," generating complete code blocks, direct math answers, or essay paragraphs. This violates institutional policies, such as Arizona State University’s (ASU) Academic Integrity Policy, and impedes genuine student learning. Furthermore, valuable educational data remains trapped in unstructured chat logs, syllabi, and tutoring session transcripts.

### 1.2 Product Vision
The Tutoring Assistant transforms the tutoring lifecycle by converting raw conversational data and course resources into customized, structured study plans without ever revealing direct homework solutions. Operating as a strict Socratic guide, the assistant identifies foundational learning gaps and constructs an explicit, course-partitioned, step-by-step path to conceptual mastery.

### 1.3 Strategic Value (The Course-Scoped Pivot)
By forcing students to select their exact course code (e.g., CSE 110, MAT 266, CSE 310) at the start of a session, the system completely isolates context boundaries. This approach eliminates vector search dilution, ensures course-appropriate pedagogical difficulty, and enables precise analytical breakdowns for department chairs.

---

## 2. Product Objectives & Success Metrics

### 2.1 Core Objectives
* **100% Compliance Enforcement:** Prevent any instance of direct code generation or final solution delivery.
* **Contextual Scoping:** Anchor all AI interactions, vector indexes, and historical logs to a user-selected course.
* **Thematic Synthesis:** Abstract unstructured interaction logs into actionable, timeline-oriented review curriculums.
* **Zero-Dollar Infrastructure:** Deploy a production-ready application using free-tier developer platforms without sacrificing performance.

### 2.2 Success Metrics (KPIs)
* **Compliance Leakage:** 0% (Verified through secondary LLM evaluation filters).
* **Retrieval Precision:** >90% relevant resource matching by strictly filtering vector data by course_id.
* **User Retention/Completion:** Rate of students completing milestones within their synthesized curriculums.
* **System Reliability:** Minimal impact from container cold-starts, mitigated by predictive UI loading states.

---

## 3. User Personas & Target Audience

### 3.1 The Student (e.g., Marcus, Sophomore Computer Science Major)
* **Needs:** Immediate assistance navigating complex projects in CSE 310 (Data Structures & Algorithms); structured guidance when studying for exams.
* **Pain Points:** Gets stuck on abstract concepts like pointer manipulation; finds generic AI tools unhelpful because they write the code instead of teaching the logic.

### 3.2 The Tutor / Lead Instructor (e.g., Dr. Sarah Lin)
* **Needs:** Visibility into what concepts are tripping up students on a weekly basis; a reliable tool that enforces course-specific guidelines.
* **Pain Points:** Overwhelmed by the volume of repetitive basic questions; concerned about academic dishonesty via standard LLM apps.

### 3.3 The Administrator (e.g., Compliance & Operations Officer)
* **Needs:** Indisputable auditing trails showing that the automated system adheres strictly to university standards and FERPA rules.

---

## 4. Functional Requirements & Feature Specifications

### 4.1 Feature 1: Course Selection & Partitioned Initialization
* **Description:** The user interface forces a hard choice of the specific course code prior to opening chat or uploading transcripts.
* **Requirements:**
    - Frontend must pass a validated course_id with every backend request payload.
    - The system initializes session tracking partitioned explicitly by that course ID.
    - The UI updates dynamically to show targeted course details, reference materials, and matching instructions.

### 4.2 Feature 2: Dual-Layer Socratic Guardrails
* **Description:** A strict system boundary preventing direct solution leakage.
* **Requirements:**
    - **Pre-Processing Check:** Prompt injections or direct commands like "give me the code" must trigger an automated, friendly Socratic refusal: "I cannot provide the code, but let's break down the logic step-by-step."
    - **Post-Processing Review:** A secondary, highly performant, open-source model (e.g., Llama 3 Guard) must scan the assistant's response. If any raw function answers or finalized solutions are detected, the response is discarded and re-routed.

### 4.3 Feature 3: Course-Filtered Multi-Source RAG Pipeline
* **Description:** A retrieval-augmented generation engine pulling from syllabi, lecture slides, textbooks, and anonymized call audio transcripts.
* **Requirements:**
    - Vector search queries MUST run metadata filtering arrays: `{"course_id": selected_course_id}`.
    - Hybrid retrieval combining Dense Semantic Vectors with Keyword Matching (BM25) to properly capture obscure technical terms in specialized engineering courses.

### 4.4 Feature 4: Thematic Curriculum Generator
* **Description:** An orchestration worker that reads conversational gaps and compiles a markdown-formatted, time-bound study curriculum.
* **Requirements:**
    - Analyze chat histories to detect micro-gaps (e.g., user understands arrays but fails at dynamic resizing).
    - Output a clean, weekly or topic-by-topic roadmap mapping specific gaps to textbook pages, video links, and custom practice problems.

---

## 5. Technical Architecture & Component Selection (Hobby Stack)

To run this platform at absolute zero financial cost, the enterprise cloud footprint is replaced with high-utility free tiers:

```text
+-------------------------------------------------------------+
|                        Vercel UI                            |
|             (Next.js / TypeScript / Tailwind)               |
+-------------------------------------------------------------+
                               |
                               | (Asynchronous API Calls)
                               v
+-------------------------------------------------------------+
|                        Render API                           |
|               (FastAPI / Python / LangChain)                |
+-------------------------------------------------------------+
              |                                |
              | (Filtered Vector Search)       | (Inference Calls)
              v                                v
+---------------------------------------+    +----------------+
|             Supabase DB               |    | Google Studio  |
| (PostgreSQL + pgvector / 500MB Cap)   |    | (Gemini 1.5)   |
+---------------------------------------+    +----------------+
```

### 5.1 Component Breakdown
1. **Frontend (Vercel):** Hosts the static and serverless components of the Next.js app. Zero-cost tier covers infinite personal builds and automated edge routing.
2. **Backend API (Render / Koyeb):** Operates the Python FastAPI application executing LangChain/LangGraph pipelines.
3. **Vector & Relational Storage (Supabase / Neon):** Runs managed PostgreSQL with the pgvector extension enabled natively. Provides up to 500MB of free permanent transactional and vector data space.
4. **Inference Engine (Google AI Studio / Groq):** Leverages Gemini 1.5 Flash or Llama 3 models via free developer API keys with highly generous requests-per-minute (RPM) allocations.

---

## 6. Data Architecture & Schema Definitions

The storage layer enforces strict relational constraints to isolate and protect student data per course code.

### 6.1 Database Schema (SQL DDL)

```sql
-- Enable vector processing inside Supabase/Neon
CREATE EXTENSION IF NOT EXISTS vector;

-- Table to store coarse contextual material per class
CREATE TABLE course_knowledge_base (
    chunk_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id VARCHAR(20) NOT NULL,
    document_title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    embedding vector(768), -- Dimension size matching free Gemini embeddings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optimize semantic lookups scoped by course
CREATE INDEX ON course_knowledge_base USING hnsw (embedding vector_cosine_ops);

-- User Interaction Session Tracking
CREATE TABLE tutoring_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_hash VARCHAR(64) NOT NULL, -- Anonymized student identifier for FERPA compliance
    course_id VARCHAR(20) NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat History Records 
CREATE TABLE interaction_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES tutoring_sessions(session_id) ON DELETE CASCADE,
    sender_role VARCHAR(15) CHECK (sender_role IN ('student', 'assistant')),
    raw_message TEXT NOT NULL,
    detected_weaknesses TEXT[], -- Array of strings mapping student gaps
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 7. System Sequence Flow

The processing loop ensures data validation, filtering, and guardrail verification occur sequentially before any student receives text.

```text
Student Frontend          Render Backend API            Supabase Vector DB         Gemini / Groq LLM
       |                          |                             |                          |
       |--- 1. Send Query ------->|                             |                          |
       |    (Course + Prompt)     |                             |                          |
       |                          |--- 2. Apply Hard Filter --->|                          |
       |                          |       {"course_id": 'X'}    |                          |
       |                          |                             |                          |
       |                          |<-- 3. Return Raw Context ---|                          |
       |                          |                                                        |
       |                          |--- 4. Execute Prompt + Context + Guardrail Config ---->|
       |                          |                                                        |
       |                          |<-- 5. Return Socratic Draft Response ------------------|
       |                          |                                                        |
       |                          |--- 6. Pass Output to Llama Guard Audit --------------->|
       |                          |                                                        |
       |                          |<-- 7. Confirm Compliance Status -----------------------|
       |                          |                                                        |
       |<-- 8. Stream Response ---|                                                        |
       |    (Safe & Compliant)    |                                                        |
```

---

## 8. Non-Functional Requirements & Free-Tier Mitigations

### 8.1 Performance & Cold-Start Resilience
* **Constraint:** Free containers on Render go to sleep after 15 minutes of inactivity, resulting in a 30-50 second delay on initial boot.
* **Mitigation:** The Next.js frontend will maintain an optimistic UI state. Upon catching a delayed health check, it loads a localized cache of "Daily Study Tips" alongside an interactive loading bar explaining that the system is safely booting the isolated sandbox.

### 8.2 FERPA & Privacy Guardrails
* **Constraint:** Free-tier usage cannot rely on costly on-prem enterprise data protection agreements.
* **Mitigation:** The FastAPI backend implements an anonymization middleware. Raw student IDs and names are scrubbed or hashed using SHA-256 before payloads reach public inference layers. No personally identifiable information (PII) is ever saved or sent across third-party networks.

### 8.3 Storage Management
* **Constraint:** 500MB data caps on Supabase free tier.
* **Mitigation:** Vector embeddings will utilize Gemini-1.5-Flash or light open-source text models optimized to 768 dimensions. Old chat histories exceeding 90 days are run through automated aggregation routines—compressing full transcript strings into concise, low-byte summary blocks.
