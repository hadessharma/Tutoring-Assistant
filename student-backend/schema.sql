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

-- Vector matching RPC function with course_id filtering
CREATE OR REPLACE FUNCTION match_course_documents(
    query_embedding vector(768),
    match_threshold float,
    match_count int,
    filter_course_id varchar
)
RETURNS TABLE (
    chunk_id uuid,
    document_title varchar,
    content text,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        ckb.chunk_id,
        ckb.document_title,
        ckb.content,
        1 - (ckb.embedding <=> query_embedding) AS similarity
    FROM course_knowledge_base ckb
    WHERE ckb.course_id = filter_course_id
      AND 1 - (ckb.embedding <=> query_embedding) > match_threshold
    ORDER BY ckb.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
