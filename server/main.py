"""FastAPI Gateway & AI Orchestrator for SynapseTV.

Exposes REST and WebSocket endpoints for Amazon Fire TV Leanback clients,
connecting to Amazon Bedrock multimodal models and AWS AgentCore tools.
"""

import json
import logging
from typing import Dict, Any, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from config import settings
from bedrock_agent import BedrockAgent
from agent_core import AgentCoreOrchestrator
from context_streamer import ContextStreamEngine

logger = logging.getLogger("synapse_api")
logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="SynapseTV AI Gateway",
    description="Contextual Multimodal AI On-Screen Co-Pilot for Amazon Fire TV",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Core Services
bedrock_agent = BedrockAgent()
agent_core = AgentCoreOrchestrator()
stream_engine = ContextStreamEngine()

class QueryRequest(BaseModel):
    prompt: str
    timecode: int = 0
    mode: str = "movie"
    subtitle_text: Optional[str] = ""
    characters_present: Optional[list] = []

class QueryResponse(BaseModel):
    status: str
    prompt: str
    timecode: int
    ai_insight: str
    model: str
    tool_action: Optional[Dict[str, Any]] = None
    suggested_followups: list = []

@app.get("/health")
async def health_check():
    return {
        "status": "online",
        "service": "SynapseTV Gateway",
        "aws_region": settings.AWS_REGION,
        "bedrock_model": settings.BEDROCK_LLM_MODEL_ID,
        "mock_fallback_active": settings.USE_MOCK_AWS_FALLBACK,
        "supported_modes": ["movie", "sports"]
    }

@app.get("/api/scenes")
async def get_scenes():
    return stream_engine.movies

@app.get("/api/sports")
async def get_sports():
    return stream_engine.sports

@app.post("/api/query", response_model=QueryResponse)
async def process_viewer_query(req: QueryRequest):
    """Processes a viewer voice or remote query via AWS AgentCore and Amazon Bedrock."""
    try:
        # Step 1: AgentCore tool routing
        agent_core_res = await agent_core.route_natural_language_query(req.prompt, req.timecode)
        
        # Step 2: Bedrock Multimodal Reasoning
        scene_summary = f"Mode: {req.mode}. Current play/scene at timecode {req.timecode}s"
        bedrock_res = await bedrock_agent.analyze_scene_context(
            timecode=req.timecode,
            subtitle_text=req.subtitle_text or "Dialogue in progress...",
            scene_summary=scene_summary,
            characters=req.characters_present or ["Elena Vance"],
            user_prompt=req.prompt
        )

        return QueryResponse(
            status="success",
            prompt=req.prompt,
            timecode=req.timecode,
            ai_insight=bedrock_res.get("insight", "Information retrieved."),
            model=bedrock_res.get("model", settings.BEDROCK_LLM_MODEL_ID),
            tool_action=agent_core_res,
            suggested_followups=bedrock_res.get("suggested_actions", [
                "Who is this character?",
                "Show stats",
                "Explain the play"
            ])
        )
    except Exception as e:
        logger.exception("Error processing viewer query: %s", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/stream/{session_id}")
async def websocket_stream(websocket: WebSocket, session_id: str):
    """Bi-directional WebSocket connection for Fire TV timecode telemetry and instant HUD events."""
    await websocket.accept()
    logger.info("WebSocket client connected. Session: %s", session_id)
    
    try:
        while True:
            raw_msg = await websocket.receive_text()
            data = json.loads(raw_msg)
            msg_type = data.get("type", "timecode_update")
            
            if msg_type == "timecode_update":
                timecode = int(data.get("timecode", 0))
                mode = data.get("mode", "movie")
                
                # Fetch synchronized contextual events from stream engine
                event_payload = stream_engine.get_events_for_timecode(mode, timecode)
                
                response_payload = {
                    "type": "hud_sync",
                    "session_id": session_id,
                    "timecode": timecode,
                    "mode": mode,
                    "payload": event_payload
                }
                await websocket.send_text(json.dumps(response_payload))
                
            elif msg_type == "voice_query":
                prompt = data.get("prompt", "")
                timecode = int(data.get("timecode", 0))
                mode = data.get("mode", "movie")
                
                # AgentCore + Bedrock evaluation
                agent_res = await agent_core.route_natural_language_query(prompt, timecode)
                bedrock_res = await bedrock_agent.analyze_scene_context(
                    timecode=timecode,
                    subtitle_text="",
                    scene_summary=f"Viewer voice query in {mode} mode",
                    characters=["Elena Vance", "Marcus Reed"],
                    user_prompt=prompt
                )
                
                response_payload = {
                    "type": "voice_response",
                    "session_id": session_id,
                    "prompt": prompt,
                    "insight": bedrock_res.get("insight"),
                    "tool_action": agent_res,
                    "confidence": bedrock_res.get("confidence", 0.95)
                }
                await websocket.send_text(json.dumps(response_payload))
                
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected for session: %s", session_id)
    except Exception as e:
        logger.error("WebSocket error on session %s: %s", session_id, e)
        try:
            await websocket.close()
        except:
            pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
