import React, { useState } from 'react';
import { Sparkles, Eye, RefreshCw, Zap } from 'lucide-react';
import { QuantumCircuit } from '../engine/quantumSimulator';
import { sound } from '../utils/audio';

export default function SuperpositionDemo({ onComplete }) {
  const [qc, setQc] = useState(() => new QuantumCircuit(1));
  const [isSuperposed, setIsSuperposed] = useState(false);
  const [measuredState, setMeasuredState] = useState(null);
  const [isCollapsing, setIsCollapsing] = useState(false);

  const applyHadamard = () => {
    sound.playSuperposition();
    const nextQc = new QuantumCircuit(1);
    nextQc.applyGate('H', 0);
    setQc(nextQc);
    setIsSuperposed(true);
    setMeasuredState(null);
  };

  const measureQubit = () => {
    if (isCollapsing) return;
    setIsCollapsing(true);
    sound.playCollapse();

    setTimeout(() => {
      const outcome = qc.measure();
      setMeasuredState(outcome.binary);
      setIsCollapsing(false);
      setIsSuperposed(false);
      if (onComplete) onComplete();
    }, 600);
  };

  const resetQubit = () => {
    sound.playSwitch();
    setQc(new QuantumCircuit(1));
    setIsSuperposed(false);
    setMeasuredState(null);
  };

  const probs = qc.getProbabilities();
  const p0 = probs[0].prob;
  const p1 = probs[1].prob;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 py-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="micro-label text-[#9D4EDD]">SECTION 05 — QUANTUM INTERFERENCE</span>
        <h3 className="text-3xl md:text-5xl font-serif text-[#EAE6DF] font-light">
          SUPERPOSITION & COLLAPSE
        </h3>
        <p className="text-sm md:text-base text-[#8A8780] font-light max-w-xl mx-auto">
          Applying a Hadamard gate (H) puts the qubit into a simultaneous state of 0 and 1. 
          Measurement destroys the superposition.
        </p>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative rounded-2xl glass-panel p-8 md:p-12 border border-[#222222] space-y-8 flex flex-col items-center">
        
        {/* Dynamic Waveform & Amplitude Visualizer */}
        <div className={`relative w-full max-w-lg h-44 rounded-xl border flex items-center justify-around p-6 overflow-hidden transition-all duration-700 ${
          isSuperposed 
            ? 'border-[#9D4EDD] bg-gradient-to-r from-[#0A0A0A] via-[#1A0B2E] to-[#0A0A0A] shadow-[0_0_50px_rgba(157,78,221,0.25)]' 
            : 'border-[#222222] bg-[#0A0A0A]'
        }`}>
          {/* Basis 0 Column */}
          <div className="flex flex-col items-center space-y-3 z-10">
            <div className={`text-4xl md:text-5xl font-serif transition-all ${
              measuredState === '0' ? 'text-[#4ECDC4] scale-125 font-semibold' : 'text-[#EAE6DF]'
            }`}>
              |0⟩
            </div>
            <div className="w-16 h-2 rounded-full bg-[#1A1A1A] overflow-hidden">
              <div 
                className="h-full bg-[#4ECDC4] transition-all duration-500" 
                style={{ width: `${p0 * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono text-[#8A8780]">{(p0 * 100).toFixed(0)}%</span>
          </div>

          {/* Superposition Wave Sign */}
          <div className="flex flex-col items-center justify-center text-center z-10">
            <div className={`text-2xl font-serif transition-opacity duration-300 ${
              isSuperposed ? 'opacity-100 text-[#9D4EDD]' : 'opacity-20 text-[#8A8780]'
            }`}>
              +
            </div>
            <span className="text-[10px] font-mono tracking-widest text-[#8A8780] mt-2">
              {isSuperposed ? 'COHERENT WAVE' : 'DETERMINISTIC'}
            </span>
          </div>

          {/* Basis 1 Column */}
          <div className="flex flex-col items-center space-y-3 z-10">
            <div className={`text-4xl md:text-5xl font-serif transition-all ${
              measuredState === '1' ? 'text-[#D4AF37] scale-125 font-semibold' : 'text-[#EAE6DF]'
            }`}>
              |1⟩
            </div>
            <div className="w-16 h-2 rounded-full bg-[#1A1A1A] overflow-hidden">
              <div 
                className="h-full bg-[#D4AF37] transition-all duration-500" 
                style={{ width: `${p1 * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono text-[#8A8780]">{(p1 * 100).toFixed(0)}%</span>
          </div>

          {/* Shimmering background animation when in superposition */}
          {isSuperposed && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#9D4EDD]/10 to-transparent animate-pulse pointer-events-none" />
          )}
        </div>

        {/* Math Wavefunction Representation */}
        <div className="font-mono text-sm md:text-base text-[#EAE6DF] bg-[#050505] px-6 py-3 rounded-full border border-[#222222]">
          {isSuperposed 
            ? '|ψ⟩ = (1/√2)|0⟩ + (1/√2)|1⟩'
            : measuredState 
              ? `COLLAPSED STATE: |${measuredState}⟩`
              : '|ψ⟩ = 1.00|0⟩ + 0.00|1⟩'}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={applyHadamard}
            className="px-6 py-3 rounded-full border border-[#9D4EDD] bg-[#9D4EDD]/10 hover:bg-[#9D4EDD] text-[#9D4EDD] hover:text-[#050505] transition-all duration-300 font-mono text-xs tracking-wider flex items-center space-x-2"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>APPLY HADAMARD (H)</span>
          </button>

          <button
            onClick={measureQubit}
            disabled={isCollapsing}
            className="px-8 py-3 rounded-full border border-[#EAE6DF] bg-[#EAE6DF] text-[#050505] hover:bg-white transition-all duration-300 font-mono text-xs tracking-wider font-semibold flex items-center space-x-2 shadow-[0_0_30px_rgba(234,230,223,0.3)]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isCollapsing ? 'COLLAPSING...' : 'MEASURE NOW'}</span>
          </button>

          <button
            onClick={resetQubit}
            className="p-3 rounded-full border border-[#222222] text-[#8A8780] hover:text-[#EAE6DF] hover:border-[#444444] transition-colors"
            title="Reset to Ground State |0⟩"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
