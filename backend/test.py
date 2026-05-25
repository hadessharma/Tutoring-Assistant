import asyncio
from main import chat, ChatMessageRequest

async def test():
    req = ChatMessageRequest(course_id="CSE110", message="Hello")
    try:
        res = await chat(req)
        print("Success:", res)
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())
