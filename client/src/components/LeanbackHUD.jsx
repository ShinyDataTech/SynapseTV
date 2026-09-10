import React from 'react';
import { Sparkles, Mic, Layers, Tv, Wifi, CheckCircle2 } from 'lucide-react';
import { SceneCatchUpCard } from './SceneCatchUpCard';
import { SportsTelemetryOverlay } from './SportsTelemetryOverlay';

export function LeanbackHUD({
  mode,
  hudData,
  currentFocus,
  activeZone,
  isConnected,
  onTriggerPrompt,
  onOpenVoiceModal,
  onToggleMode,
  isVoiceModalOpen
}) {
  const isMovieMode = mode === 'movie';

  return (
    <div className="absolute inset-0 pointer-events-none tv-safe-area flex flex-col justify-between z-30">
      {/* Top Header Overlay */}
      <div className="flex items-center justify-between pointer-events-auto">
        {/* Brand & Mode Switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl glass-panel border border-white/15">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black tracking-widest text-sky-400 uppercase">SYNAPSE TV</span>
              <p className="text-[10px] text-gray-400 font-mono">FIRE OS MULTIMODAL CO-PILOT</p>
            </div>
          </div>

          {/* Mode Pill Buttons */}
          <div className="flex items-center gap-2 p-1 rounded-2xl glass-pill">
            <button
              onClick={() => mode !== 'movie' && onToggleMode()}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all tv-focusable ${
                mode === 'movie'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                  : 'text-gray-400 hover:text-white'
              } ${activeZone === 'modes' && currentFocus === 0 ? 'tv-focused' : ''}`}
            >
              🎬 Movie Catch-Up
            </button>
            <button
              onClick={() => mode !== 'sports' && onToggleMode()}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all tv-focusable ${
                mode === 'sports'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                  : 'text-gray-400 hover:text-white'
              } ${activeZone === 'modes' && currentFocus === 1 ? 'tv-focused' : ''}`}
            >
              ⚽ Live Sports Telemetry
            </button>
          </div>
        </div>

        {/* AWS Backend & Alexa Voice Remote Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenVoiceModal}
            className={`px-4 py-2 rounded-2xl glass-panel hover:bg-white/15 text-white flex items-center gap-2.5 transition-all tv-focusable ${
              activeZone === 'top_actions' && currentFocus === 0 ? 'tv-focused-amber' : ''
            }`}
          >
            <Mic className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold font-display">Press 'V' or Click Voice Q&A</span>
          </button>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-panel text-xs">
            <Wifi className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-400' : 'text-rose-400'}`} />
            <span className="text-[11px] text-gray-300 font-mono">
              {isConnected ? 'AWS BEDROCK ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Bottom HUD Display Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end pointer-events-auto">
        {/* Left Side: Contextual Card (Catch-up or Sports Stats) */}
        <div className="md:col-span-8 lg:col-span-7">
          {isMovieMode ? (
            <SceneCatchUpCard
              activeEvent={hudData?.active_event}
              activeCast={hudData?.active_cast || []}
              isFocused={activeZone === 'cards' && currentFocus === 0}
              onTriggerPrompt={onTriggerPrompt}
            />
          ) : (
            <SportsTelemetryOverlay
              fixture={hudData?.fixture}
              score={hudData?.score}
              matchClock={hudData?.match_clock}
              telemetry={hudData?.telemetry}
              highlight={hudData?.active_highlight}
              isFocused={activeZone === 'cards' && currentFocus === 0}
              onTriggerPrompt={onTriggerPrompt}
            />
          )}
        </div>

        {/* Right Side: Quick Action Pills */}
        <div className="md:col-span-4 lg:col-span-5 flex flex-col gap-2.5">
          <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Layers className="w-3.5 h-3.5" /> Quick Remote Actions
              </span>
              <span className="text-[10px] text-gray-500 font-mono">D-PAD COMPLIANT</span>
            </div>

            <button
              onClick={() => onTriggerPrompt(isMovieMode ? "Who is Elena Vance?" : "Show Saka sprint speed")}
              className={`w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-200 transition-all tv-focusable ${
                activeZone === 'actions' && currentFocus === 0 ? 'tv-focused' : ''
              }`}
            >
              {isMovieMode ? '🔍 1. Identify On-Screen Characters' : '⚡ 1. View Peak Sprint Speed'}
            </button>

            <button
              onClick={() => onTriggerPrompt(isMovieMode ? "Explain the Harmonic Beacon signal" : "Explain VAR offside check")}
              className={`w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-200 transition-all tv-focusable ${
                activeZone === 'actions' && currentFocus === 1 ? 'tv-focused' : ''
              }`}
            >
              {isMovieMode ? '📖 2. Scene Plot Deep-Dive' : '🛡️ 2. VAR & Rule Breakdown'}
            </button>

            <button
              onClick={onOpenVoiceModal}
              className={`w-full text-left p-3 rounded-xl bg-gradient-to-r from-sky-600/30 to-indigo-600/30 hover:from-sky-600/50 hover:to-indigo-600/50 border border-sky-500/30 text-xs text-sky-200 font-semibold transition-all tv-focusable flex items-center justify-between ${
                activeZone === 'actions' && currentFocus === 2 ? 'tv-focused-amber' : ''
              }`}
            >
              <span>🎙️ 3. Ask Fire TV Voice Co-Pilot</span>
              <span className="text-[10px] font-mono bg-sky-500/20 px-2 py-0.5 rounded text-sky-300">KEY: V</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
