"""Context Streaming Engine for SynapseTV.

Synchronizes video playback timecodes with live AI annotations,
trivia popups, and sports telemetry for Fire TV Leanback HUD clients.
"""

import json
import os
import asyncio
from typing import Dict, Any, Optional, List
import logging

logger = logging.getLogger("synapse_streamer")

class ContextStreamEngine:
    def __init__(self, data_dir: Optional[str] = None):
        if data_dir is None:
            data_dir = os.path.join(os.path.dirname(__file__), "data")
        self.data_dir = data_dir
        self.movies = self._load_json("sample_movies.json")
        self.sports = self._load_json("sample_sports.json")

    def _load_json(self, filename: str) -> Dict[str, Any]:
        path = os.path.join(self.data_dir, filename)
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}

    def get_events_for_timecode(self, mode: str, timecode: int) -> Dict[str, Any]:
        """Returns contextual overlay payloads aligned with the given playback timecode."""
        if mode == "sports":
            return self._get_sports_events(timecode)
        else:
            return self._get_movie_events(timecode)

    def _get_movie_events(self, timecode: int) -> Dict[str, Any]:
        events = self.movies.get("timecode_events", [])
        # Find exact or most recent active event within 15 seconds window
        active_event = None
        for ev in events:
            ev_tc = ev["timecode_seconds"]
            if ev_tc <= timecode < ev_tc + 20:
                active_event = ev
                break

        cast_list = self.movies.get("cast", [])
        active_cast = []
        if active_event:
            active_cast = [
                c for c in cast_list if c["character"] in active_event.get("characters_present", [])
            ]
        else:
            active_cast = cast_list[:2]

        return {
            "mode": "movie",
            "timecode": timecode,
            "media_title": self.movies.get("title", "Astraea: Beyond the Event Horizon"),
            "has_active_event": active_event is not None,
            "active_event": active_event,
            "active_cast": active_cast,
            "default_suggestions": [
                "Who is that character?",
                "What is the Harmonic Beacon?",
                "Recap the previous scene"
            ]
        }

    def _get_sports_events(self, timecode: int) -> Dict[str, Any]:
        highlights = self.sports.get("highlight_events", [])
        active_hl = None
        for hl in highlights:
            hl_tc = hl["timecode_seconds"]
            if hl_tc <= timecode < hl_tc + 20:
                active_hl = hl
                break

        return {
            "mode": "sports",
            "timecode": timecode,
            "fixture": self.sports.get("fixture", "Arsenal FC vs Manchester City"),
            "score": self.sports.get("score", "2 - 1"),
            "match_clock": self.sports.get("match_clock", "74:18"),
            "telemetry": self.sports.get("active_telemetry", {}),
            "has_active_event": active_hl is not None,
            "active_highlight": active_hl,
            "player_roster": self.sports.get("player_roster", []),
            "default_suggestions": [
                "Show Saka's sprint speed",
                "Explain the offside ruling",
                "Display team possession xG"
            ]
        }
