import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, FastForward } from 'lucide-react';

export function VideoPlayer({
  mode = 'movie',
  currentTimecode,
  isPlaying,
  onTimeUpdate,
  onTogglePlay,
  onSeek
}) {
  // Built-in animated ambient video simulation for Movie and Sports
  const duration = mode === 'sports' ? 90 : 120;

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        onTimeUpdate((prev) => (prev >= duration ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, duration, onTimeUpdate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentSubtitle = () => {
    if (mode === 'movie') {
      if (currentTimecode >= 10 && currentTimecode < 25) {
        return "Dr. Elena Vance: 'The harmonic signature isn't an echo... it's broadcasting from within the event horizon.'";
      } else if (currentTimecode >= 35 && currentTimecode < 50) {
        return "Cmdr. Marcus Reed: 'Elena, if we enter orbital decay now, we repeat the Helios IV casualty timeline.'";
      } else if (currentTimecode >= 65 && currentTimecode < 80) {
        return "A.R.I.A.: 'Relativistic gradient exceeds tolerance. One standard minute here equals 90 Earth days.'";
      }
    } else {
      if (currentTimecode >= 12 && currentTimecode < 28) {
        return "Commentator: 'Look at Saka surging past the defender—clocked at nearly 35 km/h on that inside break!'";
      } else if (currentTimecode >= 38 && currentTimecode < 55) {
        return "Commentator: 'Ødegaard dictating the entire tempo from zone 14 with six key progressive passes.'";
      } else if (currentTimecode >= 68 && currentTimecode < 85) {
        return "Referee Broadcast: 'Semi-automated offside technology confirms the attacker was 3.2cm onside at release.'";
      }
    }
    return null;
  };

  const subtitle = currentSubtitle();

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      {/* Dynamic Background Visuals representing the video stream */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
        style={{
          backgroundImage: mode === 'sports'
            ? 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&q=80")'
            : 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.75)), url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80")'
        }}
      >
        {/* Animated lighting and scanlines */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>

      {/* Subtitles Overlay */}
      {subtitle && (
        <div className="absolute bottom-28 z-20 px-8 py-3 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-center max-w-3xl animate-fadeIn">
          <p className="text-xl md:text-2xl font-medium text-amber-300 drop-shadow-md tracking-wide">
            {subtitle}
          </p>
        </div>
      )}

      {/* Video Playback Progress Bar (10-Foot UI Standard) */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/20 z-20">
        <div 
          className="h-full bg-gradient-to-r from-sky-400 to-amber-400 transition-all duration-300"
          style={{ width: `${(currentTimecode / duration) * 100}%` }}
        />
      </div>

      {/* Playback Status Badge (Top-Left) */}
      <div className="absolute top-10 left-12 z-20 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs tracking-wider">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
        <span className="font-semibold text-white uppercase tracking-widest">
          {mode === 'sports' ? 'LIVE 4K HDR • PREMIER LEAGUE' : 'FIRE TV 4K ULTRA HD • 24 FPS'}
        </span>
        <span className="text-white/40">|</span>
        <span className="font-mono text-cyan-300">{formatTime(currentTimecode)} / {formatTime(duration)}</span>
      </div>
    </div>
  );
}
