import React, { useMemo, useState } from 'react'
import { BrainCircuit, Code2, GripVertical, Play, RotateCcw, Sparkles } from 'lucide-react'

const API = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

const GATES = [
  { id: 'H', name: 'H', label: 'Superposition' },
  { id: 'X', name: 'X', label: 'Bit flip' },
  { id: 'Y', name: 'Y', label: 'Bit + phase' },
  { id: 'Z', name: 'Z', label: 'Phase flip' },
  { id: 'S', name: 'S', label: 'π/2 phase' },
  { id: 'T', name: 'T', label: 'π/4 phase' },
  { id: 'CNOT', name: 'CX', label: 'Entangle' },
]

const ALGORITHMS = {
  bell: { name: 'Bell state', concept: 'Entanglement', qubits: 2, gates: [{ gate: 'H', target: 0 }, { gate: 'CNOT', control: 0, target: 1 }], challenge: 'Build a Bell state so only |00⟩ and |11⟩ appear with roughly equal probability.' },
  grover: { name: 'Grover search', concept: 'Amplitude amplification', qubits: 2, gates: [{ gate: 'H', target: 0 }, { gate: 'H', target: 1 }, { gate: 'X', target: 1 }, { gate: 'H', target: 1 }, { gate: 'CNOT', control: 0, target: 1 }, { gate: 'H', target: 1 }], challenge: 'Explore how interference can amplify a marked state.' },
  teleport: { name: 'Teleportation core', concept: 'Quantum teleportation', qubits: 3, gates: [{ gate: 'H', target: 1 }, { gate: 'CNOT', control: 1, target: 2 }, { gate: 'CNOT', control: 0, target: 1 }, { gate: 'H', target: 0 }], challenge: 'Understand the entanglement and classical communication structure of teleportation.' },
  superposition: { name: 'Equal superposition', concept: 'Superposition', qubits: 1, gates: [{ gate: 'H', target: 0 }], challenge: 'Create equal probability for |0⟩ and |1⟩.' },
}

function probabilities(counts, qubits) {
  const total = Object.values(counts || {}).reduce((a, b) => a + b, 0) || 1
  return Object.entries(counts || {}).sort((a, b) => a[0].localeCompare(b[0])).map(([state, count]) => ({
    state: state.padStart(qubits, '0'), count, probability: count / total,
  }))
}

function getSharedCircuit() { try { const raw = new URLSearchParams(window.location.hash.slice(1)).get('circuit'); return raw ? JSON.parse(atob(raw)) : null } catch { return null } }

