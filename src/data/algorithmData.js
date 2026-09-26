export const ALGORITHMS = [
  {
    id: "grover",
    title: "GROVER'S SEARCH ALGORITHM",
    speedup: "Quadratic Speedup: O(√N) vs Classical O(N)",
    category: "Amplitude Amplification",
    description: "Searches an unsorted database of N items in √N steps by inverting the target phase and reflecting amplitudes about the mean.",
    steps: [
      { id: 1, name: "1. UNIFORM SUPERPOSITION", detail: "Apply Hadamard gates to all qubits. All 4 items have an equal 25% probability.", state: [0.5, 0.5, 0.5, 0.5] },
      { id: 2, name: "2. ORACLE PHASE FLIP", detail: "The Oracle marks target |11⟩ by flipping its phase negative (-1).", state: [0.5, 0.5, 0.5, -0.5] },
      { id: 3, name: "3. AMPLITUDE AMPLIFICATION", detail: "Grover diffusion reflects amplitudes about the mean, boosting target amplitude to 1.0 (100%).", state: [0.0, 0.0, 0.0, 1.0] },
      { id: 4, name: "4. MEASUREMENT", detail: "Single quantum measurement reveals target state |11⟩ with 100% certainty!", state: [0.0, 0.0, 0.0, 1.0] }
    ]
  },
  {
    id: "teleportation",
    title: "QUANTUM TELEPORTATION",
    speedup: "Disembodied State Transfer",
    category: "Quantum Information Protocol",
    description: "Transfers an unknown quantum state |ψ⟩ from Alice to Bob using a shared Bell pair and 2 classical bits.",
    steps: [
      { id: 1, name: "1. SHARED BELL PAIR", detail: "Alice and Bob share an entangled Bell pair (|00⟩ + |11⟩)/√2." },
      { id: 2, name: "2. BELL-BASIS MEASUREMENT", detail: "Alice entangles |ψ⟩ with her qubit and measures both in the Bell basis." },
      { id: 3, name: "3. CLASSICAL TRANSMISSION", detail: "Alice sends 2 classical bits (00, 01, 10, or 11) to Bob." },
      { id: 4, name: "4. UNITARY RECONSTRUCTION", detail: "Bob applies Pauli corrections (I, X, Z, or XZ). His qubit is now |ψ⟩!" }
    ]
  }
];
