export const CONCEPTS = {
  bit: {
    id: "bit",
    title: "CLASSICAL BIT",
    shortDesc: "The binary foundation of classical computing.",
    principle: "A bit stores either 0 or 1. At all times, the state is strictly deterministic.",
    equation: "b ∈ {0, 1}"
  },
  qubit: {
    id: "qubit",
    title: "THE FIRST QUBIT",
    shortDesc: "A two-level quantum system visualized on the Bloch Sphere.",
    principle: "A qubit lives in a 2D complex Hilbert space, spanning all points on the spherical surface.",
    equation: "|ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩"
  },
  superposition: {
    id: "superposition",
    title: "SUPERPOSITION",
    shortDesc: "Coexistence of orthogonal basis states before measurement.",
    principle: "The Hadamard (H) gate transforms |0⟩ into an equal linear combination of |0⟩ and |1⟩.",
    equation: "H|0⟩ = (|0⟩ + |1⟩)/√2"
  },
  circuits: {
    id: "circuits",
    title: "QUANTUM CIRCUITS",
    shortDesc: "Unitary transformations preserving total probability.",
    principle: "Quantum logic gates rotate the statevector reversibly without information loss.",
    gates: ["X", "Y", "Z", "H", "S", "T", "CNOT"]
  },
  entanglement: {
    id: "entanglement",
    title: "ENTANGLEMENT",
    shortDesc: "Non-separable quantum state correlations.",
    principle: "Entangled pairs exhibit instantaneous correlation upon measurement across any distance.",
    equation: "|Φ⁺⟩ = (|00⟩ + |11⟩)/√2"
  }
};
