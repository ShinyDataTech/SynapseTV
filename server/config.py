"""Configuration module for SynapseTV AI Orchestration Gateway."""

import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    # Server configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    # AWS Configuration
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    AWS_SESSION_TOKEN: str = os.getenv("AWS_SESSION_TOKEN", "")
    
    # Amazon Bedrock Model Configuration
    BEDROCK_LLM_MODEL_ID: str = os.getenv(
        "BEDROCK_LLM_MODEL_ID", "anthropic.claude-3-5-sonnet-20241022-v2:0"
    )
    BEDROCK_VISION_MODEL_ID: str = os.getenv(
        "BEDROCK_VISION_MODEL_ID", "amazon.titan-multimodal-embed-v1"
    )
    BEDROCK_FAST_MODEL_ID: str = os.getenv(
        "BEDROCK_FAST_MODEL_ID", "anthropic.claude-3-haiku-20240307-v1:0"
    )
    
    # AgentCore and Ingestion Controls
    USE_MOCK_AWS_FALLBACK: bool = os.getenv("USE_MOCK_AWS_FALLBACK", "true").lower() == "true"
    DEFAULT_CONFIDENCE_THRESHOLD: float = 0.85
    STREAM_INTERVAL_SECONDS: float = 1.0

settings = Settings()
