export class Complex {
  constructor(r = 0, i = 0) {
    this.r = Number(r);
    this.i = Number(i);
  }
  add(c) { return new Complex(this.r + c.r, this.i + c.i); }
  sub(c) { return new Complex(this.r - c.r, this.i - c.i); }
  mul(c) {
    if (typeof c === 'number') return new Complex(this.r * c, this.i * c);
    return new Complex(this.r * c.r - this.i * c.i, this.r * c.i + this.i * c.r);
  }
  div(scalar) { return new Complex(this.r / scalar, this.i / scalar); }
  abs() { return Math.sqrt(this.r * this.r + this.i * this.i); }
  prob() { return this.r * this.r + this.i * this.i; }
  phase() { return Math.atan2(this.i, this.r); }
  format(precision = 2) {
    const rStr = Math.abs(this.r) < 1e-4 ? '0' : this.r.toFixed(precision);
    const iStr = Math.abs(this.i) < 1e-4 ? '' : (this.i >= 0 ? '+' + this.i.toFixed(precision) + 'i' : this.i.toFixed(precision) + 'i');
    if (iStr === '') return rStr;
    if (rStr === '0') return this.i.toFixed(precision) + 'i';
    return rStr + ' ' + iStr;
  }
}

const INV_SQRT2 = 1 / Math.SQRT2;

export const GATES = {
  I: [[new Complex(1, 0), new Complex(0, 0)], [new Complex(0, 0), new Complex(1, 0)]],
  X: [[new Complex(0, 0), new Complex(1, 0)], [new Complex(1, 0), new Complex(0, 0)]],
  Y: [[new Complex(0, 0), new Complex(0, -1)], [new Complex(0, 1), new Complex(0, 0)]],
  Z: [[new Complex(1, 0), new Complex(0, 0)], [new Complex(0, 0), new Complex(-1, 0)]],
  H: [[new Complex(INV_SQRT2, 0), new Complex(INV_SQRT2, 0)], [new Complex(INV_SQRT2, 0), new Complex(-INV_SQRT2, 0)]],
  S: [[new Complex(1, 0), new Complex(0, 0)], [new Complex(0, 0), new Complex(0, 1)]],
  T: [[new Complex(1, 0), new Complex(0, 0)], [new Complex(0, 0), new Complex(INV_SQRT2, INV_SQRT2)]]
};

export class QuantumCircuit {
  constructor(numQubits = 1) {
    this.numQubits = numQubits;
    this.dim = 1 << numQubits;
    this.reset();
  }

  reset() {
    this.state = Array.from({ length: this.dim }, (_, i) => i === 0 ? new Complex(1, 0) : new Complex(0, 0));
    this.history = [];
    return this;
  }

  applyGate(gateName, targetQubit) {
    const gateMatrix = typeof gateName === 'string' ? GATES[gateName] : gateName;
    if (!gateMatrix) throw new Error('Unknown gate: ' + gateName);

    const newState = Array.from({ length: this.dim }, () => new Complex(0, 0));
    const bitMask = 1 << (this.numQubits - 1 - targetQubit);

    for (let i = 0; i < this.dim; i++) {
      if ((i & bitMask) === 0) {
        const i0 = i;
        const i1 = i | bitMask;
        
        const v0 = this.state[i0];
        const v1 = this.state[i1];

        const out0 = gateMatrix[0][0].mul(v0).add(gateMatrix[0][1].mul(v1));
        const out1 = gateMatrix[1][0].mul(v0).add(gateMatrix[1][1].mul(v1));

        newState[i0] = out0;
        newState[i1] = out1;
      }
    }

    this.state = newState;
    this.history.push({ type: 'single', gate: typeof gateName === 'string' ? gateName : 'CUSTOM', target: targetQubit });
    return this;
  }

  applyCNOT(controlQubit, targetQubit) {
    if (controlQubit === targetQubit) return this;
    const ctrlMask = 1 << (this.numQubits - 1 - controlQubit);
    const tgtMask = 1 << (this.numQubits - 1 - targetQubit);

    const newState = [...this.state];

    for (let i = 0; i < this.dim; i++) {
      if ((i & ctrlMask) !== 0 && (i & tgtMask) === 0) {
        const i0 = i;
        const i1 = i | tgtMask;
        const tmp = newState[i0];
        newState[i0] = newState[i1];
        newState[i1] = tmp;
      }
    }

    this.state = newState;
    this.history.push({ type: 'cnot', control: controlQubit, target: targetQubit });
    return this;
  }

  getProbabilities() {
    return this.state.map((amp, idx) => ({
      index: idx,
      binary: idx.toString(2).padStart(this.numQubits, '0'),
      prob: amp.prob(),
      amplitude: amp,
    }));
  }

  measure() {
    const probs = this.getProbabilities();
    const rand = Math.random();
    let cumulative = 0;
    let measuredIndex = 0;

    for (let i = 0; i < probs.length; i++) {
      cumulative += probs[i].prob;
      if (rand <= cumulative) {
        measuredIndex = i;
        break;
      }
    }

    this.state = Array.from({ length: this.dim }, (_, i) => i === measuredIndex ? new Complex(1, 0) : new Complex(0, 0));

    return {
      index: measuredIndex,
      binary: measuredIndex.toString(2).padStart(this.numQubits, '0'),
      prob: probs[measuredIndex].prob,
    };
  }

  getBlochCoordinates() {
    if (this.numQubits !== 1) return { theta: 0, phi: 0, x: 0, y: 0, z: 1, alpha: new Complex(1,0), beta: new Complex(0,0) };
    const alpha = this.state[0];
    const beta = this.state[1];

    const aMag = alpha.abs();
    const theta = 2 * Math.acos(Math.min(1, Math.max(0, aMag)));
    const phi = beta.phase() - alpha.phase();

    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);

    return { theta, phi, x, y, z, alpha, beta };
  }
}

export function runCircuit(numQubits, instructions) {
  const qc = new QuantumCircuit(numQubits);
  for (const inst of instructions) {
    if (inst.gate === 'CNOT' || inst.gate === 'CX') {
      qc.applyCNOT(inst.control, inst.target);
    } else {
      qc.applyGate(inst.gate, inst.target);
    }
  }
  return qc;
}
