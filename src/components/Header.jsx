import React from 'react';
import { Volume2, VolumeX, Sparkles, Compass, BookOpen } from 'lucide-react';
import { sound } from '../utils/audio';

export default function Header({ currentChapter, progress, onOpenJourney, onOpenAI, isMuted, setIsMuted }) {
  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const scrollToComics = () => {
    const el = document.getElementById('comics');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 pointer-events-none transition-all duration-300">
      {/* Top Left: Logo */}
      <div className="flex items-center space-x-6 pointer-events-auto">
        <a href="#hero" className="flex items-center space-x-2.5 group">
          <div className="w-2.5 h-2.5 rounded-full bg-[#EAE6DF] group-hover:scale-125 transition-transform duration-300 shadow-[0_0_10px_rgba(234,230,223,0.5)]" />
          <span className="font-serif tracking-[0.25em] text-sm text-[#EAE6DF] font-light">
            THE QUANTUM WORLD
          </span>
        </a>

        {/* Comics Quick Jump */}
        <button
          onClick={scrollToComics}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-widest text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 transition-colors"
        >
          <BookOpen className="w-3 h-3" />
          <span>COMICS</span>
        </button>
      </div>

      {/* Top Center: Journey Progress */}
      <div className="hidden md:flex items-center space-x-4 pointer-events-auto glass-panel px-4 py-1.5 rounded-full">
        <button 
          onClick={onOpenJourney}
          className="flex items-center space-x-2 text-xs tracking-[0.2em] text-[#8A8780] hover:text-[#EAE6DF] transition-colors"
        >
          <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>JOURNEY: {progress.completedCount} / 8</span>
        </button>
        <div className="w-16 h-[1px] bg-[#222222] relative overflow-hidden">
          <div 
            className="h-full bg-[#D4AF37] transition-all duration-500" 
            style={{ width: `${(progress.completedCount / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* Top Right: AI Guide & Audio */}
      <div className="flex items-center space-x-4 pointer-events-auto">
        <button 
          onClick={onOpenAI}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] tracking-[0.15em] border border-[#333333] bg-[#0A0A0A]/80 hover:border-[#D4AF37] hover:text-[#D4AF37] text-[#8A8780] transition-all"
        >
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span className="hidden sm:inline">AI GUIDE</span>
        </button>

        <button 
          onClick={handleToggleSound}
          className="p-2 rounded-full border border-[#222222] bg-[#0A0A0A]/60 text-[#8A8780] hover:text-[#EAE6DF] hover:border-[#444444] transition-all"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#4ECDC4]" />}
        </button>

        <span className="micro-label text-[#EAE6DF] border-l border-[#222222] pl-3 font-mono">
          {currentChapter}
        </span>
      </div>
    </header>
  );
}
