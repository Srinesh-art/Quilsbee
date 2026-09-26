import React, { useState } from 'react';
import { Play, RotateCcw, Plus, Trash2, Sparkles, Activity } from 'lucide-react';
import { runCircuit } from '../engine/quantumSimulator';
import { sound } from '../utils/audio';

const AVAILABLE_GATES = [
  { name: 'H', label: 'H (Hadamard)', desc: 'Creates equal superposition' },
  { name: 'X', label: 'X (NOT / Pauli-X)', desc: 'Bit flip: 0 <-> 1' },
  { name: 'Y', label: 'Y (Pauli-Y)', desc: 'Bit and phase flip' },
  { name: 'Z', label: 'Z (Pauli-Z)', desc: 'Phase flip: + <-> -' },
  { name: 'S', label: 'S (Phase π/2)', desc: 'Quarter turn phase shift' },
  { name: 'T', label: 'T (π/4 Gate)', desc: 'Eighth turn phase shift' },
  { name: 'CNOT', label: 'CNOT (Entangler)', desc: 'Two-qubit controlled NOT' },
];

export default function CircuitBuilder({ onComplete }) {
  const [numQubits] = useState(2);
  const [instructions, setInstructions] = useState([
    { gate: 'H', target: 0 },
    { gate: 'CNOT', control: 0, target: 1 }
  ]);
  const [selectedGate, setSelectedGate] = useState('H');
  const [measuredResult, setMeasuredResult] = useState(null);

  // Compute live circuit state
  const qc = runCircuit(numQubits, instructions);
  const probs = qc.getProbabilities();

  const addGate = (wireIdx) => {
    sound.playGateAdd();
    if (selectedGate === 'CNOT') {
      const otherWire = wireIdx === 0 ? 1 : 0;
      setInstructions([...instructions, { gate: 'CNOT', control: wireIdx, target: otherWire }]);
    } else {
      setInstructions([...instructions, { gate: selectedGate, target: wireIdx }]);
    }
  };

  const removeGate = (idx) => {
    sound.playSwitch();
    const next = [...instructions];
    next.splice(idx, 1);
    setInstructions(next);
  };

  const clearCircuit = () => {
    sound.playSwitch();
    setInstructions([]);
    setMeasuredResult(null);
  };

  const runAndMeasure = () => {
    sound.playCollapse();
    const outcome = qc.measure();
    setMeasuredResult(outcome.binary);
    if (onComplete) onComplete();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-4">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="micro-label text-[#4ECDC4]">SECTION 06 — QUANTUM LABORATORY</span>
        <h3 className="text-3xl md:text-5xl font-serif text-[#EAE6DF] font-light">
          CIRCUIT BUILDER
        </h3>
        <p className="text-sm text-[#8A8780] font-light max-w-xl mx-auto">
          Assemble quantum logic gates to execute multi-qubit transformations and observe state evolution.
        </p>
      </div>

      {/* Gate Selector Tool Palette */}
      <div className="glass-panel p-4 rounded-xl border border-[#222222] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="micro-label text-[#8A8780] mr-2">SELECT GATE:</span>
          {AVAILABLE_GATES.map((g) => (
            <button
              key={g.name}
              onClick={() => {
                sound.playSwitch();
                setSelectedGate(g.name);
              }}
              className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-all ${
                selectedGate === g.name
                  ? 'border-[#4ECDC4] bg-[#4ECDC4]/15 text-[#4ECDC4] shadow-[0_0_15px_rgba(78,205,196,0.2)]'
                  : 'border-[#222222] bg-[#0A0A0A] text-[#8A8780] hover:border-[#444444]'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        <button
          onClick={clearCircuit}
          className="px-3 py-1.5 rounded-lg border border-[#333333] hover:border-[#E63946] text-[#8A8780] hover:text-[#E63946] text-xs font-mono flex items-center space-x-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET</span>
        </button>
      </div>

      {/* Circuit Grid Canvas */}
      <div className="glass-panel p-8 rounded-2xl border border-[#222222] space-y-6">
        {[0, 1].map((wireIdx) => (
          <div key={wireIdx} className="flex items-center space-x-4">
            {/* Qubit Label */}
            <div className="w-16 font-mono text-xs text-[#EAE6DF] flex items-center space-x-1">
              <span className="text-[#8A8780]">q[{wireIdx}]:</span>
              <span className="text-[#4ECDC4]">|0⟩</span>
            </div>

            {/* Wire Line */}
            <div className="flex-1 h-[2px] bg-[#222222] relative flex items-center px-4 space-x-3">
              {/* Gate Blocks along the wire */}
              {instructions.map((inst, idx) => {
                const isTarget = inst.target === wireIdx;
                const isControl = inst.gate === 'CNOT' && inst.control === wireIdx;
                if (!isTarget && !isControl) return null;

                return (
                  <div
                    key={idx}
                    className={`relative z-10 px-3 py-1.5 rounded border font-mono text-xs flex items-center space-x-1.5 shadow-md ${
                      isControl 
                        ? 'bg-[#111111] border-[#D4AF37] text-[#D4AF37]' 
                        : 'bg-[#0D1B1E] border-[#4ECDC4] text-[#4ECDC4]'
                    }`}
                  >
                    <span>{isControl ? '● CTRL' : inst.gate}</span>
                    <button
                      onClick={() => removeGate(idx)}
                      className="hover:text-[#E63946] ml-1 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                );
              })}

              {/* Add Gate Button onto Wire */}
              <button
                onClick={() => addGate(wireIdx)}
                className="z-10 px-2.5 py-1 rounded border border-dashed border-[#444444] hover:border-[#4ECDC4] hover:bg-[#4ECDC4]/10 text-[#8A8780] hover:text-[#4ECDC4] text-xs font-mono flex items-center space-x-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>+ {selectedGate}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Probabilities Histogram & Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 glass-panel p-6 rounded-xl border border-[#222222] space-y-4">
          <span className="micro-label text-[#8A8780]">OUTPUT PROBABILITY DISTRIBUTION</span>
          <div className="grid grid-cols-4 gap-4">
            {probs.map((p) => (
              <div key={p.binary} className="space-y-2 text-center">
                <div className="h-28 rounded bg-[#0A0A0A] border border-[#1F1F1F] flex items-end p-1 justify-center">
                  <div
                    className="w-full bg-gradient-to-t from-[#4ECDC4] to-[#9D4EDD] rounded-sm transition-all duration-300"
                    style={{ height: `${p.prob * 100}%` }}
                  />
                </div>
                <div className="font-mono text-xs text-[#EAE6DF]">|{p.binary}⟩</div>
                <div className="font-mono text-[11px] text-[#8A8780]">{(p.prob * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Actions */}
        <div className="md:col-span-4 glass-panel p-6 rounded-xl border border-[#222222] flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="micro-label text-[#8A8780]">STATE COLLAPSE</span>
            {measuredResult ? (
              <div className="p-4 rounded-lg bg-[#050505] border border-[#4ECDC4] text-center">
                <span className="text-xs text-[#8A8780] font-mono">COLLAPSED RESULT</span>
                <div className="text-3xl font-serif text-[#4ECDC4] mt-1">|{measuredResult}⟩</div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-[#050505] border border-[#222222] text-center text-xs text-[#5A5750] font-mono">
                READY FOR EXECUTION
              </div>
            )}
          </div>

          <button
            onClick={runAndMeasure}
            className="w-full py-3 rounded-full bg-[#EAE6DF] hover:bg-white text-[#050505] font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(234,230,223,0.2)]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>RUN & MEASURE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
