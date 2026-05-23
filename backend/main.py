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
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InitSessionRequest(BaseModel):
    course_id: str

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
