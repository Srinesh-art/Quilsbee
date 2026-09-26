import React, { useState } from "react"
import { Check, ChevronDown, ChevronRight, Play } from "lucide-react"
import MCQSession from "./MCQSession"

const STAGES = [
  { id:"orientation", number:"01", title:"Quantum Orientation", subtitle:"Know what quantum computing is before touching a qubit.", goal:"Build the vocabulary and mental model required for every later topic.", lessons:[
    ["What is Quantum Computing?","Classical vs quantum computing.","quantum"],
    ["Bits vs Qubits","How classical information differs from quantum information.","quantum"],
    ["Why Quantum?","Superposition, interference and entanglement as resources.","quantum"],
    ["First Quantum Vocabulary","Qubit, state, gate, circuit, measurement and simulator.","quantum"]
  ]},
  { id:"qubit", number:"02", title:"Qubit Fundamentals", subtitle:"Learn one qubit completely before combining many.", goal:"Describe a qubit state and predict a simple measurement.", lessons:[
    ["Basis States |0> and |1>","Computational basis and state notation.","qubit"],
    ["Superposition","Linear combinations of basis states.","qubit"],
    ["Probability Amplitudes","Amplitudes, normalization and measurement probabilities.","qubit"],
    ["The Bloch Sphere","Visualize a single-qubit state.","qubit"],
    ["Measurement","Turn quantum states into classical outcomes.","qubit"]
  ]},
  { id:"gates", number:"03", title:"Quantum Gates", subtitle:"Learn each operation before combining them.", goal:"Know what the common gates do to basis and superposition states.", lessons:[
    ["X Gate","Bit flip operation.","studio"],
    ["Z Gate","Phase flip and why phase matters.","studio"],
    ["Hadamard Gate","Create and remove equal superposition.","studio"],
    ["S and T Gates","Phase rotation building blocks.","studio"],
    ["CNOT Gate","Controlled operation and the bridge to entanglement.","studio"]
  ]},
  { id:"circuits", number:"04", title:"Quantum Circuits", subtitle:"Turn gates into executable programs.", goal:"Read, construct, simulate and explain a quantum circuit.", lessons:[
    ["Circuit Diagrams","Read wires, gate order, controls and measurements.","studio"],
    ["Circuit Execution","Map, optimize, execute and inspect.","studio"],
    ["Measurement Histograms","Read shot counts as probabilities.","studio"],
    ["State Inspection","Compare state vectors with measured outcomes.","studio"],
    ["Your First Circuit","Build a circuit from scratch.","studio"]
  ]},
  { id:"multi", number:"05", title:"Multiple Qubits & Entanglement", subtitle:"Move from one qubit to quantum systems.", goal:"Understand correlations that cannot be reduced to independent qubits.", lessons:[
    ["Two-Qubit States","The four computational basis states.","entanglement"],
    ["Tensor Products","How separate quantum systems combine.","entanglement"],
    ["Bell States","Create an entangled state with H and CNOT.","entanglement"],
    ["Quantum Correlations","Observe correlated measurement outcomes.","entanglement"],
    ["Teleportation","Transfer quantum information using entanglement and classical communication.","algorithms"]
  ]},
  { id:"algorithms", number:"06", title:"Quantum Algorithms", subtitle:"Only after the foundations are in place.", goal:"Connect gates and interference to standard algorithms.", lessons:[
    ["Interference","Constructive and destructive interference.","algorithms"],
    ["Deutsch-Jozsa","A first quantum query algorithm.","algorithms"],
    ["Bernstein-Vazirani","Recover a hidden bit string with an oracle.","algorithms"],
    ["Grover Search","Amplitude amplification for unstructured search.","algorithms"],
    ["Quantum Fourier Transform","A Fourier basis change used by several algorithms.","algorithms"],
    ["Shor and Factoring","Period finding and the role of QFT.","algorithms"]
  ]},
  { id:"programming", number:"07", title:"Programming Foundations", subtitle:"Learn the Python pieces in dependency order, then learn quantum SDKs.", goal:"Move from Python basics to real quantum programs without skipping prerequisites.", lessons:[
    ["What is Python?","What Python is and why quantum SDKs use it.","studio"],
    ["Variables and Values","Names, assignment and values.","studio"],
    ["Data Types","int, float, str, bool, list and dict.","studio"],
    ["Operators","Arithmetic, comparison and boolean logic.","studio"],
    ["Conditions","if, elif and else.","studio"],
    ["Loops","for, while and range.","studio"],
    ["Functions","def, parameters and return values.","studio"],
    ["Lists and Dictionaries","Collections used for quantum data.","studio"],
    ["Qiskit Basics","QuantumCircuit, gates, measurement and execution.","studio"],
    ["PennyLane Basics","Devices, quantum functions and QNodes.","studio"],
    ["Cirq Basics","Qubits, gates, circuits and simulation.","studio"],
    ["Code to Circuit","Compare source code with the visual circuit.","studio"]
  ]},
  { id:"practice", number:"08", title:"Practice & Debugging", subtitle:"Turn mistakes into deliberate practice.", goal:"Diagnose conceptual mistakes instead of only fixing syntax.", lessons:[
    ["Fix a Broken Circuit","Repair a meaningful quantum bug.","debug"],
    ["Create a Bug","Plant a bug another learner can solve.","debug"],
    ["AI Explanation","Ask Q-Bot why a circuit behaves that way.","studio"],
    ["Challenge Mode","Solve a progressively harder task.","assessment"]
  ]},
  { id:"mastery", number:"09", title:"Mastery", subtitle:"Prove that you can transfer the knowledge.", goal:"Build, explain and defend a complete quantum solution.", lessons:[
    ["Final Circuit Challenge","Construct the requested state and explain every operation.","assessment"],
    ["Algorithm Challenge","Choose an algorithm deliberately.","algorithms"],
    ["Explain It","Teach the concept using your own analogy.","story"],
    ["Mastery Complete","Review the foundations and choose a specialization.","assessment"]
  ]}
]

