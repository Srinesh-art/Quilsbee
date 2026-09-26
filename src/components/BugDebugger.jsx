import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, RefreshCw, Sparkles, Wrench } from 'lucide-react';
import { runCircuit } from '../engine/quantumSimulator';
import { sound } from '../utils/audio';

export default function BugDebugger({ onComplete }) {
  // Scenario: Broken circuit with wrong gate (Pauli-X instead of Hadamard)
  const [gates, setGates] = useState([
    { gate: 'X', target: 0 },
    { gate: 'CNOT', control: 0, target: 1 }
  ]);
  const [status, setStatus] = useState('ERROR'); // 'ERROR' | 'RESTORED'

  const fixCircuit = () => {
    sound.playSuccess();
    setGates([
      { gate: 'H', target: 0 },
      { gate: 'CNOT', control: 0, target: 1 }
    ]);
    setStatus('RESTORED');
    if (onComplete) onComplete();
  };

  const resetBug = () => {
    sound.playSwitch();
    setGates([
      { gate: 'X', target: 0 },
      { gate: 'CNOT', control: 0, target: 1 }
    ]);
    setStatus('ERROR');
  };

  const qc = runCircuit(2, gates);
  const probs = qc.getProbabilities();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-4">
      {/* Narrative Alert Banner */}
      <div className={`p-6 rounded-xl border flex items-center justify-between transition-all duration-500 ${
        status === 'ERROR'
          ? 'border-[#E63946] bg-[#E63946]/10 text-[#E63946]'
          : 'border-[#2A9D8F] bg-[#2A9D8F]/10 text-[#2A9D8F]'
      }`}>
        <div className="flex items-center space-x-4">
          {status === 'ERROR' ? (
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          ) : (
            <CheckCircle2 className="w-6 h-6" />
          )}
          <div>
            <h4 className="font-mono text-sm tracking-widest uppercase font-semibold">
              {status === 'ERROR' ? 'QUANTUM SYSTEM ERROR: STATE MISMATCH' : 'SYSTEM RESTORED: BELL ENTANGLEMENT ACTIVE'}
            </h4>
            <p className="text-xs opacity-80 mt-0.5">
              {status === 'ERROR' 
                ? 'The reactor requires an entangled Bell state (|00⟩ + |11⟩)/√2, but current output is deterministic |11⟩.' 
                : 'Superposition restored. Quantum coherence established at 100% fidelity.'}
            </p>
          </div>
        </div>

        {status === 'ERROR' ? (
          <button
            onClick={fixCircuit}
            className="px-5 py-2.5 rounded-full bg-[#E63946] hover:bg-[#ff4d5a] text-white text-xs font-mono font-medium tracking-wider flex items-center space-x-2 transition-all shadow-[0_0_20px_rgba(230,57,70,0.4)]"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>REPLACE X WITH H</span>
          </button>
        ) : (
          <button
            onClick={resetBug}
            className="px-4 py-2 rounded-full border border-[#2A9D8F] text-[#2A9D8F] hover:bg-[#2A9D8F]/20 text-xs font-mono transition-colors flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RESET BUG</span>
          </button>
        )}
      </div>

      {/* Target vs Actual State Comparator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expected Target */}
        <div className="glass-panel p-6 rounded-xl border border-[#222222] space-y-3">
          <span className="micro-label text-[#D4AF37]">EXPECTED TARGET STATE</span>
          <div className="font-mono text-lg text-[#EAE6DF]">|Φ⁺⟩ = (|00⟩ + |11⟩) / √2</div>
          <div className="text-xs text-[#8A8780] font-mono">
            P(|00⟩) = 50% &nbsp;|&nbsp; P(|11⟩) = 50%
          </div>
        </div>

        {/* Actual Output */}
        <div className={`glass-panel p-6 rounded-xl border space-y-3 transition-colors ${
          status === 'ERROR' ? 'border-[#E63946]/40' : 'border-[#2A9D8F]/40'
        }`}>
          <span className="micro-label text-[#8A8780]">ACTUAL RUNTIME STATE</span>
          <div className="font-mono text-lg text-[#4ECDC4]">
            {status === 'ERROR' ? '|11⟩ (100% Deterministic)' : '(|00⟩ + |11⟩)/√2 (Entangled)'}
          </div>
          <div className="text-xs text-[#8A8780] font-mono">
            {status === 'ERROR' ? 'P(|11⟩) = 100%' : 'P(|00⟩) = 50% | P(|11⟩) = 50%'}
          </div>
        </div>
      </div>
    </div>
  );
}
