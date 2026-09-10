"""Unit tests for AWS AgentCore tool execution and routing."""

import pytest
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agent_core import AgentCoreOrchestrator

@pytest.mark.asyncio
async def test_agent_core_actor_tool():
    orchestrator = AgentCoreOrchestrator()
    res = await orchestrator.execute_tool("get_actor_character_info", {"query_name": "Elena"})
    
    assert res["status"] == "success"
    assert res["character"] == "Dr. Elena Vance"
    assert res["actor"] == "Talia Ramos"

@pytest.mark.asyncio
async def test_agent_core_sports_tool():
    orchestrator = AgentCoreOrchestrator()
    res = await orchestrator.execute_tool("get_sports_player_telemetry", {"player_name": "Saka"})
    
    assert res["status"] == "success"
    assert res["player_data"]["name"] == "Bukayo Saka"
    assert "34.8" in res["player_data"]["sprint_speed"]

@pytest.mark.asyncio
async def test_agent_core_rule_breakdown():
    orchestrator = AgentCoreOrchestrator()
    res = await orchestrator.execute_tool("explain_referee_rule", {"rule_topic": "offside"})
    
    assert res["status"] == "success"
    assert "Offside" in res["topic"]

@pytest.mark.asyncio
async def test_natural_language_routing():
    orchestrator = AgentCoreOrchestrator()
    res = await orchestrator.route_natural_language_query("Who is Elena Vance?")
    
    assert res["tool_used"] == "get_actor_character_info"
    assert res["result"]["status"] == "success"