const CONTENT = {
  "What is Quantum Computing?":["A quantum computer processes information using quantum states. It is not simply a faster classical computer.","Classical bit: 0 or 1. Qubit: a quantum state that can contain amplitudes for both basis states.","Explain quantum computing without calling it a faster classical computer."],
  "Bits vs Qubits":["A classical bit has two basis values. A qubit also has two basis states, but its state can be a superposition.","|0> and |1> are the computational basis states.","Name the two basis states of one qubit."],
  "Superposition":["A qubit can be represented as a linear combination of basis states. Measurement still returns one classical outcome.","(|0> + |1>) / sqrt(2) gives 50 percent probability for each outcome.","What probability does each result have?"],
  "Probability Amplitudes":["A state alpha|0> + beta|1> has probabilities |alpha|^2 and |beta|^2. They must sum to 1.","If |alpha|^2 = 0.8, then |beta|^2 = 0.2.","Calculate the missing probability."],
  "The Bloch Sphere":["The Bloch sphere maps a pure single-qubit state to a point on a sphere.","|0> and |1> are opposite poles; other pure states lie elsewhere on the surface.","Find |0> and |1> on the sphere."],
  "Measurement":["Measurement converts quantum information into classical information. Repeated shots reveal the probability distribution.","1024 shots of an equal superposition approach 512 zeros and 512 ones.","Why can individual shots differ while the distribution stays stable?"],
  "X Gate":["X flips the computational basis: X|0> = |1> and X|1> = |0>.","Start in |0>, apply X, then measure.","Which state should dominate?"],
  "Z Gate":["Z changes the phase of |1> while leaving |0> unchanged. Phase can later affect interference.","Z on an equal superposition changes relative phase.","Why might the next gate reveal a phase change?"],
  "Hadamard Gate":["H creates equal superposition from |0> and maps |1> to the negative phase superposition.","H|0> gives an equal superposition. H applied twice returns the original state.","What happens when H is applied twice?"],
  "CNOT Gate":["CNOT flips the target only when the control is |1>.","H(q0) followed by CNOT(q0,q1) creates a Bell state from |00>.","Which qubit controls the flip?"],
  "Your First Circuit":["A circuit is an ordered program of quantum operations. Build it, run it, inspect it and explain it.","H(q0); CNOT(q0,q1); measure.","Build the Bell circuit in Quantum Studio."],
  "Bell States":["A Bell state is an entangled two-qubit state that cannot be written as independent single-qubit states.","(|00> + |11>) / sqrt(2).","Which two outcomes should dominate the histogram?"],
  "Grover Search":["Grover marks a target with an oracle and uses diffusion to amplify its amplitude. The ideal query advantage is quadratic.","Oracle plus diffusion repeatedly increases the target probability.","What does the oracle mark?"],
  "Quantum Fourier Transform":["QFT changes the basis into a Fourier representation and is important in period-finding algorithms.","Shor uses QFT-based period finding.","Why is QFT useful for periodic structure?"],
  "What is Python?":["Python is a general-purpose programming language used for scripting, data science, automation and quantum software.","Python is the language used by Qiskit, PennyLane and Cirq examples.","Why is Python useful in quantum computing?"],
  "Variables and Values":["A variable is a name that refers to a value. Assignment connects the name to the value.","shots = 1024; name = Akira.","Which part is the variable and which part is the value?"],
  "Data Types":["Python values have types such as int, float, str, bool, list and dict.","shots = 1024 is an int; probability = 0.5 is a float.","What type is 1024?"],
  "Operators":["Operators calculate values or compare them. Comparison operators produce True or False.","shots = 512 + 512; ready = shots >= 1024.","What value does shots contain?"],
  "Conditions":["if, elif and else choose a code path based on a condition.","if probability > 0.5 then print dominant.","What happens when the condition is false?"],
  "Loops":["Loops repeat work. for, while and range are enough for many beginner quantum scripts.","for shot in range(3) repeats three times.","How many iterations occur?"],
  "Functions":["Functions package reusable logic into a named operation with inputs and an optional result.","def square(x): return x * x.","What does return provide?"],
  "Lists and Dictionaries":["Lists store ordered values. Dictionaries map keys to values. Measurement counts are commonly dictionaries.","counts maps 00 to 512 and 11 to 512.","What information does the key represent?"],
  "Qiskit Basics":["QuantumCircuit is the main circuit object. Add gates, measurements and execute the circuit on a backend.","qc = QuantumCircuit(2); qc.h(0); qc.cx(0,1).","Build a Bell circuit in Code Mode."],
  "PennyLane Basics":["PennyLane uses devices and quantum functions to define executable quantum programs.","A device represents the simulator or quantum backend used by the quantum function.","What does the device represent?"],
  "Cirq Basics":["Cirq models qubits, gates and circuits as Python objects and provides simulators.","Create qubits, append gates, simulate.","Name the three basic objects."],
  "Code to Circuit":["The same quantum program can be represented as source code and as a circuit diagram.","qc.h(0); qc.cx(0,1) corresponds to H on q0 then CNOT.","Compare your code with the visual circuit."],
  "Fix a Broken Circuit":["A program can be syntactically valid but conceptually wrong. Check state, gate order, target, control and measurement.","Changing H to X changes a superposition experiment into a deterministic flip.","Use Bug Arena to repair the circuit."],
  "Create a Bug":["A good bug changes the meaning of an algorithm, not just its punctuation.","Move a CNOT control or target so the intended Bell correlation disappears.","Create a bug another learner can diagnose."],
  "AI Explanation":["Use Q-Bot to ask why a result happened and then verify the answer experimentally.","Ask why H followed by measurement produces roughly 50/50.","Run the experiment after asking the question."]
}

