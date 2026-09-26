export const STORY_CHAPTERS = [
  {
    id: "ch-01",
    chapterNumber: "CHAPTER 01",
    title: "THE FIRST QUBIT",
    subtitle: "Beneath the surface of silicon and classical certainty.",
    panels: [
      {
        id: "panel-01",
        type: "comic-image",
        src: "/assets/comics/chapter1-panel1.jpg",
        year: "2042",
        location: "SOMEWHERE BENEATH THE CITY",
        facility: "QUANTUM RESEARCH FACILITY — SECTOR 7",
        dialogue: "After ten years... it's finally ready.",
        caption: "The cryogenic dilution refrigerator hums at 15 millikelvin. Colder than deep interstellar space. Here, classical certainty surrenders to quantum probability.",
        metrics: { status: "STANDBY", temp: "15 mK", power: "100%", qubits: "0" },
        exploreTarget: "qubit",
        exploreLabel: "INSPECT QUANTUM CORE"
      },
      {
        id: "panel-02",
        type: "comic-image",
        src: "/assets/comics/chapter1-panel2.jpg",
        label: "PAGE 03 — PANEL 03 — EL BIT",
        dialogue: "Millones de pequeñas decisiones. Zeros y ones. 01001001 01000001",
        caption: "\"This is how our computers think.\" For nearly a century, every calculation, photograph, and thought inside our machines has been reduced to rigid binary switches.",
        quote: "A classical switch is either OFF (0) or ON (1). Deterministic. Rigid. Isolated.",
        exploreTarget: "bit",
        exploreLabel: "EXPERIENCE THE CLASSICAL SWITCH"
      },
      {
        id: "panel-03",
        type: "narrative-visual",
        tag: "SCIENTIFIC BREAKTHROUGH",
        title: "THE DUAL NATURE OF REALITY",
        caption: "When we peer into single atoms, matter refuses to pick a single binary fate. An electron spin exists in a simultaneous superposition of both states.",
        mathNote: "|ψ⟩ = α|0⟩ + β|1⟩",
        dialogue: "We are no longer flipping switches. We are shaping probability waves.",
        exploreTarget: "superposition",
        exploreLabel: "TRIGGER SUPERPOSITION"
      }
    ]
  },
  {
    id: "ch-02",
    chapterNumber: "CHAPTER 02",
    title: "THE CONNECTION",
    subtitle: "Entanglement — Nature's non-local architecture.",
    metadata: "ENTANGLEMENT — QUANTUM STATES",
    panels: [
      {
        id: "panel-04",
        type: "narrative-visual",
        tag: "BELL STATE CREATION",
        title: "BEYOND SEPARATION",
        caption: "When two qubits interact through a Hadamard and CNOT gate, their individual existence vanishes. They fuse into a single unified wavefunction. Measure one, and the other instantaneously materializes its correlated state.",
        mathNote: "|Φ⁺⟩ = (|00⟩ + |11⟩) / √2",
        dialogue: "Einstein called it 'spooky action at a distance'. We call it the engine of the quantum future.",
        exploreTarget: "entanglement",
        exploreLabel: "ENTER ENTANGLEMENT LAB"
      }
    ]
  }
];
