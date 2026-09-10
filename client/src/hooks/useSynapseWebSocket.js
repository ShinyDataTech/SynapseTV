import { useState, useEffect, useRef, useCallback } from 'react';

export function useSynapseWebSocket({
  serverUrl = 'ws://127.0.0.1:8000',
  mode = 'movie',
  currentTimecode = 0
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [hudData, setHudData] = useState(null);
  const [voiceResult, setVoiceResult] = useState(null);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const sessionIdRef = useRef(`firetv-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    let ws;
    let isMounted = true;

    const connect = () => {
      try {
        const url = `${serverUrl}/ws/stream/${sessionIdRef.current}`;
        ws = new WebSocket(url);
        socketRef.current = ws;

        ws.onopen = () => {
          if (isMounted) {
            setIsConnected(true);
            setError(null);
            // Send initial sync
            ws.send(JSON.stringify({
              type: 'timecode_update',
              timecode: currentTimecode,
              mode: mode
            }));
          }
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'hud_sync') {
              setHudData(data.payload);
            } else if (data.type === 'voice_response') {
              setVoiceResult(data);
            }
          } catch (err) {
            console.error('Failed to parse WebSocket message:', err);
          }
        };

        ws.onerror = (e) => {
          if (isMounted) {
            setIsConnected(false);
            setError('WebSocket error connecting to Synapse Gateway');
          }
        };

        ws.onclose = () => {
          if (isMounted) {
            setIsConnected(false);
            // Attempt auto-reconnect in 3s
            setTimeout(() => {
              if (isMounted) connect();
            }, 3000);
          }
        };
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      }
    };

    connect();

    return () => {
      isMounted = false;
      if (ws) ws.close();
    };
  }, [serverUrl]);

  // Push timecode updates when video timecode or mode changes
  useEffect(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'timecode_update',
        timecode: currentTimecode,
        mode: mode
      }));
    }
  }, [currentTimecode, mode]);

  const sendVoiceQuery = useCallback((prompt) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      setVoiceResult(null);
      socketRef.current.send(JSON.stringify({
        type: 'voice_query',
        prompt,
        timecode: currentTimecode,
        mode
      }));
    }
  }, [currentTimecode, mode]);

  return {
    isConnected,
    hudData,
    voiceResult,
    setVoiceResult,
    sendVoiceQuery,
    error
  };
}
