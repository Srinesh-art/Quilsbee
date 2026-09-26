import React from 'react';
import { Compass } from 'lucide-react';

export default function ProgressTracker({ progress, onOpenJourney }) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onOpenJourney}
        className="glass-panel px-4 py-2.5 rounded-full border border-[#222222] hover:border-[#D4AF37] flex items-center space-x-3 shadow-xl transition-all duration-300 group"
      >
        <Compass className="w-4 h-4 text-[#D4AF37] group-hover:rotate-45 transition-transform" />
        <span className="text-xs font-mono text-[#8A8780] group-hover:text-[#EAE6DF] tracking-wider">
          JOURNEY: {progress.completedCount} / 8 COMPLETE
        </span>
      </button>
    </div>
  );
}
