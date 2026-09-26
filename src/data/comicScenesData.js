/**
 * THE QUANTUM WORLD - Manga Story & Character Dialogue System
 * Contains percentage-based responsive hotspots for Akira, Sensei Q, and Qubi,
 * multi-step dialogue scripts, and concept explore targets.
 */

export const COMIC_PAGES = [
  {
    page: 1,
    image: "/assets/comics/page-01.jpg",
    chapter: "CHAPTER 01",
    title: "MODEL & QUBITS: A NEW BEGINNING",
    subtitle: "Stepping into a world where information transcends 0 and 1.",
    explore: {
      target: "bit",
      label: "EXPLORE COMPUTING MODELS",
      desc: "Compare classical binary logic with quantum state representation."
    },
    characters: [
      {
        id: "akira",
        name: "Akira (Student)",
        role: "Aspiring Quantum Researcher",
        avatar: "⚡",
        hotspot: { x: 28, y: 18, width: 22, height: 28 }, // Hero standing facing quantum academy
        dialogue: [
          "After years of traditional computing... I finally step into the Quantum Academy.",
          "A world where information isn't just fixed at 0 or 1, but shaped by probability waves.",
          "Sensei Q told me everything begins by redefining what a 'computing model' actually is."
        ]
      },
      {
        id: "sensei_q",
        name: "Sensei Q (Mentor)",
        role: "Chief Quantum Scientist",
        avatar: "🔬",
        hotspot: { x: 10, y: 44, width: 25, height: 20 }, // Sensei Q bottom left panel
        dialogue: [
          "Welcome to the Academy, Akira. Before we talk about qubits, look at how classical computers think.",
          "A computing model defines: 1. How information is represented, 2. How it is processed, and 3. How we obtain the result.",
          "Classical computers use rigid logic gates on bits. Quantum computers use unitary transformations on qubits. Ready to see the difference?"
        ]
      },
      {
        id: "akira_bottom",
        name: "Akira (Student)",
        role: "Student",
        avatar: "⚡",
        hotspot: { x: 40, y: 44, width: 22, height: 20 },
        dialogue: [
          "So a bit is strictly 0 or 1... but a qubit can hold both at once?",
          "I can't wait to see how a qubit actually looks in 3D!"
        ]
      }
    ]
  },
  {
    page: 2,
    image: "/assets/comics/page-02.jpg",
    chapter: "CHAPTER 01",
    title: "WHAT IS A QUBIT?",
    subtitle: "Superposition — Information in simultaneous states.",
    explore: {
      target: "qubit",
      label: "EXPLORE QUBIT & SUPERPOSITION",
      desc: "Interact with single-qubit probability amplitudes and measurement collapse."
    },
    characters: [
      {
        id: "sensei_q",
        name: "Sensei Q (Mentor)",
        role: "Mentor",
        avatar: "🔬",
        hotspot: { x: 68, y: 10, width: 25, height: 28 }, // Top right Sensei gesturing to qubit
        dialogue: [
          "A qubit is the fundamental unit of quantum information.",
          "Unlike a classical bit that is locked to 0 or 1, a qubit exists in a superposition: |ψ⟩ = α|0⟩ + β|1⟩.",
          "Here, α and β are complex probability amplitudes, where |α|² + |β|² = 1."
        ]
      },
      {
        id: "qubi",
        name: "Qubi (Quantum AI Mascot)",
        role: "Quantum Assistant",
        avatar: "🤖",
        hotspot: { x: 10, y: 60, width: 26, height: 22 }, // Qubi character panel
        dialogue: [
          "BEEP BOOP! Hi Akira, I'm Qubi!",
          "I can be in multiple states at once like a dancing wave!",
          "When you look at me or measure me, I instantly collapse into either 0 or 1. But until then, I'm pure potential!"
        ]
      },
      {
        id: "akira",
        name: "Akira (Student)",
        role: "Student",
        avatar: "⚡",
        hotspot: { x: 12, y: 78, width: 25, height: 18 },
        dialogue: [
          "This is amazing... A single qubit already has infinitely more possibilities than a classical switch.",
          "Let's explore how we represent these basis states!"
        ]
      }
    ]
  },
  {
    page: 3,
    image: "/assets/comics/page-03.jpg",
    chapter: "CHAPTER 01",
    title: "BASIS STATES: |0⟩ AND |1⟩",
    subtitle: "The North and South poles of the quantum world.",
    explore: {
      target: "qubit",
      label: "INSPECT BASIS POLES",
      desc: "Rotate between Ground State |0⟩ and Excited State |1⟩ on the Bloch sphere."
    },
    characters: [
      {
        id: "sensei_q",
        name: "Sensei Q (Mentor)",
        role: "Mentor",
        avatar: "🔬",
        hotspot: { x: 70, y: 12, width: 25, height: 24 },
        dialogue: [
          "Think of |0⟩ and |1⟩ as the North and South poles of the qubit's world.",
          "|0⟩ represents the ground state: [1, 0]ᵀ. Measuring it yields 0 with 100% certainty.",
          "|1⟩ represents the excited state: [0, 1]ᵀ. Measuring it yields 1 with 100% certainty.",
          "Every other quantum state lives somewhere on the surface between these two poles."
        ]
      },
      {
        id: "akira",
        name: "Akira (Student)",
        role: "Student",
        avatar: "⚡",
        hotspot: { x: 10, y: 60, width: 25, height: 20 },
        dialogue: [
          "So |0⟩ and |1⟩ are reference poles, like the equator and meridian on Earth!",
          "And any point on the sphere represents a valid quantum superposition state."
        ]
      }
    ]
  },
  {
    page: 4,
    image: "/assets/comics/page-04.jpg",
    chapter: "CHAPTER 01",
    title: "BASIS STATES IN PERSPECTIVE",
    subtitle: "Every complex quantum state is a mixture of simple basis vectors.",
    explore: {
      target: "qubit",
      label: "EXPLORE QUANTUM STATE MIXING",
      desc: "Tune probability amplitudes α and β to create custom superpositions."
    },
    characters: [
      {
        id: "sensei_q",
        name: "Sensei Q (Mentor)",
        role: "Mentor",
        avatar: "🔬",
        hotspot: { x: 68, y: 12, width: 25, height: 25 },
        dialogue: [
          "Every complex quantum algorithm is built from these simple basis states, Akira.",
          "By adjusting the linear combination |ψ⟩ = α|0⟩ + β|1⟩, we can encode information across multi-dimensional state spaces."
        ]
      },
      {
        id: "qubi",
        name: "Qubi",
        role: "Quantum AI",
        avatar: "🤖",
        hotspot: { x: 70, y: 60, width: 24, height: 22 },
        dialogue: [
          "Think of |0⟩ and |1⟩ like blue and gold paint on my palette!",
          "By mixing different percentages of each, I can paint infinite quantum colors!"
        ]
      }
    ]
  },
  {
    page: 5,
    image: "/assets/comics/page-05.jpg",
    chapter: "CHAPTER 01",
    title: "SUPERPOSITION: MORE THAN 0 OR 1",
    subtitle: "Coexisting in multiple possibilities simultaneously.",
    explore: {
      target: "superposition",
      label: "TRIGGER HADAMARD SUPERPOSITION",
      desc: "Apply the H gate to generate an equal 50/50 superposition wave."
    },
    characters: [
      {
        id: "sensei_q",
        name: "Sensei Q (Mentor)",
        role: "Mentor",
        avatar: "🔬",
        hotspot: { x: 70, y: 12, width: 25, height: 25 },
        dialogue: [
          "Look out at the city lights, Akira. Classical computers take one path at a time.",
          "A qubit in superposition explores all possible paths at the same time.",
          "If α = 1/√2 and β = 1/√2, the qubit is in an exact equal superposition: (|0⟩ + |1⟩)/√2."
        ]
      },
      {
        id: "akira",
        name: "Akira (Student)",
        role: "Student",
        avatar: "⚡",
        hotspot: { x: 10, y: 78, width: 26, height: 18 },
        dialogue: [
          "It's like a spinning coin in mid-air!",
          "While it's spinning, it isn't heads or tails — it's a dynamic combination of both until it lands!"
        ]
      }
    ]
  },
  {
    page: 6,
    image: "/assets/comics/page-06.jpg",
    chapter: "CHAPTER 01",
    title: "PROBABILITY AMPLITUDES & PHASES",
    subtitle: "How probability and complex angles dictate quantum interference.",
    explore: {
      target: "superposition",
      label: "EXPERIMENT WITH PHASES",
      desc: "Observe how phase angles θ and φ create constructive and destructive interference."
    },
    characters: [
      {
        id: "sensei_q",
        name: "Sensei Q (Mentor)",
        role: "Mentor",
        avatar: "🔬",
        hotspot: { x: 68, y: 12, width: 25, height: 25 },
        dialogue: [
          "Probability amplitudes are complex numbers: α = |α|e^{iθ}.",
          "The squared magnitude |α|² gives the measurement probability.",
          "The phase angle e^{iθ} determines how quantum states interfere with one another — canceling wrong answers and amplifying correct ones!"
        ]
      },
      {
        id: "akira",
        name: "Akira",
        role: "Student",
        avatar: "⚡",
        hotspot: { x: 10, y: 78, width: 26, height: 18 },
        dialogue: [
          "So quantum computing isn't just about probabilities — it's about wave interference!",
          "That's how quantum algorithms solve problems so much faster."
        ]
      }
    ]
  },
  {
    page: 7,
    image: "/assets/comics/page-07.jpg",
    chapter: "CHAPTER 01",
    title: "THE BLOCH SPHERE — VISUALIZING A QUBIT",
    subtitle: "A geometric sphere representing all pure single-qubit quantum states.",
    explore: {
      target: "qubit",
      label: "OPEN 3D BLOCH SPHERE LAB",
      desc: "Freely rotate, inspect, and manipulate the state vector on the 3D Bloch sphere."
    },
    characters: [
      {
        id: "sensei_q",
        name: "Sensei Q (Mentor)",
        role: "Mentor",
        avatar: "🔬",
        hotspot: { x: 68, y: 12, width: 26, height: 26 },
        dialogue: [
          "Behold the Bloch Sphere, Akira! It is the compass of quantum physics.",
          "Every single point on this sphere corresponds to a unique quantum state parameterized by polar angle θ and azimuth φ.",
          "When we apply quantum gates, we are performing 3D rotations on this sphere."
        ]
      },
      {
        id: "akira",
        name: "Akira",
        role: "Student",
        avatar: "⚡",
        hotspot: { x: 10, y: 60, width: 25, height: 20 },
        dialogue: [
          "By just changing the angles θ and φ, I can represent any quantum state!",
          "It's so intuitive. Let's see how we rotate the state vector with quantum gates!"
        ]
      }
    ]
  },
  {
    page: 8,
    image: "/assets/comics/page-08.jpg",
    chapter: "CHAPTER 01",
    title: "QUANTUM GATES: ROTATING REALITY",
    subtitle: "Unitary operations: Hadamard (H), Pauli-X, Pauli-Z, Phase (S), and CNOT.",
    explore: {
      target: "circuits",
      label: "BUILD QUANTUM CIRCUITS",
      desc: "Place gates onto quantum wires and observe real-time state vector rotations."
    },
    characters: [
      {
        id: "sensei_q",
        name: "Sensei Q",
        role: "Mentor",
        avatar: "🔬",
        hotspot: { x: 68, y: 12, width: 26, height: 26 },
        dialogue: [
          "Quantum logic gates are the tools we use to manipulate qubits.",
          "Hadamard (H) creates superposition. Pauli-X flips |0⟩ to |1⟩ like a classical NOT. Pauli-Z flips the phase.",
          "And CNOT allows two qubits to interact and become entangled!"
        ]
      },
      {
        id: "akira",
        name: "Akira",
        role: "Student",
        avatar: "⚡",
        hotspot: { x: 10, y: 78, width: 25, height: 18 },
        dialogue: [
          "These simple gates are the building blocks of teleportation, cryptography, and quantum supercomputers!",
          "Let's put them on a circuit wire and run a live experiment."
        ]
      }
    ]
  },
  {
    page: 9,
    image: "/assets/comics/page-09.jpg",
    chapter: "CHAPTER 01",
    title: "MEASURING A QUBIT: THE COLLAPSE",
    subtitle: "When the quantum wavefunction collapses into classical reality.",
    explore: {
      target: "superposition",
      label: "EXECUTE MEASUREMENT COLLAPSE",
      desc: "Witness the dramatic probabilistic collapse of a quantum state in real time."
    },
    characters: [
      {
        id: "sensei_q",
        name: "Sensei Q",
        role: "Mentor",
        avatar: "🔬",
        hotspot: { x: 68, y: 12, width: 26, height: 26 },
        dialogue: [
          "This is one of nature's deepest secrets, Akira.",
          "Before measurement, the qubit exists as a superposition wave of possibilities.",
          "The moment a measurement device observes the qubit, the wavefunction collapses irreversibly into either 0 or 1 with probability |α|² or |β|²."
        ]
      },
      {
        id: "akira",
        name: "Akira",
        role: "Student",
        avatar: "⚡",
        hotspot: { x: 10, y: 64, width: 25, height: 20 },
        dialogue: [
          "If I measure 1000 identical qubits, approximately 500 will collapse to 0 and 500 to 1!",
          "The power comes from manipulating the state before measurement occurs."
        ]
      }
    ]
  },
  {
    page: 10,
    image: "/assets/comics/page-10.jpg",
    chapter: "CHAPTER 01",
    title: "WHY QUBITS MATTER: THE FUTURE",
    subtitle: "Exponential state space 2ⁿ, parallel computation, and quantum algorithms.",
    explore: {
      target: "algorithms",
      label: "EXPLORE QUANTUM ALGORITHMS",
      desc: "Step through Grover's Search and Quantum Teleportation protocols."
    },
    characters: [
      {
        id: "sensei_q",
        name: "Sensei Q",
        role: "Mentor",
        avatar: "🔬",
        hotspot: { x: 68, y: 12, width: 26, height: 26 },
        dialogue: [
          "With n qubits, a quantum computer can represent 2ⁿ states simultaneously!",
          "300 qubits can hold more numbers at once than there are atoms in the observable universe.",
          "This unlocks revolutionary breakthroughs in medicine, clean energy materials, and cybersecurity."
        ]
      },
      {
        id: "akira",
        name: "Akira",
        role: "Student",
        avatar: "⚡",
        hotspot: { x: 10, y: 78, width: 26, height: 18 },
        dialogue: [
          "Qubits don't just compute faster — they help us solve problems that were impossible for classical machines!",
          "I'm ready for the next level of training."
        ]
      }
    ]
  },
  {
    page: 11,
    image: "/assets/comics/page-11.jpg",
    chapter: "CHAPTER 01 — FINALE & CLIFFHANGER",
    title: "THE IMPOSSIBLE QUBIT (Q-001)",
    subtitle: "SYSTEM ERROR: An anomalous quantum state awakens in Sector 7.",
    explore: {
      target: "bug",
      label: "DEBUG QUANTUM SYSTEM ERROR",
      desc: "Diagnose the corrupted quantum core and restore Bell state entanglement!"
    },
    characters: [
      {
        id: "sensei_q_warning",
        name: "Sensei Q (Alert)",
        role: "Mentor",
        avatar: "⚠️",
        hotspot: { x: 68, y: 35, width: 26, height: 22 },
        dialogue: [
          "Wait... look at the laboratory telemetry, Akira! The dilution refrigerator readings are fluctuating!",
          "We measured the qubit, but its state vector is oscillating autonomously!",
          "This doesn't match our simulation... Subject Q-001 has awakened in the core!"
        ]
      },
      {
        id: "akira_alert",
        name: "Akira (Alert)",
        role: "Student",
        avatar: "⚡",
        hotspot: { x: 10, y: 60, width: 26, height: 20 },
        dialogue: [
          "Sensei! The quantum core is reporting inconsistent measurement logs!",
          "The state vector is corrupted! We need to inspect the circuit and fix the broken logic gate immediately!"
        ]
      }
    ]
  }
];
