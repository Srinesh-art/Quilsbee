import React, { useState } from 'react';
import { ShieldCheck, Play, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { runCircuit } from '../engine/quantumSimulator';
import { sound } from '../utils/audio';

export default function FinalChallenge({ onPassChallenge }) {
  const [circuit, setCircuit] = useState([]);
  const [resultFidelity, setResultFidelity] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Challenge: Build Bell State (|00⟩ + |11⟩)/√2
  // Correct sequence: H on q[0], then CNOT(0, 1)

  const addGate = (gate, target, control = null) => {
    sound.playGateAdd();
    setCircuit([...circuit, { gate, target, control }]);
  };

  const clearCircuit = () => {
    sound.playSwitch();
    setCircuit([]);
    setResultFidelity(null);
    setIsSuccess(false);
  };

  const verifyReactor = () => {
    const qc = runCircuit(2, circuit);
    const probs = qc.getProbabilities();

    // Check Bell State probabilities: |00⟩ ~ 0.5, |11⟩ ~ 0.5, |01⟩ = 0, |10⟩ = 0
    const p00 = probs[0].prob;
    const p11 = probs[3].prob;
    const p01 = probs[1].prob;
    const p10 = probs[2].prob;

    if (Math.abs(p00 - 0.5) < 0.05 && Math.abs(p11 - 0.5) < 0.05 && p01 < 0.01 && p10 < 0.01) {
      sound.playSuccess();
      setResultFidelity(100);
      setIsSuccess(true);
      if (onPassChallenge) onPassChallenge();
    } else {
      sound.playCollapse();
      const score = Math.max(0, Math.round((p00 + p11 - p01 - p10) * 50));
      setResultFidelity(score);
      setIsSuccess(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-6">
      <div className="text-center space-y-2">
        <span className="micro-label text-[#D4AF37]">SECTION 12 — CLIMACTIC CHALLENGE</span>
        <h3 className="text-3xl md:text-5xl font-serif text-[#EAE6DF] font-light">
          QUANTUM REACTOR STABILIZATION
        </h3>
        <p className="text-sm text-[#8A8780] font-light max-w-xl mx-auto">
          Construct an entangled Bell State (|00⟩ + |11⟩)/√2 on 2 qubits to stabilize the core quantum reactor.
        </p>
      </div>

      {/* Assembly Instrument */}
      <div className="glass-panel p-8 rounded-2xl border border-[#222222] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1F1F1F] pb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => addGate('H', 0)}
              className="px-3 py-1.5 rounded border border-[#9D4EDD] text-[#9D4EDD] hover:bg-[#9D4EDD]/10 text-xs font-mono"
            >
              + H (q0)
            </button>
            <button
              onClick={() => addGate('X', 0)}
              className="px-3 py-1.5 rounded border border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4]/10 text-xs font-mono"
            >
              + X (q0)
            </button>
            <button
              onClick={() => addGate('CNOT', 1, 0)}
              className="px-3 py-1.5 rounded border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 text-xs font-mono"
            >
              + CNOT (ctrl 0 → tgt 1)
            </button>
          </div>

          <button
            onClick={clearCircuit}
            className="text-xs font-mono text-[#8A8780] hover:text-[#E63946] transition-colors"
          >
            CLEAR INSTRUMENT
          </button>
        </div>

        {/* Timeline representation */}
        <div className="min-h-20 p-4 rounded-xl bg-[#080808] border border-[#1A1A1A] flex items-center space-x-3 overflow-x-auto">
          {circuit.length === 0 ? (
            <span className="text-xs font-mono text-[#5A5750]">NO GATES APPLIED YET...</span>
          ) : (
            circuit.map((g, idx) => (
              <div key={idx} className="px-3 py-2 rounded bg-[#111111] border border-[#333333] font-mono text-xs text-[#EAE6DF]">
                {g.gate === 'CNOT' ? `CNOT(0→1)` : `${g.gate}(q${g.target})`}
              </div>
            ))
          )}
        </div>

        {/* Verification Status */}
        {resultFidelity !== null && (
          <div className={`p-4 rounded-xl border flex items-center space-x-4 ${
            isSuccess ? 'border-[#2A9D8F] bg-[#2A9D8F]/10 text-[#2A9D8F]' : 'border-[#E63946] bg-[#E63946]/10 text-[#E63946]'
          }`}>
            {isSuccess ? <ShieldCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <div>
              <div className="font-mono text-sm font-semibold">
                {isSuccess ? 'REACTOR STABILIZED: 100% FIDELITY' : `UNSTABLE CORE: ${resultFidelity}% FIDELITY`}
              </div>
              <div className="text-xs opacity-80">
                {isSuccess ? 'Target Bell State verified through projective measurement.' : 'State vector deviates from |Φ⁺⟩. Re-evaluate gate ordering.'}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={verifyReactor}
            className="px-8 py-3 rounded-full bg-[#EAE6DF] hover:bg-white text-[#050505] font-semibold text-xs tracking-widest uppercase transition-all duration-300 flex items-center space-x-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>RUN REACTOR VALIDATION</span>
          </button>
        </div>
      </div>
    </div>
  );
}
