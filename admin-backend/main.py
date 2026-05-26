from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

# We will import from tutoring_shared once we migrate the logic
# from tutoring_shared.services.rag_service import generate_and_store_embeddings

app = FastAPI(
    title="Admin Portal API",
    description="Backend for the Tutoring Assistant Admin Portal",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "admin-backend"}

@app.post("/api/admin/upload")
async def upload_document(
    course_id: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Endpoint for admins to upload course materials.
    Parses the file and stores embeddings in the database.
    """
    if not file.filename.endswith(('.txt', '.pdf', '.md')):
        raise HTTPException(status_code=400, detail="Only txt, pdf, and md files are supported.")
        
    content = await file.read()
    text_content = content.decode('utf-8', errors='ignore')
    
    # TODO: Implement generate_and_store_embeddings from tutoring_shared
    # result = await generate_and_store_embeddings(course_id, file.filename, text_content)
    
    return {
        "status": "success",
        "message": f"Successfully processed {file.filename} for course {course_id}",
        "document_title": file.filename
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
