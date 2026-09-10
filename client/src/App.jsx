import React, { useState, useCallback } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { LeanbackHUD } from './components/LeanbackHUD';
import { VoicePromptModal } from './components/VoicePromptModal';
import { VirtualRemote } from './components/VirtualRemote';
import { useDPadNavigation } from './hooks/useDPadNavigation';
import { useSynapseWebSocket } from './hooks/useSynapseWebSocket';
import { Sparkles, Tv, MonitorPlay } from 'lucide-react';

export function App() {
  const [mode, setMode] = useState('movie'); // 'movie' | 'sports'
  const [currentTimecode, setCurrentTimecode] = useState(12);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [showVirtualRemote, setShowVirtualRemote] = useState(true);
  const [activeZone, setActiveZone] = useState('actions'); // 'actions' | 'modes' | 'cards'

  // Connect to Synapse AI Gateway WebSocket
  const { isConnected, hudData, voiceResult, setVoiceResult, sendVoiceQuery } = useSynapseWebSocket({
    serverUrl: 'ws://127.0.0.1:8000',
    mode,
    currentTimecode
  });

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleToggleMode = useCallback(() => {
    setMode((prev) => (prev === 'movie' ? 'sports' : 'movie'));
    setCurrentTimecode(15);
    setVoiceResult(null);
  }, [setVoiceResult]);

  const handleOpenVoice = useCallback(() => {
    setIsVoiceModalOpen(true);
  }, []);

  const handleCloseVoice = useCallback(() => {
    setIsVoiceModalOpen(false);
  }, []);

  const handleTriggerPrompt = useCallback((prompt) => {
    setIsVoiceModalOpen(true);
    sendVoiceQuery(prompt);
  }, [sendVoiceQuery]);

  // Spatial Navigation for Fire TV Remote
  const { currentFocus, setManualFocus } = useDPadNavigation({
    activeZone,
    zones: {
      actions: 3,
      modes: 2,
      cards: 1
    },
    onSelect: (zone, index) => {
      if (zone === 'actions') {
        if (index === 0) {
          handleTriggerPrompt(mode === 'movie' ? "Who is Elena Vance?" : "Show Saka sprint speed");
        } else if (index === 1) {
          handleTriggerPrompt(mode === 'movie' ? "Explain the Harmonic Beacon" : "Explain VAR offside check");
        } else if (index === 2) {
          handleOpenVoice();
        }
      } else if (zone === 'modes') {
        handleToggleMode();
      }
    },
    onBack: () => {
      if (isVoiceModalOpen) {
        handleCloseVoice();
      }
    },
    onPlayPause: handleTogglePlay,
    onVoiceTrigger: handleOpenVoice
  });

  const handleRemoteDirection = (direction) => {
    const syntheticEvent = new KeyboardEvent('keydown', {
      key: direction === 'up' ? 'ArrowUp' : (direction === 'down' ? 'ArrowDown' : (direction === 'left' ? 'ArrowLeft' : 'ArrowRight'))
    });
    window.dispatchEvent(syntheticEvent);
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex">
      {/* Primary Fire TV Screen Container (16:9 Canvas) */}
      <div className="relative flex-1 h-full overflow-hidden">
        {/* Video Player */}
        <VideoPlayer
          mode={mode}
          currentTimecode={currentTimecode}
          isPlaying={isPlaying}
          onTimeUpdate={setCurrentTimecode}
          onTogglePlay={handleTogglePlay}
          onSeek={setCurrentTimecode}
        />

        {/* Translucent Leanback HUD Overlay */}
        <LeanbackHUD
          mode={mode}
          hudData={hudData}
          currentFocus={currentFocus}
          activeZone={activeZone}
          isConnected={isConnected}
          onTriggerPrompt={handleTriggerPrompt}
          onOpenVoiceModal={handleOpenVoice}
          onToggleMode={handleToggleMode}
          isVoiceModalOpen={isVoiceModalOpen}
        />

        {/* Voice Q&A Modal */}
        <VoicePromptModal
          isOpen={isVoiceModalOpen}
          onClose={handleCloseVoice}
          onSubmitQuery={sendVoiceQuery}
          voiceResult={voiceResult}
        />
      </div>

      {/* Interactive Fire TV Remote Simulator (Right Sidebar) */}
      {showVirtualRemote && (
        <div className="hidden lg:flex items-center justify-center p-6 bg-slate-950/90 border-l border-white/10 z-40">
          <VirtualRemote
            onDirection={handleRemoteDirection}
            onSelect={() => {
              const syntheticEvent = new KeyboardEvent('keydown', { key: 'Enter' });
              window.dispatchEvent(syntheticEvent);
            }}
            onBack={() => {
              const syntheticEvent = new KeyboardEvent('keydown', { key: 'Escape' });
              window.dispatchEvent(syntheticEvent);
            }}
            onPlayPause={handleTogglePlay}
            onVoice={handleOpenVoice}
            isPlaying={isPlaying}
            mode={mode}
            onToggleMode={handleToggleMode}
          />
        </div>
      )}

      {/* Floating Toggle for Virtual Remote */}
      <button
        onClick={() => setShowVirtualRemote((prev) => !prev)}
        className="fixed bottom-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white border border-white/10 text-xs flex items-center gap-1.5 transition-colors"
        title="Toggle Virtual Remote"
      >
        <MonitorPlay className="w-4 h-4 text-cyan-400" />
        <span className="hidden sm:inline font-mono">{showVirtualRemote ? 'Hide Remote' : 'Show Remote'}</span>
      </button>
    </div>
  );
}

export default App;
