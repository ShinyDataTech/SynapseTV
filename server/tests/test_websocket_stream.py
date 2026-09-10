"""Integration test for FastAPI REST API and WebSocket endpoints."""

import pytest
import os
import sys
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "bedrock_model" in data

def test_scenes_endpoint():
    response = client.get("/api/scenes")
    assert response.status_code == 200
    data = response.json()
    assert "cast" in data
    assert len(data["cast"]) > 0

def test_sports_endpoint():
    response = client.get("/api/sports")
    assert response.status_code == 200
    data = response.json()
    assert "fixture" in data
    assert "player_roster" in data

def test_query_endpoint():
    payload = {
        "prompt": "Who is Elena Vance?",
        "timecode": 12,
        "mode": "movie"
    }
    response = client.post("/api/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "Elena" in data["ai_insight"] or "Character" in data["ai_insight"]

def test_websocket_timecode_sync():
    with client.websocket_connect("/ws/stream/test-session-123") as websocket:
        websocket.send_json({"type": "timecode_update", "timecode": 15, "mode": "sports"})
        data = websocket.receive_json()
        assert data["type"] == "hud_sync"
        assert data["timecode"] == 15
        assert data["mode"] == "sports"
        assert data["payload"]["fixture"] == "Arsenal FC vs Manchester City"