function lessonContent(title) {
  if (CONTENT[title]) return CONTENT[title]
  return [
    "Learn the idea, connect it to the previous prerequisite, then test it with an interactive experiment.",
    "Use the examples and Quantum Studio to turn the concept into something observable.",
    "Explain the idea in your own words before moving to the next lesson."
  ]
}

export default function CurriculumPath({ xp, level, onEarn }) {
  const [open, setOpen] = useState(0)
  const [selected, setSelected] = useState("What is Quantum Computing?")
  const completedLessons = Math.min(50, Math.floor(Math.max(0, xp - 420) / 45))
  const [learn, example, practice] = lessonContent(selected)
  const flatLessons = STAGES.flatMap(stage => stage.lessons)
  const selectedIndex = flatLessons.findIndex(item => item[0] === selected)
  const nextLesson = flatLessons[selectedIndex + 1]?.[0] || selected
  const jump = target => document.getElementById(target)?.scrollIntoView({ behavior:"smooth" })
  const labFor = target => {
    if (target === "debug") return "debug"
    if (target === "algorithms") return "algorithms"
    if (target === "entanglement") return "entanglement"
    if (target === "assessment") return "assessment"
    if (target === "story") return "story"
    return "studio"
  }

  return <div className="curriculum">
    <div className="curriculum-intro">
      <div><div className="eyebrow">STRUCTURED CURRICULUM</div><h3>Learn in the right order.</h3><p>Each stage has prerequisites. You learn the idea, see an example, perform an interactive task, pass a checkpoint, and then move forward.</p></div>
      <div className="curriculum-progress"><b>{completedLessons}</b><span>LESSONS<br/>COMPLETED</span></div>
    </div>
    <div className="curriculum-layout">
      <div className="curriculum-rail">
        {STAGES.map((stage,index) => {
          const isOpen = open === index
          return <div className={"curriculum-stage " + (isOpen ? "open" : "")} key={stage.id}>
            <button className="stage-head" onClick={() => setOpen(isOpen ? -1 : index)}>
              <div className="stage-number">{index < Math.floor(completedLessons / 4) ? <Check size={14}/> : stage.number}</div>
              <div className="stage-title"><span>STAGE {stage.number}</span><b>{stage.title}</b><small>{stage.subtitle}</small></div>
              <div className="stage-state">{index < Math.floor(completedLessons / 4) ? "COMPLETE" : index === Math.floor(completedLessons / 4) ? "CURRENT" : "UP NEXT"}{isOpen ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}</div>
            </button>
            {isOpen && <div className="stage-body">
              <div className="stage-goal"><span>STAGE GOAL</span><b>{stage.goal}</b></div>
              <div className="curriculum-lessons">
                {stage.lessons.map((item,i) => {
                  const done = flatLessons.findIndex(x => x[0] === item[0]) < completedLessons
                  return <button className={"curriculum-lesson " + (done ? "done " : "") + (selected === item[0] ? "selected" : "")} key={item[0]} onClick={() => setSelected(item[0])}>
                    <span className="lesson-index">{done ? <Check size={12}/> : String(i + 1).padStart(2,"0")}</span>
                    <span><b>{item[0]}</b><small>{item[1]}</small></span>
                    <Play size={14}/>
                  </button>
                })}
              </div>
            </div>}
          </div>
        })}
      </div>
      <article className="lesson-player">
        <div className="lesson-player-top"><span className="lesson-player-tag">CURRENT LESSON</span><span>{selected}</span></div>
        <div className="lesson-player-body">
          <div className="lesson-step"><span>01 · LEARN</span><h3>{learn}</h3></div>
          <div className="lesson-step"><span>02 · SEE IT</span><div className="lesson-example"><code>{example}</code></div></div>
          <div className="lesson-step"><span>03 · TRY IT</span><p>{practice}</p><button className="secondary" onClick={() => jump(labFor(STAGES.find(s => s.lessons.some(x => x[0] === selected))?.lessons.find(x => x[0] === selected)?.[2]))}><Play size={14}/> Open interactive lab</button></div>
          <div className="lesson-step checkpoint"><span>04 · CHECKPOINT</span><b>Explain the idea in your own words before continuing.</b><button className="secondary" onClick={() => setSelected(nextLesson)}><ChevronRight size={14}/> Next lesson</button></div>
          <MCQSession key={selected} lesson={selected} level={level || 1} onEarn={onEarn}/>
        </div>
      </article>
    </div>
  </div>
}
