from setuptools import setup, find_packages

setup(
    name="tutoring_shared",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "supabase",
        "langchain",
        "langchain-google-genai",
        "python-dotenv",
        "pydantic"
    ]
)
