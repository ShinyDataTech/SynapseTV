import React from 'react';
import { 
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, 
  Circle, CornerDownLeft, Play, Pause, Mic, Home, 
  RotateCcw, FastForward, Volume2, VolumeX 
} from 'lucide-react';

export function VirtualRemote({
  onDirection,
  onSelect,
  onBack,
  onPlayPause,
  onVoice,
  isPlaying,
  mode,
  onToggleMode
}) {
  return (
    <div className="w-64 glass-panel rounded-3xl p-5 border border-white/20 shadow-2xl flex flex-col items-center select-none">
      {/* Remote Header */}
      <div className="flex items-center justify-between w-full pb-3 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-widest text-amber-400 uppercase">FIRE TV</span>
          <span className="text-[10px] text-gray-400 font-mono">SIMULATOR</span>
        </div>
        <button
          onClick={onToggleMode}
          className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-cyan-300 font-semibold border border-white/10 transition-colors"
        >
          {mode === 'movie' ? '🎬 Sci-Fi' : '⚽ Sports'}
        </button>
      </div>

      {/* Top Microphone / Alexa Button */}
      <button
        onClick={onVoice}
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 transition-transform active:scale-95 mb-6 group"
        title="Hold to talk (Alexa Voice Remote)"
      >
        <Mic className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Circular D-Pad Controller */}
      <div className="relative w-40 h-40 rounded-full bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-white/20 shadow-inner flex items-center justify-center mb-6">
        {/* Up */}
        <button
          onClick={() => onDirection('up')}
          className="absolute top-2 text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors active:scale-95"
        >
          <ChevronUp className="w-6 h-6" />
        </button>

        {/* Down */}
        <button
          onClick={() => onDirection('down')}
          className="absolute bottom-2 text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors active:scale-95"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        {/* Left */}
        <button
          onClick={() => onDirection('left')}
          className="absolute left-2 text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right */}
        <button
          onClick={() => onDirection('right')}
          className="absolute right-2 text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors active:scale-95"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Center Select Button */}
        <button
          onClick={onSelect}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 border border-white/20 text-white flex items-center justify-center shadow-md active:scale-90 transition-all"
        >
          <span className="text-xs font-bold uppercase tracking-wider">OK</span>
        </button>
      </div>

      {/* Secondary Controls Grid */}
      <div className="grid grid-cols-3 gap-3 w-full mb-4">
        {/* Back */}
        <button
          onClick={onBack}
          className="p-3 rounded-2xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white flex flex-col items-center justify-center transition-colors active:scale-95"
          title="Back (Escape/Backspace)"
        >
          <CornerDownLeft className="w-4 h-4 mb-1" />
          <span className="text-[9px] font-medium text-gray-400">Back</span>
        </button>

        {/* Home */}
        <button
          onClick={onBack}
          className="p-3 rounded-2xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white flex flex-col items-center justify-center transition-colors active:scale-95"
          title="Home"
        >
          <Home className="w-4 h-4 mb-1" />
          <span className="text-[9px] font-medium text-gray-400">Home</span>
        </button>

        {/* Play / Pause */}
        <button
          onClick={onPlayPause}
          className="p-3 rounded-2xl bg-white/5 hover:bg-white/15 text-cyan-400 hover:text-cyan-300 flex flex-col items-center justify-center transition-colors active:scale-95"
          title="Play/Pause (Space)"
        >
          {isPlaying ? <Pause className="w-4 h-4 mb-1" /> : <Play className="w-4 h-4 mb-1" />}
          <span className="text-[9px] font-medium text-gray-400">{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
      </div>

      {/* D-Pad Keyboard Navigation Shortcut Hints */}
      <div className="w-full text-center p-2.5 rounded-xl bg-black/40 border border-white/5 text-[10px] text-gray-400 space-y-1">
        <p>🎮 Keyboard D-Pad: <kbd className="text-gray-200">Arrows</kbd> + <kbd className="text-gray-200">Enter</kbd></p>
        <p>🎙️ Voice Q&A: Press <kbd className="text-gray-200">V</kbd> or click Mic</p>
      </div>
    </div>
  );
}