export default function QuantumStudio({ onComplete }) {
  const shared = getSharedCircuit()
  const [qubits, setQubits] = useState(shared?.qubits || 2)
  const [gates, setGates] = useState(shared?.gates || [{ gate: 'H', target: 0 }, { gate: 'CNOT', control: 0, target: 1 }])
  const [backend, setBackend] = useState('qiskit-aer')
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [explanation, setExplanation] = useState('')
  const [code, setCode] = useState('')
  const [quiz, setQuiz] = useState(null)
  const [quizAnswer, setQuizAnswer] = useState('')
  const [quizResult, setQuizResult] = useState(null)
  const rows = useMemo(() => Array.from({ length: qubits }, (_, i) => i), [qubits])

  const addGate = (gate, target) => {
    if (gate === 'CNOT') {
      const control = target === 0 ? 1 : 0
      setGates(g => [...g, { gate, control, target }])
    } else setGates(g => [...g, { gate, target }])
    setResult(null)
  }

  const loadAlgorithm = id => {
    const a = ALGORITHMS[id]
    setQubits(a.qubits); setGates(a.gates); setResult(null); setExplanation(''); setCode('')
    setQuiz({ question: a.challenge, answer: a.concept.toLowerCase() }); setQuizAnswer(''); setQuizResult(null)
  }

  const simulate = async () => {
    setBusy(true); setExplanation('')
    try {
      const r = await fetch(API + '/simulate/multi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ num_qubits: qubits, instructions: gates, shots: 1024, backend }) })
      const data = await r.json()
      if (data.status !== 'success') throw new Error(data.message || 'Simulation failed')
      setResult(data); onComplete?.(); fetch(API + '/analytics/event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({learner_id:localStorage.getItem('quantum_learner_id') || 'local-demo',event:'simulation',module:'Quantum Studio',score:100,metadata:backend})}).catch(()=>{})
    } catch (e) { setResult({ status: 'error', message: e.message }) }
    finally { setBusy(false) }
  }

  const explain = async () => {
    if (!result) return
    setBusy(true)
    try {
      const r = await fetch(API + '/ai/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        level: 2, lesson: 'Quantum Studio', code: JSON.stringify(gates),
        message: 'Explain the circuit result to a student. Explain what each gate did, why the measurement distribution looks this way, and one thing the student should try next.',
        bug: '', history: [],
      }) })
      const data = await r.json(); setExplanation(data.answer || data.error || 'No explanation returned.')
    } catch { setExplanation('AI explanation is temporarily unavailable.') }
    finally { setBusy(false) }
  }

  const generateCode = async () => {
    setBusy(true)
    try {
      const framework = backend === 'cirq' ? 'Cirq' : backend === 'pennylane' ? 'PennyLane' : 'Qiskit'
      const r = await fetch(API + '/ai/code', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qubits, gates, framework }) })
      const data = await r.json(); setCode(data.code || data.error || 'No code generated.')
    } catch { setCode('Code generation is temporarily unavailable.') }
    finally { setBusy(false) }
  }

  const shareCircuit = async () => { const payload = btoa(JSON.stringify({ qubits, gates })); const url = window.location.origin + window.location.pathname + '#circuit=' + payload; try { await navigator.clipboard.writeText(url) } catch {} window.history.replaceState({}, '', '#circuit=' + payload) }

  const reset = () => { setGates([]); setResult(null); setExplanation(''); setCode('') }
  const dropGate = (event, target) => { event.preventDefault(); const gate = event.dataTransfer.getData('gate'); if (gate) addGate(gate, target) }

  const bars = result && result.status === 'success' ? probabilities(result.counts, qubits) : []

  return <div className="quantum-studio">
    <div className="studio-toolbar">
      <div><div className="eyebrow">QUANTUM STUDIO · BUILD → RUN → EXPLAIN → DEBUG</div><h3>One workspace for the whole quantum loop.</h3><p>Drag a gate onto a wire, run it through a real simulator backend, inspect measurement probabilities, then ask AI to explain what happened.</p></div>
      <div className="studio-controls">
        <label>QUBITS <select value={qubits} onChange={e => { setQubits(+e.target.value); setResult(null) }}>{[1,2,3,4].map(n => <option key={n}>{n}</option>)}</select></label>
        <label>BACKEND <select value={backend} onChange={e => { setBackend(e.target.value); setResult(null) }}><option value="qiskit-aer">Qiskit Aer</option><option value="pennylane">PennyLane</option><option value="cirq">Cirq</option><option value="qbraid">qBraid Gateway</option></select></label>
        <button className="secondary" onClick={shareCircuit}>Share circuit</button><button className="secondary" onClick={reset}><RotateCcw size={14}/> Reset</button>
      </div>
    </div>

    <div className="studio-algorithms"><span>START FROM ALGORITHM</span>{Object.entries(ALGORITHMS).map(([id, a]) => <button key={id} onClick={() => loadAlgorithm(id)}>{a.name}</button>)}</div>

    <div className="studio-workbench">
      <aside className="gate-palette"><div className="eyebrow">GATE PALETTE</div><p>Drag → wire</p>{GATES.map(g => <button key={g.id} draggable onDragStart={e => e.dataTransfer.setData('gate', g.id)}><GripVertical size={13}/><b>{g.name}</b><span>{g.label}</span></button>)}</aside>
      <div className="circuit-canvas">
        <div className="canvas-head"><span>VISUAL CIRCUIT</span><small>{gates.length} operations · {qubits} qubits</small></div>
        {rows.map(q => <div className="circuit-wire" key={q}><span className="wire-label">q[{q}]</span><div className="wire-line" onDragOver={e => e.preventDefault()} onDrop={e => dropGate(e, q)}><span className="zero">|0⟩</span>{gates.map((g, i) => (g.target === q || (g.gate === 'CNOT' && g.control === q)) && <button className="gate-node" key={i} onClick={() => setGates(gs => gs.filter((_, idx) => idx !== i))}>{g.gate === 'CNOT' && g.control === q ? '●' : g.gate}</button>)}<span className="drop-zone">DROP GATE</span></div></div>)}
        <div className="studio-actions"><button className="primary" onClick={simulate} disabled={busy}><Play size={15}/>{busy ? 'Running…' : 'Run simulation'}</button><button className="secondary" onClick={explain} disabled={!result || busy}><BrainCircuit size={15}/> Explain result</button><button className="secondary" onClick={generateCode} disabled={busy}><Code2 size={15}/> Generate code</button></div>
      </div>
    </div>

    {result?.status === 'error' && <div className="studio-error">{result.message}</div>}

    {result?.status === 'success' && <div className="studio-results">
      <div className="result-head"><div><div className="eyebrow">EXECUTION RESULT</div><h4>{result.backend}</h4></div><span>{result.shots} SHOTS</span></div>
      <div className="result-grid"><div className="histogram">{bars.map(b => <div className="hist-bar" key={b.state}><div className="bar-shell"><i style={{ height: Math.max(3, b.probability * 100) + '%' }}/></div><b>|{b.state}⟩</b><small>{(b.probability * 100).toFixed(1)}%</small></div>)}</div>
      <div className="state-panel"><div className="eyebrow">STATE INSPECTOR</div>{result.statevector ? Object.entries(result.statevector).slice(0, 8).map(([state, amplitude]) => <div className="state-row" key={state}><span>{state}</span><code>{typeof amplitude === 'string' ? amplitude : JSON.stringify(amplitude)}</code></div>) : <p>This backend exposes measurement results here. Use the histogram to compare outcomes.</p>}</div></div>
      {explanation && <div className="ai-explanation"><Sparkles size={18}/><div><div className="eyebrow">AI EXPLANATION</div><p>{explanation}</p></div></div>}
      {code && <pre className="generated-code"><code>{code}</code></pre>}
    </div>}

    {quiz && <div className="studio-assessment"><div><div className="eyebrow">CHECK YOUR UNDERSTANDING</div><h4>Explain the mission in one phrase.</h4><p>{quiz.question}</p></div><div className="assessment-row"><input value={quizAnswer} onChange={e => setQuizAnswer(e.target.value)} placeholder="e.g. entanglement"/><button className="secondary" onClick={() => setQuizResult(quizAnswer.trim().toLowerCase().includes(quiz.answer) ? 'Correct — you connected the concept to the circuit.' : 'Not quite. Run the circuit, inspect the result, then try again.')}>Check</button></div>{quizResult && <div className={quizResult.startsWith('Correct') ? 'assessment-good' : 'assessment-hint'}>{quizResult}</div>}</div>}
  </div>
}




