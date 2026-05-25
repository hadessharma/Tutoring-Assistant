import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini models
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.2)
audit_llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.0)

SOCRATIC_SYSTEM_PROMPT = """You are a strictly compliant university Tutoring Assistant.
Your objective is to guide the student to the answer using the Socratic method.
CRITICAL RULES:
1. NEVER provide direct solutions to homework, coding problems, or math equations.
2. NEVER write complete code blocks that solve the user's problem. You may only provide pseudo-code or very small syntax examples if absolutely necessary.
3. If the user asks for the answer, "give me the code", or any direct solution, politely refuse and ask a guiding question to help them figure it out.
4. Your responses must be scoped to the course: {course_id}.

COURSE CONTEXT TO USE (if relevant):
{context}
"""

AUDIT_SYSTEM_PROMPT = """You are a compliance officer auditing an AI tutor's response for academic integrity violations.
Analyze the following response from the AI tutor.
Does it contain a direct solution, a completed homework answer, or full functional code blocks that solve a problem?
Respond with only 'SAFE' if the response is compliant and follows the Socratic method (guiding questions, hints, no direct answers), or 'VIOLATION' if it gives away the answer.
"""

from .rag_service import retrieve_course_context

async def generate_socratic_response(course_id: str, user_message: str) -> str:
    """Pre-processing guardrail and response generation."""
    # Retrieve context from vector db
    context = await retrieve_course_context(course_id, user_message)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", SOCRATIC_SYSTEM_PROMPT),
        ("human", "{user_message}")
    ])
    
    chain = prompt | llm
    response = await chain.ainvoke({
        "course_id": course_id,
        "context": context if context else "No additional context found.",
        "user_message": user_message
    })
    
    return response.content

async def audit_response(ai_response: str) -> bool:
    """Post-processing audit to detect direct answers. Returns True if SAFE, False if VIOLATION."""
    prompt = ChatPromptTemplate.from_messages([
        ("system", AUDIT_SYSTEM_PROMPT),
        ("human", "{ai_response}")
    ])
    
    chain = prompt | audit_llm
    result = await chain.ainvoke({
        "ai_response": ai_response
    })
    
    decision = result.content.strip().upper()
    return 'SAFE' in decision
