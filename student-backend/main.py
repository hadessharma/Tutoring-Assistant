from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Tutoring Assistant API",
    description="Backend for the Course-Centric Socratic Tutoring Assistant",
    version="1.0.0"
)

# Allow CORS from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InitSessionRequest(BaseModel):
    course_id: str

class ChatMessageRequest(BaseModel):
    course_id: str
    message: str
    history: list[dict] = []  # List of past messages e.g., [{"role": "user", "content": "..."}, ...]

@app.get("/api/health")
async def health_check():
    """Health check endpoint to ensure server is running."""
    return {"status": "healthy"}

@app.post("/api/session/init")
async def init_session(request: InitSessionRequest):
    """
    Initialize a tutoring session locked to a specific course.
    """
    # TODO: Generate session_id, hash student_id, and save to Supabase
    return {
        "status": "success", 
        "course_id": request.course_id,
        "message": f"Session initialized for {request.course_id}. Vector context isolated."
    }

from tutoring_shared.services.llm_service import generate_socratic_response, audit_response

@app.post("/api/chat")
async def chat(request: ChatMessageRequest):
    """
    Chat endpoint with pre-processing guardrails and post-processing audit.
    """
    # 1. Pre-processing Guardrails & Generation
    draft_response = await generate_socratic_response(request.course_id, request.message, request.history)
    
    # 2. Post-processing Audit
    is_safe = await audit_response(draft_response)
    
    if not is_safe:
        return {
            "status": "error",
            "message": "I apologize, but I cannot provide a direct answer. Let's work through this step-by-step instead."
        }
        
    return {
        "status": "success",
        "response": draft_response
    }

class CurriculumRequest(BaseModel):
    course_id: str
    session_id: str

from tutoring_shared.services.curriculum_service import generate_curriculum

@app.post("/api/curriculum/generate")
async def create_curriculum(request: CurriculumRequest):
    """
    Generate a markdown-formatted study curriculum based on student weaknesses.
    """
    try:
        curriculum_md = await generate_curriculum(request.course_id, request.session_id)
        return {
            "status": "success",
            "curriculum": curriculum_md
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
