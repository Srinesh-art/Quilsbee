import React from 'react';
import { CheckCircle, Lock, Compass, Sparkles, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

const JOURNEY_NODES = [
  { id: 'bit', number: '01', title: 'CLASSICAL BIT', desc: 'Binary foundations & deterministic switches', target: 'bit' },
  { id: 'qubit', number: '02', title: 'THE FIRST QUBIT', desc: 'Bloch Sphere & complex Hilbert space', target: 'qubit' },
  { id: 'superposition', number: '03', title: 'SUPERPOSITION', desc: 'Hadamard transformation & wave coexistence', target: 'superposition' },
  { id: 'measurement', number: '04', title: 'MEASUREMENT', desc: 'Irreversible wave function collapse', target: 'superposition' },
  { id: 'gates', number: '05', title: 'QUANTUM GATES', desc: 'Pauli rotations X, Y, Z, S, T', target: 'circuits' },
  { id: 'circuits', number: '06', title: 'CIRCUITS', desc: 'Multi-qubit unitary time evolution', target: 'circuits' },
  { id: 'entanglement', number: '07', title: 'ENTANGLEMENT', desc: 'Bell states & non-local correlations', target: 'entanglement' },
  { id: 'algorithms', number: '08', title: 'ALGORITHMS', desc: "Grover's Search & Teleportation", target: 'algorithms' },
];

export default function QuantumJourneyMap({ completedNodes, onSelectNode, onClose }) {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 py-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="micro-label text-[#D4AF37]">NAVIGATION ATLAS</span>
        <h3 className="text-3xl md:text-5xl font-serif text-[#EAE6DF] font-light">
          THE QUANTUM JOURNEY MAP
        </h3>
        <p className="text-sm text-[#8A8780] font-light max-w-lg mx-auto">
          Eight essential milestones bridging classical mechanics to the quantum realm.
        </p>
      </div>

      {/* Nodes Constellation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {JOURNEY_NODES.map((node, idx) => {
          const isCompleted = completedNodes.includes(node.id);
          const isCurrent = idx === 0 || completedNodes.includes(JOURNEY_NODES[idx - 1]?.id);

          return (
            <button
              key={node.id}
              onClick={() => {
                sound.playSwitch();
                onSelectNode(node.target);
                if (onClose) onClose();
              }}
              className={`p-6 rounded-xl border text-left flex flex-col justify-between h-48 transition-all duration-300 relative group overflow-hidden ${
                isCompleted
                  ? 'border-[#2A9D8F] bg-[#2A9D8F]/5 hover:bg-[#2A9D8F]/10 hover:border-[#2A9D8F]'
                  : isCurrent
                  ? 'border-[#D4AF37] bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]'
                  : 'border-[#1F1F1F] bg-[#0A0A0A] opacity-60 hover:opacity-100 hover:border-[#333333]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#8A8780]">{node.number}</span>
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-[#2A9D8F]" />
                ) : isCurrent ? (
                  <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-[#5A5750]" />
                )}
              </div>

              <div>
                <h4 className="font-serif text-lg text-[#EAE6DF] group-hover:text-white transition-colors">
                  {node.title}
                </h4>
                <p className="text-xs text-[#8A8780] font-light mt-1 line-clamp-2">
                  {node.desc}
                </p>
              </div>

              <div className="flex items-center space-x-1.5 text-[11px] font-mono tracking-wider text-[#8A8780] group-hover:text-[#EAE6DF] transition-colors">
                <span>ENTER STATION</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
