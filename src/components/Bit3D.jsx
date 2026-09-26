import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Zap, Info, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

export default function Bit3D({ onComplete }) {
  const [state, setState] = useState(0);

  const toggleBit = () => {
    sound.playSwitch();
    const nextState = state === 0 ? 1 : 0;
    setState(nextState);
    if (onComplete) onComplete();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 py-6">
      {/* Title & Principle */}
      <div className="text-center space-y-3">
        <span className="micro-label text-[#8A8780]">SECTION 03 — CLASSICAL ARCHITECTURE</span>
        <h3 className="text-3xl md:text-5xl font-serif text-[#EAE6DF] font-light">
          THE CLASSICAL BIT
        </h3>
        <p className="text-sm md:text-base text-[#8A8780] max-w-xl mx-auto font-light">
          A classical bit is physically constrained to one of two mutually exclusive binary states: 
          <strong> 0 (LOW)</strong> or <strong>1 (HIGH)</strong>.
        </p>
      </div>

      {/* 3D Visual Switch Board */}
      <div className="relative rounded-2xl border border-[#222222] bg-[#0A0A0A] p-10 md:p-16 flex flex-col items-center justify-center space-y-8 shadow-2xl">
        {/* Voltage State Indicator */}
        <div className="flex items-center space-x-4">
          <div className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-widest border transition-all duration-300 ${
            state === 0 ? 'border-[#444444] text-[#8A8780] bg-[#111111]' : 'border-[#4ECDC4] text-[#4ECDC4] bg-[#4ECDC4]/10 shadow-[0_0_20px_rgba(78,205,196,0.3)]'
          }`}>
            VOLTAGE: {state === 0 ? '0.0 V (OFF)' : '+5.0 V (ON)'}
          </div>
          <div className="text-xs font-mono text-[#8A8780]">
            LOGIC GATE: TRANSISTOR SW
          </div>
        </div>

        {/* Big Interactive 3D Tactile Toggle Switch */}
        <button
          onClick={toggleBit}
          className={`relative group w-48 h-48 md:w-56 md:h-56 rounded-full border-2 transition-all duration-500 flex flex-col items-center justify-center shadow-2xl cursor-pointer ${
            state === 1
              ? 'border-[#4ECDC4] bg-[#0D1B1E] shadow-[0_0_50px_rgba(78,205,196,0.35)]'
              : 'border-[#2E2E2E] bg-[#0F0F0F] hover:border-[#444444]'
          }`}
        >
          <div className={`text-6xl md:text-8xl font-serif transition-transform duration-300 ${
            state === 1 ? 'text-[#4ECDC4] scale-110' : 'text-[#5A5750]'
          }`}>
            {state}
          </div>

          <div className="mt-3 flex items-center space-x-2 text-[11px] font-mono tracking-widest text-[#8A8780]">
            <Zap className={`w-3.5 h-3.5 ${state === 1 ? 'text-[#4ECDC4]' : 'text-[#5A5750]'}`} />
            <span>{state === 0 ? 'CLICK TO SWITCH (1)' : 'CLICK TO SWITCH (0)'}</span>
          </div>
        </button>

        {/* State Explanation Box */}
        <div className="max-w-md text-center text-xs text-[#8A8780] font-light leading-relaxed bg-[#050505] p-4 rounded-lg border border-[#1A1A1A]">
          "A classical bit stores information as either 0 or 1. Deterministic, discrete, and non-superposable."
        </div>
      </div>
    </div>
  );
}
