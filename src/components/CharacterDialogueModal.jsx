import React, { useState } from 'react';
import { X, ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

export default function CharacterDialogueModal({ character, onClose, onExplore }) {
  const [lineIdx, setLineIdx] = useState(0);

  if (!character) return null;

  const currentLine = character.dialogue[lineIdx] || character.dialogue[0];
  const isLastLine = lineIdx === character.dialogue.length - 1;

  const handleNext = () => {
    sound.playGateAdd();
    if (isLastLine) {
      onClose();
    } else {
      setLineIdx(prev => prev + 1);
    }
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 md:p-8 bg-[#050505]/75 backdrop-blur-md animate-fadeIn">
      {/* Dialogue Speech Box */}
      <div className="relative w-full max-w-xl glass-panel-deep p-6 md:p-8 rounded-2xl border border-[#D4AF37]/40 shadow-[0_0_60px_rgba(212,175,55,0.2)] flex flex-col space-y-5">
        
        {/* Top Character Name Badge */}
        <div className="flex items-center justify-between border-b border-[#222222] pb-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{character.avatar || '💬'}</span>
            <div>
              <h4 className="font-serif text-lg md:text-xl text-[#EAE6DF] font-light tracking-wide">
                {character.name}
              </h4>
              <p className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase">
                {character.role || "Quantum Academy Guide"}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playSwitch();
              onClose();
            }}
            className="p-1.5 rounded-full border border-[#333333] hover:border-[#EAE6DF] text-[#8A8780] hover:text-[#EAE6DF] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Spoken Dialogue Line */}
        <div className="py-2 min-h-20 flex items-center">
          <p className="text-base md:text-lg font-serif italic text-[#EAE6DF] leading-relaxed pl-4 border-l-2 border-[#D4AF37]">
            "{currentLine}"
          </p>
        </div>

        {/* Step Indicator Dots & Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1F1F1F]">
          {/* Progress dots */}
          <div className="flex space-x-1.5">
            {character.dialogue.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === lineIdx ? 'w-6 bg-[#D4AF37]' : 'w-1.5 bg-[#333333]'
                }`}
              />
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-full border border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#050505] text-xs font-mono tracking-wider font-semibold flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          >
            <span>{isLastLine ? "FINISH DIALOGUE [CLOSE]" : "CONTINUE"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
