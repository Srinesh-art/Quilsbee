import React, { useState } from 'react';
import { X, Sparkles, Send, BrainCircuit } from 'lucide-react';
import { sound } from '../utils/audio';

const SUGGESTIONS = [
  "How does a Hadamard gate create superposition?",
  "What is the physical meaning of the Bloch Sphere?",
  "Why is measurement in quantum mechanics non-reversible?",
  "How does Grover's search achieve quadratic speedup?",
];

export default function AIGuideDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Greetings. I am your Quantum Guide. Ask me anything regarding state vectors, the Bloch sphere, or quantum circuit architecture."
    }
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (textToSend = null) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    sound.playSwitch();
    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Generate intelligent contextual response
    setTimeout(() => {
      sound.playGateAdd();
      let reply = "In quantum mechanics, this principle is governed by unitary operations in Hilbert space. Total probability is conserved at 100% until projective measurement occurs.";
      
      const lower = text.toLowerCase();
      if (lower.includes('hadamard')) {
        reply = "The Hadamard (H) gate performs a 90° rotation around the Y-axis followed by a 180° rotation around the X-axis on the Bloch Sphere. It transforms |0⟩ into (|0⟩ + |1⟩)/√2 and |1⟩ into (|0⟩ - |1⟩)/√2.";
      } else if (lower.includes('bloch')) {
        reply = "The Bloch Sphere is a geometric representation of pure 1-qubit quantum states. The North Pole is |0⟩ (θ=0), the South Pole is |1⟩ (θ=π), and the equator contains equal superposition states.";
      } else if (lower.includes('grover')) {
        reply = "Grover's algorithm uses amplitude amplification: first inverting the target phase via an Oracle (-1), then reflecting all state amplitudes about their mean, boosting the target probability to ~100% in O(√N) iterations.";
      } else if (lower.includes('entangle')) {
        reply = "Entanglement creates a composite quantum state that cannot be factored into independent product states (e.g. |Φ⁺⟩ = (|00⟩ + |11⟩)/√2). Measuring one qubit collapses the entire joint wavefunction instantly.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 400);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0A0A0A]/95 backdrop-blur-2xl border-l border-[#222222] shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-[#222222] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="w-4 h-4 text-[#D4AF37]" />
          <span className="font-serif text-sm tracking-widest text-[#EAE6DF]">QUANTUM SCIENTIST AI</span>
        </div>
        <button onClick={onClose} className="p-1 text-[#8A8780] hover:text-[#EAE6DF]">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl text-xs leading-relaxed ${
              m.sender === 'user'
                ? 'bg-[#1A1A1A] text-[#EAE6DF] ml-8 border border-[#333333]'
                : 'bg-[#050505] text-[#8A8780] mr-8 border border-[#222222]'
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Quick suggestions */}
      <div className="p-3 border-t border-[#1A1A1A] flex flex-wrap gap-1.5">
        {SUGGESTIONS.slice(0, 2).map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="text-[10px] font-mono text-[#8A8780] bg-[#111111] hover:text-[#D4AF37] px-2.5 py-1 rounded border border-[#222222] truncate max-w-full"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#222222] flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask quantum questions..."
          className="flex-1 bg-[#050505] border border-[#222222] rounded-full px-4 py-2 text-xs text-[#EAE6DF] focus:outline-none focus:border-[#D4AF37]"
        />
        <button
          onClick={() => handleSend()}
          className="p-2.5 rounded-full bg-[#D4AF37] text-[#050505] hover:bg-[#e6bf47] transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
