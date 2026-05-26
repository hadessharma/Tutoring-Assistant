import os
from supabase import create_client, Client
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    os.environ["GOOGLE_API_KEY"] = api_key
llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.4)

CURRICULUM_PROMPT = """You are an expert curriculum designer for university-level courses.
You have been provided with a list of specific conceptual weaknesses and gaps identified from a student's recent tutoring sessions in the course: {course_id}.

Student Weaknesses:
{weaknesses}

Based on these weaknesses, generate a highly structured, markdown-formatted study curriculum.
The curriculum must include:
1. A brief encouraging introduction.
2. A step-by-step roadmap broken down into manageable study blocks (e.g., "Block 1: Fundamentals of X").
3. For each block, provide targeted explanations addressing the micro-gaps.
4. Suggested practice problems or actionable exercises to test their understanding.
5. Emphasize standard academic integrity (remind them to learn the process, not just the answers).

Output purely the markdown content.
"""

async def generate_curriculum(course_id: str, session_id: str) -> str:
    """
    Analyze interaction logs for weaknesses and generate a study curriculum.
    """
    if not supabase:
        raise ValueError("Supabase client not initialized")
        
    # Fetch interaction logs for the session to extract weaknesses
    response = supabase.table('interaction_logs').select('detected_weaknesses, raw_message').eq('session_id', session_id).execute()
    
    all_weaknesses = set()
    chat_history = []
    
    if response.data:
        for row in response.data:
            if row.get('detected_weaknesses'):
                for w in row['detected_weaknesses']:
                    all_weaknesses.add(w)
            chat_history.append(row.get('raw_message', ''))
            
    # If no explicitly detected weaknesses exist, we could ask the LLM to analyze the raw chat history.
    weaknesses_text = ""
    if all_weaknesses:
        weaknesses_text = "\n".join(f"- {w}" for w in all_weaknesses)
    else:
        # Fallback: extract from raw chat if explicit tracking wasn't used yet
        analysis_prompt = ChatPromptTemplate.from_messages([
            ("system", "Analyze the following chat history between a tutor and student. Identify 2-3 specific technical concepts the student is struggling with. List them as bullet points."),
            ("human", "{chat_history}")
        ])
        analysis_chain = analysis_prompt | llm
        
        chat_text = "\n".join(chat_history[-10:]) if chat_history else "Student asked basic questions about the course."
        analysis_result = await analysis_chain.ainvoke({"chat_history": chat_text})
        weaknesses_text = analysis_result.content

    # Generate the curriculum
    prompt = ChatPromptTemplate.from_messages([
        ("user", CURRICULUM_PROMPT)
    ])
    
    chain = prompt | llm
    curriculum = await chain.ainvoke({
        "course_id": course_id,
        "weaknesses": weaknesses_text
    })
    
    return curriculum.content
