import React from 'react';
import { RotateCcw, Sparkles, Award } from 'lucide-react';
import { sound } from '../utils/audio';

export default function EndingScene({ onRestart }) {
  return (
    <section id="ending" className="relative w-full min-h-screen py-32 px-6 flex items-center justify-center bg-[#050505] text-[#EAE6DF]">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* Emblem */}
        <div className="w-16 h-16 rounded-full border border-[#D4AF37] bg-[#D4AF37]/5 mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.2)]">
          <Award className="w-8 h-8 text-[#D4AF37]" />
        </div>

        {/* Micro Header */}
        <div className="space-y-3">
          <span className="micro-label text-[#D4AF37]">JOURNEY COMPLETE</span>
          <h2 className="text-5xl md:text-7xl font-serif text-[#EAE6DF] font-light tracking-wide leading-tight">
            THE QUANTUM WORLD
          </h2>
        </div>

        {/* Philosophical Closing Quote */}
        <blockquote className="text-2xl md:text-3xl font-serif italic text-[#8A8780] max-w-2xl mx-auto leading-relaxed">
          "You didn't memorize quantum computing. You experienced it."
        </blockquote>

        {/* Replay / Explore Button */}
        <div className="pt-6">
          <button
            onClick={() => {
              sound.playSwitch();
              onRestart();
            }}
            className="px-8 py-4 rounded-full border border-[#EAE6DF]/40 bg-[#0A0A0A] hover:bg-[#EAE6DF] text-[#EAE6DF] hover:text-[#050505] text-xs font-mono font-semibold tracking-[0.25em] uppercase transition-all duration-500 inline-flex items-center space-x-3 shadow-lg hover:shadow-[0_0_40px_rgba(234,230,223,0.3)]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>EXPLORE AGAIN</span>
          </button>
        </div>

        {/* Luxury Footer */}
        <div className="border-t border-[#1F1F1F] pt-12 text-center text-xs text-[#5A5750] font-light space-y-2">
          <div className="font-serif tracking-widest text-[#8A8780] text-sm">THE QUANTUM WORLD</div>
          <p>An interactive journey into quantum computing.</p>
          <p className="font-mono text-[10px]">© 2026 THE QUANTUM WORLD</p>
        </div>
      </div>
    </section>
  );
}
