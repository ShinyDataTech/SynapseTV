"""Unit tests for Amazon Bedrock multimodal reasoning agent."""

import pytest
import asyncio
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from bedrock_agent import BedrockAgent

@pytest.mark.asyncio
async def test_bedrock_agent_scene_analysis():
    agent = BedrockAgent()
    res = await agent.analyze_scene_context(
        timecode=14,
        subtitle_text="Harmonic frequency matched at 4.2Hz",
        scene_summary="Elena deciphers ancient beacon",
        characters=["Dr. Elena Vance"]
    )
    
    assert res is not None
    assert "insight" in res
    assert res["timecode"] == 14
    assert res["confidence"] >= 0.8
    assert "Elena" in res["insight"] or "Scene" in res["insight"]

@pytest.mark.asyncio
async def test_bedrock_agent_sports_query():
    agent = BedrockAgent()
    res = await agent.analyze_scene_context(
        timecode=25,
        subtitle_text="",
        scene_summary="Premier League breakaway",
        characters=["Bukayo Saka"],
        user_prompt="What was the player sprint speed?"
    )
    
    assert res is not None
    assert "insight" in res
    assert "34.8" in res["insight"] or "Speed" in res["insight"] or "Telemetry" in res["insight"]
