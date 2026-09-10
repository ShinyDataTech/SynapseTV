import React, { useState } from 'react';
import { Mic, X, Send, Bot, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

export function VoicePromptModal({
  isOpen,
  onClose,
  onSubmitQuery,
  voiceResult,
  isLoading
}) {
  const [queryText, setQueryText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (queryText.trim()) {
      onSubmitQuery(queryText.trim());
    }
  };

  const samplePrompts = [
    "Who is the lead astrophysicist and what is her mission?",
    "Show Bukayo Saka's top sprint speed and heat map",
    "Explain the semi-automated offside technology ruling",
    "What happened in the previous Helios IV mission?"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-8 animate-fadeIn">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl p-8 border border-white/20 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Alexa Remote Voice Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-lg shadow-sky-500/30">
            <Mic className="w-7 h-7 text-white animate-pulse" />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold font-display text-white">Fire TV Voice Co-Pilot</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-xs font-semibold border border-sky-500/30">
                AWS Bedrock Claude 3.5
              </span>
            </div>
            <p className="text-sm text-gray-400">Speak into your Alexa Voice Remote or type a contextual query</p>
          </div>
        </div>

        {/* Animated Voice Waveform */}
        <div className="flex items-center justify-center gap-1.5 h-12 bg-white/5 rounded-2xl mb-6 px-4">
          {[18, 28, 40, 22, 35, 48, 26, 42, 30, 20, 36, 44, 25].map((h, i) => (
            <div
              key={i}
              className="w-1.5 bg-gradient-to-t from-sky-500 to-cyan-300 rounded-full"
              style={{
                height: `${h}px`,
                animation: `voice-wave 1.${(i % 5) + 1}s infinite ease-in-out`
              }}
            />
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Ask anything about the scene, character, or match..."
            className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-cyan-400"
            autoFocus
          />
          <button
            type="submit"
            className="px-6 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Sample Prompt Chips */}
        <div className="mb-6">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
            Suggested Prompts (Press or Select with Remote D-Pad)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQueryText(prompt);
                  onSubmitQuery(prompt);
                }}
                className="text-left text-xs p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center justify-between"
              >
                <span className="truncate mr-2">"{prompt}"</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Live AI Reasoning & Tool Output Result */}
        {voiceResult && (
          <div className="p-5 rounded-2xl bg-gradient-to-b from-sky-950/80 to-slate-900/90 border border-cyan-500/40 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Bot className="w-4 h-4" />
                <span>Synapse AI Response ({voiceResult.tool_action?.tool_used || 'Amazon Bedrock Multimodal'})</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Confidence {Math.round((voiceResult.confidence || 0.96) * 100)}%
              </span>
            </div>

            <div className="text-sm text-gray-100 whitespace-pre-line leading-relaxed mb-3">
              {voiceResult.insight}
            </div>

            {voiceResult.tool_action?.result && (
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-cyan-200">
                <span className="font-bold text-sky-400 block mb-1">AWS AgentCore Tool Execution Result:</span>
                <pre className="overflow-x-auto text-[11px] font-mono text-gray-300">
                  {JSON.stringify(voiceResult.tool_action.result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
