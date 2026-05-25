import os
from supabase import create_client, Client
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

# Initialize embeddings matching Gemini's 768 dimension output
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

async def generate_and_store_embeddings(course_id: str, document_title: str, content: str):
    """
    Generate embeddings for course material and store in Supabase.
    """
    if not supabase:
        raise ValueError("Supabase client not initialized")
        
    # Simple chunking logic (in a real app, use Langchain's text splitters)
    chunk_size = 1000
    chunks = [content[i:i+chunk_size] for i in range(0, len(content), chunk_size)]
    
    for chunk in chunks:
        # Generate 768-dimensional embedding
        vector = embeddings.embed_query(chunk)
        
        # Store in vector db
        supabase.table('course_knowledge_base').insert({
            "course_id": course_id,
            "document_title": document_title,
            "content": chunk,
            "embedding": vector
        }).execute()
        
    return {"status": "success", "chunks_processed": len(chunks)}

async def retrieve_course_context(course_id: str, query: str, top_k: int = 3) -> str:
    """
    Retrieve relevant course context using metadata filtering on course_id.
    """
    if not supabase:
        return ""
        
    try:
        query_vector = embeddings.embed_query(query)
        
        # Call the RPC function defined in schema.sql for course-filtered vector search
        response = supabase.rpc(
            'match_course_documents',
            {
                'query_embedding': query_vector,
                'match_threshold': 0.6,
                'match_count': top_k,
                'filter_course_id': course_id
            }
        ).execute()
        
        if response.data:
            contexts = [item['content'] for item in response.data]
            return "\n\n".join(contexts)
        return ""
        
    except Exception as e:
        print(f"Error retrieving context: {e}")
        return ""
