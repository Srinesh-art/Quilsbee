import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Sparkles, RefreshCw, Compass } from 'lucide-react';
import { QuantumCircuit } from '../engine/quantumSimulator';
import { sound } from '../utils/audio';

export default function Qubit3D({ onComplete }) {
  const canvasRef = useRef(null);
  const thetaRef = useRef(0);
  const phiRef = useRef(0);
  const superposedRef = useRef(false);
  const [qc] = useState(() => new QuantumCircuit(1));
  const [stateName, setStateName] = useState('|0⟩');
  const [theta, setTheta] = useState(0); // 0 = |0>, PI = |1>
  const [phi, setPhi] = useState(0);
  const [isSuperposed, setIsSuperposed] = useState(false);

  // Set explicit state
  const setPresetState = (targetTheta, targetPhi, name) => {
    sound.playSwitch();
    setTheta(targetTheta);
    setPhi(targetPhi);
    setStateName(name);
    setIsSuperposed(targetTheta > 0.1 && targetTheta < Math.PI - 0.1);
    if (onComplete) onComplete();
  };

  useEffect(() => {
    thetaRef.current = theta;
    phiRef.current = phi;
    superposedRef.current = isSuperposed;
  }, [theta, phi, isSuperposed]);

  const applyHadamard = () => {
    sound.playSuperposition();
    setTheta(Math.PI / 2);
    setPhi(0);
    setStateName('|+⟩ = (|0⟩ + |1⟩)/√2');
    setIsSuperposed(true);
    if (onComplete) onComplete();
  };

  // Canvas 3D Bloch Sphere Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let width = 480;
    let height = 400;
    const resize = () => {
      width = canvas.width = Math.max(320, canvas.parentElement?.clientWidth || 480);
      height = canvas.height = 400;
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas.parentElement || canvas);

    let rotY = 0.4;
    let rotX = 0.25;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      rotY += dx * 0.01;
      rotX += dy * 0.01;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onMouseUp = () => { isDragging = false; };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const R = 130;
    let cx = width / 2;
    let cy = height / 2;

    const project = (x, y, z) => {
      // 3D rotation
      // Rotate around Y
      let x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
      let z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
      // Rotate around X
      let y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
      let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

      const fov = 400;
      const scale = fov / (fov + z2);
      return {
        px: cx + x1 * scale,
        py: cy + y2 * scale,
        scale,
        depth: z2,
      };
    };

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Ambient glow
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, R * 1.3);
      grad.addColorStop(0, 'rgba(78, 205, 196, 0.05)');
      grad.addColorStop(1, 'rgba(78, 158, 145, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Give the sphere a visible blue-green glass body on the light surface.
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      const sphereFill = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.08, cx, cy, R);
      sphereFill.addColorStop(0, 'rgba(255, 255, 255, 0.62)');
      sphereFill.addColorStop(0.55, 'rgba(168, 218, 207, 0.28)');
      sphereFill.addColorStop(1, 'rgba(78, 158, 145, 0.10)');
      ctx.fillStyle = sphereFill;
      ctx.fill();
      ctx.strokeStyle = 'rgba(38, 108, 98, 0.46)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw equator ring (Z = 0)
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.1) {
        const x = R * Math.cos(a);
        const y = R * Math.sin(a);
        const z = 0;
        const p = project(x, z, y);
        if (a === 0) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      }
      ctx.strokeStyle = 'rgba(38, 108, 98, 0.38)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw meridian ring (X = 0)
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.1) {
        const y = R * Math.cos(a);
        const z = R * Math.sin(a);
        const x = 0;
        const p = project(x, y, z);
        if (a === 0) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      }
      ctx.strokeStyle = 'rgba(55, 125, 114, 0.30)';
      ctx.stroke();

      // Draw coordinate axes
      const axes = [
        { label: '+Z |0⟩', x: 0, y: -R * 1.25, z: 0, color: '#2f8f84' },
        { label: '-Z |1⟩', x: 0, y: R * 1.25, z: 0, color: '#287b95' },
        { label: '+X |+⟩', x: R * 1.2, y: 0, z: 0, color: '#286d62' },
        { label: '+Y |i⟩', x: 0, y: 0, z: R * 1.2, color: '#286d62' },
      ];

      axes.forEach(axis => {
        const origin = project(0, 0, 0);
        const end = project(axis.x, axis.y, axis.z);
        ctx.beginPath();
        ctx.moveTo(origin.px, origin.py);
        ctx.lineTo(end.px, end.py);
        ctx.strokeStyle = 'rgba(35, 96, 88, 0.48)';
        ctx.stroke();

        ctx.fillStyle = axis.color;
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(axis.label, end.px + 6, end.py + 4);
      });

      // Calculate state vector endpoint
      // theta in [0, PI], phi in [0, 2PI]
      // In our 3D space: Y is up/down (theta=0 is Y=-R), X is right, Z is forward
      const vx = R * Math.sin(theta) * Math.cos(phi);
      const vy = -R * Math.cos(theta); // up is negative Y
      const vz = R * Math.sin(theta) * Math.sin(phi);

      const pVec = project(vx, vy, vz);
      const pCenter = project(0, 0, 0);

      // Draw State Vector Arrow
      ctx.beginPath();
      ctx.moveTo(pCenter.px, pCenter.py);
      ctx.lineTo(pVec.px, pVec.py);
      ctx.strokeStyle = '#4ECDC4';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#4ECDC4';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Arrowhead / glowing node
      ctx.beginPath();
      ctx.arc(pVec.px, pVec.py, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#f7fffc';
      ctx.fill();
      ctx.strokeStyle = '#4ECDC4';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw orbital quantum particle trail
      for (let i = 0; i < 8; i++) {
        const pAngle = time * 2 + (i * Math.PI) / 4;
        const rOrbit = isSuperposed ? 24 : 10;
        const ox = vx + Math.cos(pAngle) * rOrbit;
        const oy = vy + Math.sin(pAngle) * (rOrbit * 0.5);
        const oz = vz + Math.sin(pAngle) * rOrbit;
        const op = project(ox, oy, oz);

        ctx.beginPath();
        ctx.arc(op.px, op.py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(78, 205, 196, ${1 - i * 0.12})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(animId);
    };
  }, [theta, phi, isSuperposed]);

  // Probabilities
  const prob0 = Math.cos(theta / 2) ** 2;
  const prob1 = Math.sin(theta / 2) ** 2;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-4">
      {/* Title & Micro Information */}
      <div className="text-center space-y-2">
        <span className="micro-label text-[#D4AF37]">SECTION 04 — QUANTUM STATE SPACE</span>
        <h3 className="text-3xl md:text-5xl font-serif text-[#EAE6DF] font-light">
          THE BLOCH SPHERE
        </h3>
        <p className="text-sm text-[#8A8780] font-light max-w-lg mx-auto">
          Unlike a classical switch, a qubit spans an entire continuous sphere of possibilities.
        </p>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* 3D Canvas Sphere View */}
        <div className="lg:col-span-7 relative glass-panel rounded-2xl p-4 border border-[#222222] flex flex-col items-center">
          <canvas ref={canvasRef} className="cursor-grab active:cursor-grabbing w-full h-[400px]" />
          <div className="absolute bottom-4 left-6 flex items-center space-x-2 text-[10px] font-mono text-[#8A8780]">
            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>DRAG TO ROTATE VIEW (3D)</span>
          </div>
        </div>

        {/* Quantum Controls & Mathematical Telemetry */}
        <div className="lg:col-span-5 space-y-6">
          {/* Current State Readout */}
          <div className="glass-panel p-6 rounded-xl border border-[#222222] space-y-3">
            <span className="micro-label text-[#8A8780]">ACTIVE QUANTUM STATE</span>
            <div className="font-mono text-xl text-[#4ECDC4]">{stateName}</div>
            
            {/* Probability Bars */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-mono text-[#8A8780]">
                <span>P(|0⟩): {(prob0 * 100).toFixed(1)}%</span>
                <span>P(|1⟩): {(prob1 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#111111] overflow-hidden flex">
                <div className="h-full bg-[#4ECDC4] transition-all duration-300" style={{ width: `${prob0 * 100}%` }} />
                <div className="h-full bg-[#D4AF37] transition-all duration-300" style={{ width: `${prob1 * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Basis State Presets */}
          <div className="space-y-3">
            <span className="micro-label text-[#8A8780]">APPLY QUANTUM STATES</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPresetState(0, 0, '|0⟩')}
                className={`py-2.5 rounded-lg border text-xs font-mono transition-all ${
                  theta === 0 ? 'border-[#4ECDC4] bg-[#4ECDC4]/10 text-[#4ECDC4]' : 'border-[#222222] text-[#8A8780] hover:border-[#444444]'
                }`}
              >
                |0⟩ (Ground)
              </button>
              <button
                onClick={() => setPresetState(Math.PI, 0, '|1⟩')}
                className={`py-2.5 rounded-lg border text-xs font-mono transition-all ${
                  theta === Math.PI ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' : 'border-[#222222] text-[#8A8780] hover:border-[#444444]'
                }`}
              >
                |1⟩ (Excited)
              </button>
              <button
                onClick={applyHadamard}
                className={`py-2.5 rounded-lg border text-xs font-mono transition-all ${
                  isSuperposed ? 'border-[#9D4EDD] bg-[#9D4EDD]/15 text-[#9D4EDD]' : 'border-[#222222] text-[#8A8780] hover:border-[#444444]'
                }`}
              >
                |+⟩ (Hadamard)
              </button>
            </div>
          </div>

          {/* Manual Polar Sliders */}
          <div className="space-y-3 p-4 rounded-lg bg-[#080808] border border-[#1A1A1A]">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-[#8A8780]">
                <span>POLAR ANGLE θ: {(theta / Math.PI).toFixed(2)}π</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.PI}
                step="0.02"
                value={theta}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setTheta(val);
                  setStateName(`|ψ(θ=${(val/Math.PI).toFixed(2)}π)⟩`);
                  setIsSuperposed(val > 0.1 && val < Math.PI - 0.1);
                }}
                className="w-full accent-[#4ECDC4] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
