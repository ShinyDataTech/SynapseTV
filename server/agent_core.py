"""AWS AgentCore Tool-Calling Orchestrator for SynapseTV.

Dispatches agent actions across Movie Knowledge Bases, Sports Telemetry APIs,
and Rules Engine for seamless lean-back TV query resolution.
"""

import json
import os
from typing import Dict, Any, List, Optional
import logging

logger = logging.getLogger("synapse_agentcore")

class AgentCoreOrchestrator:
    def __init__(self, data_dir: Optional[str] = None):
        if data_dir is None:
            data_dir = os.path.join(os.path.dirname(__file__), "data")
        self.data_dir = data_dir
        self.movies_data = self._load_json("sample_movies.json")
        self.sports_data = self._load_json("sample_sports.json")
        
        # Define Tool Definitions compatible with AWS Bedrock / AgentCore specification
        self.tools = [
            {
                "toolSpec": {
                    "name": "get_actor_character_info",
                    "description": "Retrieves biographical and relationship details about an on-screen actor or character.",
                    "inputSchema": {
                        "json": {
                            "type": "object",
                            "properties": {
                                "query_name": {"type": "string", "description": "Character or actor name"}
                            },
                            "required": ["query_name"]
                        }
                    }
                }
            },
            {
                "toolSpec": {
                    "name": "get_sports_player_telemetry",
                    "description": "Fetches live player metrics (sprint speed, heatmap, xG, distance covered).",
                    "inputSchema": {
                        "json": {
                            "type": "object",
                            "properties": {
                                "player_name": {"type": "string", "description": "Football/sports player name"}
                            },
                            "required": ["player_name"]
                        }
                    }
                }
            },
            {
                "toolSpec": {
                    "name": "explain_referee_rule",
                    "description": "Breaks down officiating decisions (VAR, offside, fouls) for lean-back fans.",
                    "inputSchema": {
                        "json": {
                            "type": "object",
                            "properties": {
                                "rule_topic": {"type": "string", "description": "Rule name or incident context"}
                            },
                            "required": ["rule_topic"]
                        }
                    }
                }
            },
            {
                "toolSpec": {
                    "name": "search_scene_lore",
                    "description": "Searches vector embeddings and storyline knowledge base for plot cues.",
                    "inputSchema": {
                        "json": {
                            "type": "object",
                            "properties": {
                                "query": {"type": "string", "description": "Query about past events or plot twists"},
                                "timecode": {"type": "integer", "description": "Current playback time in seconds"}
                            },
                            "required": ["query"]
                        }
                    }
                }
            }
        ]

    def _load_json(self, filename: str) -> Dict[str, Any]:
        path = os.path.join(self.data_dir, filename)
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}

    def get_tool_specs(self) -> List[Dict[str, Any]]:
        return self.tools

    async def execute_tool(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Executes the requested AgentCore tool and returns structured output."""
        logger.info("AgentCore executing tool '%s' with parameters: %s", tool_name, parameters)
        
        if tool_name == "get_actor_character_info":
            name = parameters.get("query_name", "").lower()
            for cast in self.movies_data.get("cast", []):
                if name in cast["character"].lower() or name in cast["actor"].lower():
                    return {
                        "status": "success",
                        "character": cast["character"],
                        "actor": cast["actor"],
                        "role": cast["role"],
                        "bio": cast["bio"],
                        "avatar_url": cast["avatar_url"]
                    }
            return {
                "status": "not_found",
                "message": f"No cast profile found matching '{parameters.get('query_name')}'"
            }

        elif tool_name == "get_sports_player_telemetry":
            player = parameters.get("player_name", "").lower()
            for p in self.sports_data.get("player_roster", []):
                if player in p["name"].lower():
                    return {
                        "status": "success",
                        "player_data": p,
                        "match_context": self.sports_data.get("fixture"),
                        "active_telemetry": self.sports_data.get("active_telemetry")
                    }
            return {
                "status": "not_found",
                "message": f"No live telemetry found for '{parameters.get('player_name')}'"
            }

        elif tool_name == "explain_referee_rule":
            topic = parameters.get("rule_topic", "").lower()
            if "offside" in topic or "var" in topic:
                return {
                    "status": "success",
                    "topic": "Semi-Automated Offside Technology (SAOT)",
                    "summary": "SAOT tracks 29 optical data points per player at 50fps. Any limb valid for scoring ahead of the 2nd-deepest opponent is flagged.",
                    "practical_takeaway": "Haaland was ruled onside by 3.2cm as the trailing defender's boot played him on."
                }
            return {
                "status": "success",
                "topic": topic.capitalize(),
                "summary": "Standard IFAB/League ruling applies to this passage of play.",
                "practical_takeaway": "Lean-back referee assistance: Play restarted via direct free kick."
            }

        elif tool_name == "search_scene_lore":
            query = parameters.get("query", "").lower()
            timecode = parameters.get("timecode", 0)
            
            # Find relevant events up to current timecode
            events = [
                e for e in self.movies_data.get("timecode_events", [])
                if e["timecode_seconds"] <= timecode or timecode == 0
            ]
            
            return {
                "status": "success",
                "query": query,
                "current_timecode": timecode,
                "matched_events": events[:2],
                "lore_insight": "Elena's cipher is calibrated to the Helios IV black-box beacon signature."
            }

        return {
            "status": "error",
            "message": f"Unknown AgentCore tool '{tool_name}'"
        }

    async def route_natural_language_query(self, query: str, timecode: int = 0) -> Dict[str, Any]:
        """Intelligently routes a natural language voice query to the appropriate AgentCore tool."""
        q_lower = query.lower()
        
        if any(w in q_lower for w in ["who is", "actor", "character", "elena", "marcus", "aria", "role"]):
            # Extract potential name
            target = "elena" if "elena" in q_lower else ("marcus" if "marcus" in q_lower else "aria")
            tool_res = await self.execute_tool("get_actor_character_info", {"query_name": target})
            return {
                "tool_used": "get_actor_character_info",
                "result": tool_res
            }
            
        elif any(w in q_lower for w in ["speed", "sprint", "stats", "saka", "odegaard", "haaland", "xg", "possession"]):
            target = "saka" if "saka" in q_lower else ("haaland" if "haaland" in q_lower else "odegaard")
            tool_res = await self.execute_tool("get_sports_player_telemetry", {"player_name": target})
            return {
                "tool_used": "get_sports_player_telemetry",
                "result": tool_res
            }
            
        elif any(w in q_lower for w in ["var", "offside", "rule", "penalty", "foul", "referee"]):
            tool_res = await self.execute_tool("explain_referee_rule", {"rule_topic": "offside"})
            return {
                "tool_used": "explain_referee_rule",
                "result": tool_res
            }
            
        else:
            tool_res = await self.execute_tool("search_scene_lore", {"query": query, "timecode": timecode})
            return {
                "tool_used": "search_scene_lore",
                "result": tool_res
            }
