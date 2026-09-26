import React, { useState } from 'react';
import { Play, ArrowRight, CheckCircle2, Sparkles, Database, Send } from 'lucide-react';
import { ALGORITHMS } from '../data/algorithmData';
import { sound } from '../utils/audio';

export default function AlgorithmDemo({ onComplete }) {
  const [activeAlgo, setActiveAlgo] = useState('grover');
  const [groverStep, setGroverStep] = useState(0);
  const [teleportStep, setTeleportStep] = useState(0);

  const groverData = ALGORITHMS.find((a) => a.id === 'grover');
  const teleportData = ALGORITHMS.find((a) => a.id === 'teleportation');

  const advanceGrover = () => {
    sound.playGateAdd();
    const next = (groverStep + 1) % groverData.steps.length;
    setGroverStep(next);
    if (next === groverData.steps.length - 1) {
      sound.playSuccess();
      if (onComplete) onComplete();
    }
  };

  const advanceTeleport = () => {
    sound.playGateAdd();
    const next = (teleportStep + 1) % teleportData.steps.length;
    setTeleportStep(next);
    if (next === teleportData.steps.length - 1) {
      sound.playSuccess();
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 py-4">
      {/* Algorithm Selector Tabs */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => {
            sound.playSwitch();
            setActiveAlgo('grover');
          }}
          className={`px-6 py-2.5 rounded-full border text-xs font-mono tracking-widest transition-all ${
            activeAlgo === 'grover'
              ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]'
              : 'border-[#222222] text-[#8A8780] hover:border-[#444444]'
          }`}
        >
          01. GROVER'S SEARCH
        </button>
        <button
          onClick={() => {
            sound.playSwitch();
            setActiveAlgo('teleportation');
          }}
          className={`px-6 py-2.5 rounded-full border text-xs font-mono tracking-widest transition-all ${
            activeAlgo === 'teleportation'
              ? 'border-[#4ECDC4] bg-[#4ECDC4]/10 text-[#4ECDC4] shadow-[0_0_20px_rgba(78,205,196,0.2)]'
              : 'border-[#222222] text-[#8A8780] hover:border-[#444444]'
          }`}
        >
          02. QUANTUM TELEPORTATION
        </button>
      </div>

      {activeAlgo === 'grover' ? (
        /* Grover's Algorithm Interactive View */
        <div className="glass-panel p-8 md:p-12 rounded-2xl border border-[#222222] space-y-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="micro-label text-[#D4AF37]">ALGORITHM 01</span>
              <span className="text-[#333333]">•</span>
              <span className="text-xs font-mono text-[#4ECDC4]">{groverData.speedup}</span>
            </div>
            <h4 className="text-2xl md:text-4xl font-serif text-[#EAE6DF] font-light">
              {groverData.title}
            </h4>
            <p className="text-sm text-[#8A8780] font-light max-w-2xl">
              {groverData.description}
            </p>
          </div>

          {/* Step Progression Bar */}
          <div className="grid grid-cols-4 gap-2">
            {groverData.steps.map((s, idx) => (
              <div
                key={s.id}
                className={`p-3 rounded-lg border text-left space-y-1 transition-all ${
                  idx === groverStep
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                    : idx < groverStep
                    ? 'border-[#2A9D8F] bg-[#2A9D8F]/10 opacity-70'
                    : 'border-[#1A1A1A] opacity-40'
                }`}
              >
                <div className="text-[10px] font-mono text-[#8A8780]">STEP {idx + 1}</div>
                <div className="text-xs font-mono text-[#EAE6DF] truncate">{s.name}</div>
              </div>
            ))}
          </div>

          {/* Current Step Detail Box */}
          <div className="p-6 rounded-xl bg-[#080808] border border-[#222222] space-y-4">
            <h5 className="font-mono text-sm text-[#D4AF37]">
              {groverData.steps[groverStep].name}
            </h5>
            <p className="text-sm text-[#8A8780] font-light leading-relaxed">
              {groverData.steps[groverStep].detail}
            </p>

            {/* Amplitude Bars for Database Items */}
            <div className="pt-4 space-y-2">
              <span className="micro-label text-[#8A8780]">AMPLITUDE PROBABILITIES:</span>
              <div className="grid grid-cols-4 gap-4 pt-2">
                {['|00⟩', '|01⟩', '|10⟩', '|11⟩ (TARGET)'].map((item, idx) => {
                  const stateVal = groverData.steps[groverStep].state[idx];
                  const height = Math.abs(stateVal) * 100;
                  const isNeg = stateVal < 0;

                  return (
                    <div key={item} className="space-y-2 text-center">
                      <div className="h-28 rounded bg-[#050505] border border-[#1A1A1A] flex items-end justify-center p-1 relative">
                        <div
                          className={`w-full rounded-sm transition-all duration-500 ${
                            isNeg
                              ? 'bg-[#E63946]'
                              : idx === 3
                              ? 'bg-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                              : 'bg-[#4ECDC4]'
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <div className="text-xs font-mono text-[#EAE6DF]">{item}</div>
                      <div className="text-[10px] font-mono text-[#8A8780]">
                        {stateVal.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={advanceGrover}
              className="px-8 py-3 rounded-full bg-[#D4AF37] hover:bg-[#e6bf47] text-[#050505] text-xs font-mono font-semibold tracking-wider flex items-center space-x-2 transition-all shadow-[0_0_25px_rgba(212,175,55,0.3)]"
            >
              <span>{groverStep === 3 ? 'RESTART GROVER' : 'NEXT GROVER STEP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Quantum Teleportation Interactive View */
        <div className="glass-panel p-8 md:p-12 rounded-2xl border border-[#222222] space-y-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="micro-label text-[#4ECDC4]">PROTOCOL 02</span>
              <span className="text-[#333333]">•</span>
              <span className="text-xs font-mono text-[#D4AF37]">{teleportData.speedup}</span>
            </div>
            <h4 className="text-2xl md:text-4xl font-serif text-[#EAE6DF] font-light">
              {teleportData.title}
            </h4>
            <p className="text-sm text-[#8A8780] font-light max-w-2xl">
              {teleportData.description}
            </p>
          </div>

          {/* Steps Timeline */}
          <div className="grid grid-cols-4 gap-2">
            {teleportData.steps.map((s, idx) => (
              <div
                key={s.id}
                className={`p-3 rounded-lg border text-left space-y-1 transition-all ${
                  idx === teleportStep
                    ? 'border-[#4ECDC4] bg-[#4ECDC4]/10'
                    : idx < teleportStep
                    ? 'border-[#2A9D8F] bg-[#2A9D8F]/10 opacity-70'
                    : 'border-[#1A1A1A] opacity-40'
                }`}
              >
                <div className="text-[10px] font-mono text-[#8A8780]">STEP {idx + 1}</div>
                <div className="text-xs font-mono text-[#EAE6DF] truncate">{s.name}</div>
              </div>
            ))}
          </div>

          {/* Teleport Stage Graphic */}
          <div className="p-8 rounded-xl bg-[#080808] border border-[#222222] flex flex-col md:flex-row items-center justify-around gap-6 text-center">
            {/* Alice Side */}
            <div className="space-y-2">
              <span className="micro-label text-[#4ECDC4]">ALICE'S LOCATION</span>
              <div className="p-4 rounded-xl border border-[#333333] bg-[#0F0F0F] font-mono text-xs space-y-1">
                <div>Source State |ψ⟩</div>
                <div className="text-[#8A8780]">Bell Qubit A</div>
              </div>
            </div>

            {/* Classical & Quantum Link */}
            <div className="space-y-2 flex flex-col items-center">
              <div className="text-[10px] font-mono text-[#D4AF37] flex items-center space-x-1">
                <Send className="w-3 h-3" />
                <span>2 CLASSICAL BITS</span>
              </div>
              <div className="w-24 h-[1px] bg-gradient-to-r from-[#4ECDC4] to-[#9D4EDD]" />
              <div className="text-[10px] font-mono text-[#8A8780]">EPR BELL PAIR</div>
            </div>

            {/* Bob Side */}
            <div className="space-y-2">
              <span className="micro-label text-[#9D4EDD]">BOB'S LOCATION</span>
              <div className="p-4 rounded-xl border border-[#333333] bg-[#0F0F0F] font-mono text-xs space-y-1">
                <div>Receiver Qubit B</div>
                <div className="text-[#4ECDC4]">
                  {teleportStep === 3 ? 'Reconstructed |ψ⟩' : 'Entangled State'}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#050505] border border-[#1A1A1A] text-xs text-[#8A8780] font-light leading-relaxed">
            {teleportData.steps[teleportStep].detail}
          </div>

          <div className="flex justify-end">
            <button
              onClick={advanceTeleport}
              className="px-8 py-3 rounded-full bg-[#4ECDC4] hover:bg-[#62ded5] text-[#050505] text-xs font-mono font-semibold tracking-wider flex items-center space-x-2 transition-all shadow-[0_0_25px_rgba(78,205,196,0.3)]"
            >
              <span>{teleportStep === 3 ? 'RESTART TELEPORTATION' : 'NEXT TELEPORT STEP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
