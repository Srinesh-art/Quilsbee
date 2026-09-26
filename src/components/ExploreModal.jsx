import React, { useEffect } from 'react';
import { X, ArrowLeft, Activity, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

export default function ExploreModal({ isOpen, onClose, title, subtitle, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/95 backdrop-blur-2xl p-4 md:p-8 animate-fadeIn">
      {/* Container with Scientific Lab HUD */}
      <div className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl glass-panel-deep border border-[#333333] shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-8 py-5 border-b border-[#222222] bg-[#0A0A0A]/90 backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                sound.playSwitch();
                onClose();
              }}
              className="flex items-center space-x-2 text-xs tracking-[0.2em] text-[#8A8780] hover:text-[#EAE6DF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO STORY</span>
            </button>
            <span className="text-[#333333]">•</span>
            <div>
              <h3 className="font-serif text-lg md:text-xl text-[#EAE6DF] font-light">
                {title || "QUANTUM EXPERIMENT"}
              </h3>
              {subtitle && (
                <p className="text-xs text-[#8A8780] font-light font-mono">{subtitle}</p>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              sound.playSwitch();
              onClose();
            }}
            className="p-2 rounded-full border border-[#222222] hover:border-[#444444] text-[#8A8780] hover:text-[#EAE6DF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Experiment Content Body */}
        <div className="p-6 md:p-10 flex-1">
          {children}
        </div>

        {/* Bottom Bar: Continue Story */}
        <div className="sticky bottom-0 z-30 flex items-center justify-between px-8 py-4 border-t border-[#222222] bg-[#0A0A0A]/90 backdrop-blur-md">
          <div className="flex items-center space-x-2 text-xs text-[#8A8780] font-mono">
            <Activity className="w-3.5 h-3.5 text-[#4ECDC4]" />
            <span>INTERACTIVE SIMULATION ACTIVE</span>
          </div>
          <button
            onClick={() => {
              sound.playSwitch();
              onClose();
            }}
            className="px-6 py-2.5 rounded-full border border-[#D4AF37]/50 bg-[#0A0A0A] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#050505] transition-all duration-300 text-xs tracking-[0.2em] font-medium"
          >
            CONTINUE STORY
          </button>
        </div>

      </div>
    </div>
  );
}
