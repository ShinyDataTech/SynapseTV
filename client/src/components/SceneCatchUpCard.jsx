import React from 'react';
import { User, Sparkles, AlertCircle, HelpCircle, Film } from 'lucide-react';

export function SceneCatchUpCard({
  activeEvent,
  activeCast,
  isFocused,
  onTriggerPrompt
}) {
  if (!activeEvent && (!activeCast || activeCast.length === 0)) return null;

  return (
    <div className={`glass-panel rounded-2xl p-5 text-white transition-all duration-300 ${isFocused ? 'tv-focused' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-widest text-sky-400 uppercase">
              Synapse Scene Intel
            </span>
            <h3 className="text-lg font-bold font-display text-white">
              {activeEvent ? activeEvent.title : 'Active Scene Context'}
            </h3>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-mono text-cyan-300 border border-white/10">
          {activeEvent ? `T+${activeEvent.timecode_seconds}s` : 'Live'}
        </span>
      </div>

      {/* Main Narrative Summary */}
      {activeEvent && (
        <div className="space-y-3 mb-4">
          <p className="text-sm text-gray-200 leading-relaxed font-normal">
            {activeEvent.summary}
          </p>

          {/* Significance Alert */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <span>{activeEvent.significance}</span>
          </div>

          {/* Trivia Pill */}
          {activeEvent.trivia && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs">
              <Sparkles className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" />
              <span><strong>Trivia:</strong> {activeEvent.trivia}</span>
            </div>
          )}
        </div>
      )}

      {/* Cast on Screen */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          On-Screen Cast & Key Characters
        </span>
        <div className="grid grid-cols-2 gap-2.5">
          {activeCast.map((cast, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <img 
                src={cast.avatar_url} 
                alt={cast.character} 
                className="w-10 h-10 rounded-full object-cover border border-white/20"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{cast.character}</p>
                <p className="text-xs text-sky-300/90 truncate">{cast.actor}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Follow-ups */}
      {activeEvent && activeEvent.suggested_questions && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-cyan-400 mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="font-semibold">Ask with Fire TV Voice:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeEvent.suggested_questions.map((q, i) => (
              <button
                key={i}
                onClick={() => onTriggerPrompt && onTriggerPrompt(q)}
                className="text-left text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-gray-300 hover:text-white transition-all"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
