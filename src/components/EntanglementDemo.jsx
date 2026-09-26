import React, { useState } from 'react';
import { Eye, Sparkles, RefreshCw, Zap, Link } from 'lucide-react';
import { sound } from '../utils/audio';

export default function EntanglementDemo({ onComplete }) {
  const [isEntangled, setIsEntangled] = useState(true);
  const [measuredA, setMeasuredA] = useState(null);
  const [measuredB, setMeasuredB] = useState(null);
  const [isMeasuring, setIsMeasuring] = useState(false);

  const measureQubitA = () => {
    if (isMeasuring) return;
    setIsMeasuring(true);
    sound.playCollapse();

    setTimeout(() => {
      // 50% random chance for 0 or 1
      const outcome = Math.random() < 0.5 ? '0' : '1';
      setMeasuredA(outcome);
      // Entanglement collapses Qubit B instantaneously to the identical outcome!
      setMeasuredB(outcome);
      setIsMeasuring(false);
      if (onComplete) onComplete();
    }, 500);
  };

  const resetEntanglement = () => {
    sound.playSwitch();
    setMeasuredA(null);
    setMeasuredB(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-4">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="micro-label text-[#D4AF37]">SECTION 08 — QUANTUM CORRELATION</span>
        <h3 className="text-3xl md:text-5xl font-serif text-[#EAE6DF] font-light">
          QUANTUM ENTANGLEMENT
        </h3>
        <p className="text-sm md:text-base text-[#8A8780] font-light max-w-xl mx-auto">
          In a Bell state, two qubits share an intertwined fate. Measuring Qubit A instantaneously 
          forces Qubit B to collapse into the exact correlated state.
        </p>
      </div>

      {/* Main Entangled Lab Field */}
      <div className="relative rounded-2xl glass-panel p-8 md:p-12 border border-[#222222] flex flex-col md:flex-row items-center justify-around gap-8">
        
        {/* Qubit A */}
        <div className="flex flex-col items-center space-y-4 z-10">
          <span className="micro-label text-[#4ECDC4]">QUBIT A (TRANSMITTER)</span>
          <div className={`w-36 h-36 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
            measuredA !== null
              ? 'border-[#4ECDC4] bg-[#4ECDC4]/10 shadow-[0_0_40px_rgba(78,205,196,0.3)]'
              : 'border-[#333333] bg-[#0A0A0A] animate-pulse'
          }`}>
            <span className="text-5xl font-serif text-[#EAE6DF]">
              {measuredA !== null ? `|${measuredA}⟩` : '|ψ⟩'}
            </span>
          </div>

          <button
            onClick={measureQubitA}
            disabled={isMeasuring}
            className="px-6 py-2.5 rounded-full border border-[#4ECDC4] bg-[#4ECDC4]/10 hover:bg-[#4ECDC4] text-[#4ECDC4] hover:text-[#050505] transition-all duration-300 text-xs font-mono tracking-wider font-semibold"
          >
            {isMeasuring ? 'COLLAPSING...' : 'MEASURE QUBIT A'}
          </button>
        </div>

        {/* Entangled Quantum Energy Link */}
        <div className="flex flex-col items-center space-y-2 z-10">
          <div className="flex items-center space-x-2 text-[#D4AF37] animate-pulseGlow">
            <Link className="w-4 h-4" />
            <span className="text-[11px] font-mono tracking-widest">NON-LOCAL BELL CHANNEL</span>
          </div>
          <div className="w-24 md:w-36 h-[2px] bg-gradient-to-r from-[#4ECDC4] via-[#D4AF37] to-[#9D4EDD] shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
          <span className="text-[10px] font-mono text-[#8A8780]">|Φ⁺⟩ = (|00⟩ + |11⟩)/√2</span>
        </div>

        {/* Qubit B */}
        <div className="flex flex-col items-center space-y-4 z-10">
          <span className="micro-label text-[#9D4EDD]">QUBIT B (RECEIVER)</span>
          <div className={`w-36 h-36 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
            measuredB !== null
              ? 'border-[#9D4EDD] bg-[#9D4EDD]/10 shadow-[0_0_40px_rgba(157,78,221,0.3)]'
              : 'border-[#333333] bg-[#0A0A0A] animate-pulse'
          }`}>
            <span className="text-5xl font-serif text-[#EAE6DF]">
              {measuredB !== null ? `|${measuredB}⟩` : '|ψ⟩'}
            </span>
          </div>

          <div className="text-xs font-mono text-[#8A8780] py-2.5">
            {measuredB !== null ? 'INSTANTANEOUS SYNC' : 'ENTANGLED CORRELATION'}
          </div>
        </div>

      </div>

      {/* Reset Action */}
      <div className="flex justify-center">
        <button
          onClick={resetEntanglement}
          className="px-6 py-2 rounded-full border border-[#222222] text-[#8A8780] hover:text-[#EAE6DF] hover:border-[#444444] transition-colors text-xs font-mono flex items-center space-x-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>RE-ENTANGLE PAIR</span>
        </button>
      </div>
    </div>
  );
}
