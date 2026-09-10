import React from 'react';
import { Activity, Zap, ShieldCheck, TrendingUp, HelpCircle } from 'lucide-react';

export function SportsTelemetryOverlay({
  telemetry,
  highlight,
  fixture,
  score,
  matchClock,
  isFocused,
  onTriggerPrompt
}) {
  const possessionHome = telemetry?.possession_pct?.home || 52;
  const possessionAway = telemetry?.possession_pct?.away || 48;
  const xGHome = telemetry?.expected_goals_xG?.home || 1.8;
  const xGAway = telemetry?.expected_goals_xG?.away || 1.2;

  return (
    <div className={`glass-panel rounded-2xl p-5 text-white transition-all duration-300 ${isFocused ? 'tv-focused' : ''}`}>
      {/* Live Match Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-widest text-emerald-400 uppercase">
              Synapse Live Telemetry
            </span>
            <h3 className="text-lg font-bold font-display text-white">
              {fixture || 'Arsenal FC vs Manchester City'}
            </h3>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-black font-display text-amber-400 tracking-wider">
            {score || '2 - 1'}
          </span>
          <p className="text-[10px] font-mono text-gray-400">{matchClock || "74'"} LIVE</p>
        </div>
      </div>

      {/* Real-time Match Possession & xG Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Possession</span>
            <span className="text-white font-bold">{possessionHome}% - {possessionAway}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden flex">
            <div className="bg-sky-400 h-full transition-all" style={{ width: `${possessionHome}%` }} />
            <div className="bg-rose-400 h-full transition-all" style={{ width: `${possessionAway}%` }} />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Expected Goals (xG)</span>
            <span className="text-white font-bold">{xGHome} - {xGAway}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden flex">
            <div className="bg-sky-400 h-full transition-all" style={{ width: `${(xGHome / (xGHome + xGAway)) * 100}%` }} />
            <div className="bg-rose-400 h-full transition-all" style={{ width: `${(xGAway / (xGHome + xGAway)) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Dynamic Telemetry Highlight Event */}
      {highlight && (
        <div className="space-y-3 mb-4 animate-fadeIn">
          <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/60 to-indigo-950/60 border border-sky-500/40">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                  {highlight.metric_label}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-sky-400/20 text-sky-200 text-xs font-mono font-bold">
                {highlight.player_name} (#{highlight.number})
              </span>
            </div>

            <div className="text-2xl font-black font-display text-white tracking-tight my-1">
              {highlight.metric_value}
            </div>
            
            <p className="text-xs text-gray-300 leading-normal">
              {highlight.tactical_context}
            </p>
          </div>

          {/* Live Trivia / Rules Breakdown */}
          {highlight.live_trivia && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
              <span>{highlight.live_trivia}</span>
            </div>
          )}
        </div>
      )}

      {/* Voice Prompt Suggestions */}
      <div className="pt-3 border-t border-white/10">
        <div className="flex items-center gap-1.5 text-xs text-cyan-400 mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="font-semibold">Ask Synapse with Fire TV Voice:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Show Saka sprint speed', 'Explain VAR offside check', 'Compare team high press turnovers'].map((q, i) => (
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
    </div>
  );
}
