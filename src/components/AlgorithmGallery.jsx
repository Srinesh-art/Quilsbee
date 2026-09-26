import React, { useState } from 'react'
import { ArrowRight, BookOpen, Cpu, Search } from 'lucide-react'

const ALGORITHMS = [
  ['Deutsch–Jozsa','Oracle / interference','Determine whether a promised Boolean function is constant or balanced.','Superposition → oracle → Hadamard → measurement.'],
  ['Grover Search','Amplitude amplification','Increase the probability of a marked item in an unstructured search space.','Oracle marks the target; diffusion amplifies its amplitude.'],
  ['Bernstein–Vazirani','Hidden-bit recovery','Recover a hidden bit string with a single oracle query in the idealized setting.','Phase kickback encodes the hidden string.'],
  ['Quantum Teleportation','State transfer','Transfer an unknown qubit state using entanglement plus two classical bits.','Bell pair → joint measurement → classical correction.'],
  ['Quantum Fourier Transform','Fourier basis change','Transform amplitudes into a Fourier basis used inside several quantum algorithms.','Hadamards and controlled phase rotations.'],
  ['VQE','Hybrid optimization','Estimate ground-state energies with a parameterized quantum circuit and classical optimizer.','Prepare ansatz → measure expectation → optimize parameters.'],
  ['QAOA','Combinatorial optimization','Use alternating problem and mixer operators to explore approximate solutions.','Parameterized layers → objective measurement → classical optimization.'],
  ['Shor','Integer factoring','Factor integers using quantum period finding; the practical resource requirements are substantial.','QFT-based period finding plus classical post-processing.'],
]

export default function AlgorithmGallery() {
  const [active, setActive] = useState(0)
  const item = ALGORITHMS[active]
  return <div className="algorithm-gallery">
    <div className="algorithm-grid">{ALGORITHMS.map((a, i) => <button key={a[0]} className={i === active ? 'algorithm-tile active' : 'algorithm-tile'} onClick={() => setActive(i)}><span>{String(i + 1).padStart(2, '0')}</span><b>{a[0]}</b><small>{a[1]}</small></button>)}</div>
    <div className="algorithm-detail"><div className="algorithm-icon"><Cpu size={24}/></div><div><div className="eyebrow">STANDARD ALGORITHM · {item[1]}</div><h3>{item[0]}</h3><p>{item[2]}</p><div className="algorithm-flow"><Search size={15}/><span>{item[3]}</span></div><div className="algorithm-note"><BookOpen size={14}/><span>Learn the idea here, then use Quantum Studio to construct and simulate the relevant gates.</span></div></div><ArrowRight className="algorithm-arrow" size={20}/></div>
  </div>
}

