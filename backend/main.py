import os, ast, json
from typing import List, Optional, Dict, Any

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

app = FastAPI(title="The Quantum World Backend", version="3.0.0")
allowed_origins = [x.strip() for x in os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173"
).split(",") if x.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Cache-Control"] = (
        "no-store" if request.url.path.startswith(("/ai/", "/debug/", "/simulate"))
        else response.headers.get("Cache-Control", "no-cache")
    )
    return response

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
_client = None

def gemini():
    global _client
    if _client is None and os.getenv("GEMINI_API_KEY"):
        _client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    return _client

def ai_json(prompt: str) -> Dict[str, Any]:
    c = gemini()
    if not c:
        return {"available": False, "error": "GEMINI_API_KEY is not configured."}
    try:
        r = c.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt + "\nReturn ONLY valid JSON. No markdown fences.",
            config={"response_mime_type": "application/json"},
        )
        return json.loads(r.text)
    except Exception:
        return {"available": False, "error": "The AI service is temporarily unavailable. Please try again."}

class GateInstruction(BaseModel):
    gate: str = Field(min_length=1, max_length=10)
    target: int = Field(ge=0, le=31)
    control: Optional[int] = Field(default=None, ge=0, le=31)

class CircuitRequest(BaseModel):
    num_qubits: int = Field(ge=1, le=16)
    instructions: List[GateInstruction] = Field(max_length=128)
    shots: Optional[int] = Field(default=1024, ge=1, le=10000)

class MultiSimRequest(CircuitRequest):
    backend: str = Field(default="qiskit-aer", max_length=40)

class AIRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    lesson: str = Field(default="", max_length=200)
    code: str = Field(default="", max_length=12000)
    bug: str = Field(default="", max_length=4000)
    level: int = Field(default=1, ge=1, le=100)
    history: List[Dict[str, str]] = Field(default_factory=list)

class StoryRequest(BaseModel):
    universe: str = Field(min_length=1, max_length=500)
    concept: str = Field(min_length=1, max_length=300)
    level: int = Field(default=1, ge=1, le=100)

class DebugRequest(BaseModel):
    code: str = Field(min_length=1, max_length=16000)
    language: str = Field(default="python", max_length=30)
    lesson: str = Field(default="Quantum computing", max_length=200)
    level: int = Field(default=1, ge=1, le=100)
    mode: str = Field(default="solve", max_length=20)
    previous_code: str = Field(default="", max_length=16000)
    previous_bug: Dict[str, Any] = Field(default_factory=dict)

def python_check(code: str) -> Dict[str, Any]:
    try:
        ast.parse(code)
        return {"syntax_ok": True, "error": None, "line": None}
    except SyntaxError as e:
        return {"syntax_ok": False, "error": e.msg, "line": e.lineno}

def _validate_instructions(req: CircuitRequest):
    for inst in req.instructions:
        gate = inst.gate.upper()
        if gate not in {"H", "X", "Y", "Z", "S", "T", "CNOT", "CX"}:
            raise ValueError(f"Unsupported gate: {gate}")
        if inst.target >= req.num_qubits:
            raise ValueError("Target qubit is outside the circuit.")
        if gate in {"CNOT", "CX"}:
            if inst.control is None or inst.control >= req.num_qubits or inst.control == inst.target:
                raise ValueError("CNOT requires a different valid control qubit.")

def _counts_from_probs(probs, shots):
    import numpy as np
    rng = np.random.default_rng()
    samples = rng.multinomial(shots, np.asarray(probs, dtype=float) / np.sum(probs))
    return {format(i, f"0{int(np.log2(len(probs)))}b"): int(v) for i, v in enumerate(samples) if v}

def _qiskit(req):
    from qiskit import QuantumCircuit
    from qiskit.quantum_info import Statevector
    from qiskit_aer import AerSimulator
    qc = QuantumCircuit(req.num_qubits)
    for inst in req.instructions:
        g = inst.gate.upper()
        if g == "H": qc.h(inst.target)
        elif g == "X": qc.x(inst.target)
        elif g == "Y": qc.y(inst.target)
        elif g == "Z": qc.z(inst.target)
        elif g == "S": qc.s(inst.target)
        elif g == "T": qc.t(inst.target)
        elif g in {"CNOT", "CX"}: qc.cx(inst.control, inst.target)
    state = Statevector.from_instruction(qc)
    probs = [float(abs(x) ** 2) for x in state.data]
    measured = qc.copy()
    measured.measure_all()
    result = AerSimulator().run(measured, shots=req.shots).result()
    counts = {str(k): int(v) for k, v in result.get_counts().items()}
    state_json = [{"real": float(x.real), "imag": float(x.imag)} for x in state.data]
    return probs, counts, state_json, "Qiskit Aer Simulator"

def _pennylane(req):
    import pennylane as qml
    dev = qml.device("default.qubit", wires=req.num_qubits, shots=None)
    @qml.qnode(dev)
    def circuit():
        for inst in req.instructions:
            g = inst.gate.upper()
            if g == "H": qml.Hadamard(wires=inst.target)
            elif g == "X": qml.PauliX(wires=inst.target)
            elif g == "Y": qml.PauliY(wires=inst.target)
            elif g == "Z": qml.PauliZ(wires=inst.target)
            elif g == "S": qml.S(wires=inst.target)
            elif g == "T": qml.T(wires=inst.target)
            elif g in {"CNOT", "CX"}: qml.CNOT(wires=[inst.control, inst.target])
        return qml.probs(wires=range(req.num_qubits))
    probs = [float(x) for x in circuit()]
    return probs, _counts_from_probs(probs, req.shots), None, "PennyLane default.qubit"

def _cirq(req):
    import cirq
    import numpy as np
    qubits = cirq.LineQubit.range(req.num_qubits)
    circuit = cirq.Circuit()
    for inst in req.instructions:
        g = inst.gate.upper()
        q = qubits[inst.target]
        if g == "H": circuit.append(cirq.H(q))
        elif g == "X": circuit.append(cirq.X(q))
        elif g == "Y": circuit.append(cirq.Y(q))
        elif g == "Z": circuit.append(cirq.Z(q))
        elif g == "S": circuit.append(cirq.S(q))
        elif g == "T": circuit.append(cirq.T(q))
        elif g in {"CNOT", "CX"}: circuit.append(cirq.CNOT(qubits[inst.control], q))
    sim = cirq.Simulator()
    state = sim.simulate(circuit).final_state_vector
    probs = [float(abs(x) ** 2) for x in state]
    measured = circuit.copy()
    measured.append(cirq.measure(*qubits, key="result"))
    result = sim.run(measured, repetitions=req.shots)
    hist = result.histogram(key="result")
    width = req.num_qubits
    counts = {format(int(k), f"0{width}b"): int(v) for k, v in hist.items()}
    return probs, counts, None, "Cirq Simulator"

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "system": "The Quantum World Engine",
        "ai_configured": bool(os.getenv("GEMINI_API_KEY")),
        "model": GEMINI_MODEL,
    }

@app.get("/health/ready")
def readiness_check():
    return {"status": "ready", "ai_configured": bool(os.getenv("GEMINI_API_KEY"))}

@app.get("/backends")
def list_backends():
    return {
        "backends": [
            {"id": "qiskit-aer", "name": "Qiskit Aer", "type": "local", "available": True},
            {"id": "pennylane", "name": "PennyLane default.qubit", "type": "local", "available": _optional_import("pennylane")},
            {"id": "cirq", "name": "Cirq Simulator", "type": "local", "available": _optional_import("cirq")},
            {"id": "qbraid", "name": "qBraid Gateway", "type": "cloud", "available": bool(os.getenv("QBRAID_API_KEY")), "configured": bool(os.getenv("QBRAID_API_KEY"))},
        ]
    }

def _optional_import(name):
    try:
        __import__(name)
        return True
    except Exception:
        return False

@app.post("/simulate")
def simulate_circuit(req: CircuitRequest):
    return simulate_multi(MultiSimRequest(**req.model_dump(), backend="qiskit-aer"))

@app.post("/simulate/multi")
def simulate_multi(req: MultiSimRequest):
    try:
        _validate_instructions(req)
        runners = {
            "qiskit-aer": _qiskit,
            "pennylane": _pennylane,
            "cirq": _cirq,
        }
        if req.backend == "qbraid":
            return {
                "status": "unconfigured",
                "backend": "qBraid Gateway",
                "message": "Configure QBRAID_API_KEY to connect this project to qBraid cloud jobs.",
            }
        runner = runners.get(req.backend)
        if not runner:
            raise ValueError("Unknown backend.")
        probs, counts, state, label = runner(req)
        return {
            "status": "success",
            "backend": label,
            "counts": counts,
            "probabilities": probs,
            "statevector": state,
            "shots": req.shots,
        }
    except Exception as e:
        return {"status": "error", "backend": req.backend, "message": str(e)}

@app.post("/ai/ask")
def ask_ai(req: AIRequest):
    prompt = f"""You are Q-Bot, a contextual quantum-computing tutor.
Student level: {req.level}. Current lesson: {req.lesson}. Current bug: {req.bug}.
Current code: {req.code}
Student question: {req.message}
Give a concise, accurate teaching response. Do not invent compiler results. Prefer hints before full answers.
JSON keys: answer, hint, concept, next_step."""
    return ai_json(prompt)

@app.post("/ai/story")
def story_ai(req: StoryRequest):
    prompt = f"""Teach the quantum concept "{req.concept}" to a level {req.level} student using ANY fictional universe, game, sport, book, character, real-world analogy, or combination they entered: "{req.universe}".
The analogy must explain the concept, then state where the analogy breaks so the student does not confuse fiction with physics.
JSON keys: title, explanation, analogy, where_it_breaks, example, challenge."""
    return ai_json(prompt)

@app.post("/debug/analyze")
def debug_analyze(req: DebugRequest):
    local = python_check(req.code) if req.language.lower() == "python" else {"syntax_ok": None, "error": None, "line": None}
    previous = json.dumps(req.previous_bug, ensure_ascii=False)
    prompt = f"""You are the Bug Arena judge for a quantum-learning platform.
Student level: {req.level}. Lesson: {req.lesson}. Mode: {req.mode}.
Student code:
{req.code}
Previous code:
{req.previous_code}
Previous bug metadata:
{previous}
Local syntax result:
{json.dumps(local)}
Judge the educational bug, not just syntax. A meaningful bug should create an observable or conceptual failure related to the lesson, not merely a typo.
For solve mode: decide whether the submitted code fixes the previous bug.
For create mode: decide whether the new bug is reproducible/meaningful and genuinely harder than the previous bug.
Never claim execution was performed when it was not.
Return JSON keys:
has_error, fixed_previous_bug, meaningful_bug, is_harder_than_previous, difficulty_score, severity, error_summary, error_lines, concept, safe_hint, suggested_fix, tests_to_check, verdict, reason.
difficulty_score and severity are integers 0-100."""
    out = ai_json(prompt)
    out["local_check"] = local
    return out

@app.post("/debug/validate-bug")
def validate_bug(req: DebugRequest):
    req.mode = "create"
    return debug_analyze(req)


class CodeRequest(BaseModel):
    qubits: int = Field(ge=1, le=16)
    gates: List[GateInstruction] = Field(max_length=128)
    framework: str = Field(default="Qiskit", max_length=30)

@app.post("/ai/code")
def generate_code(req: CodeRequest):
    gate_text = json.dumps([g.model_dump() for g in req.gates])
    prompt = f"Generate beginner-friendly {req.framework} code for a {req.qubits}-qubit quantum circuit. Gates: {gate_text}. Include circuit construction, measurement, and a short comment explaining the key idea. Return JSON keys: code, explanation."
    return ai_json(prompt)


class LearningEvent(BaseModel):
    learner_id: str = Field(min_length=1, max_length=120)
    event: str = Field(min_length=1, max_length=80)
    module: str = Field(default="", max_length=120)
    score: Optional[float] = Field(default=None, ge=0, le=100)
    metadata: str = Field(default="", max_length=2000)

@app.post("/analytics/event")
def analytics_event(req: LearningEvent):
    from backend.analytics import record_event
    record_event(req.learner_id, req.event, req.module, req.score, req.metadata)
    return {"status": "recorded"}

@app.get("/instructor/summary")
def instructor_summary():
    from backend.analytics import summary
    return summary()



class CodeSimRequest(BaseModel):
    code: str = Field(min_length=1, max_length=16000)
    backend: str = Field(default="qiskit-aer", max_length=40)

def parse_circuit_code(code: str):
    import re
    n_match = re.search(r"QuantumCircuit\((\d+)", code)
    if not n_match:
        n_match = re.search(r"wires\s*=\s*(\d+)", code)
    if not n_match:
        n_match = re.search(r"LineQubit\.range\((\d+)", code)
    n = int(n_match.group(1)) if n_match else 1
    gates = []
    for line in code.splitlines():
        low = line.lower()
        nums = [int(x) for x in re.findall(r"\d+", line)]
        if not nums:
            continue
        for name in ["h", "x", "y", "z", "s", "t"]:
            if "." + name in low:
                gates.append({"gate": name.upper(), "target": nums[0]})
                break
        if ".cx" in low or ".cnot" in low:
            if len(nums) >= 2:
                gates.append({"gate": "CNOT", "control": nums[0], "target": nums[1]})
        elif "cnot(" in low and len(nums) >= 2:
            gates.append({"gate": "CNOT", "control": nums[0], "target": nums[1]})
    if not gates:
        raise ValueError("No supported gates found. Try H, X, Y, Z, S, T or CNOT/CX syntax.")
    return CircuitRequest(num_qubits=n, instructions=[GateInstruction(**g) for g in gates], shots=1024)

@app.post("/simulate/code")
def simulate_code(req: CodeSimRequest):
    try:
        circuit = parse_circuit_code(req.code)
        result = simulate_multi(MultiSimRequest(**circuit.model_dump(), backend=req.backend))
        result["parsed_circuit"] = circuit.model_dump()
        return result
    except Exception as e:
        return {"status": "error", "message": str(e), "backend": req.backend}



class RecommendationRequest(BaseModel):
    level: int = Field(ge=1, le=100)
    xp: int = Field(ge=0, le=1000000)
    unlocked: int = Field(ge=0, le=100)

class MCQRequest(BaseModel):
    lesson: str = Field(min_length=1, max_length=200)
    level: int = Field(default=1, ge=1, le=100)
    recent_questions: List[str] = Field(default_factory=list, max_length=8)
    nonce: str = Field(default="", max_length=100)

@app.post("/ai/mcq")
def generate_mcq(req: MCQRequest):
    recent = "\n".join(f"- {q}" for q in req.recent_questions[-8:]) or "- none"
    prompt = f"""You are the assessment engine for Quantum//World.
Create ONE fresh multiple-choice question for a learner who is currently studying exactly this lesson: "{req.lesson}".
Learner level: {req.level}.
Generation nonce: {req.nonce}.
Previously generated question texts to avoid repeating:
{recent}

Rules:
- The question must test the current lesson, not an unrelated quantum topic.
- Use only concepts a learner at this stage could reasonably know.
- Create exactly 4 plausible options.
- Exactly one option is correct.
- Set correct_index to 0, 1, 2, or 3.
- Give a short explanation that teaches why the correct answer is right.
- Do not copy or lightly paraphrase any previous question.
- Do not mention the generation process, Gemini, or the nonce.
- Return JSON only with keys: question, options, correct_index, explanation.
"""
    out = ai_json(prompt)
    if not out.get("available", True):
        return out
    options = out.get("options")
    try:
        correct_index = int(out.get("correct_index"))
    except (TypeError, ValueError):
        correct_index = -1
    if (
        not isinstance(out.get("question"), str)
        or len(out["question"].strip()) < 10
        or not isinstance(options, list)
        or len(options) != 4
        or not all(isinstance(x, str) and x.strip() for x in options)
        or correct_index not in range(4)
        or not isinstance(out.get("explanation"), str)
    ):
        return {"available": False, "error": "The AI returned an invalid question. Please generate another one."}
    return {
        "question": out["question"].strip(),
        "options": [x.strip() for x in options],
        "correct_index": correct_index,
        "explanation": out["explanation"].strip(),
    }

@app.post("/ai/recommend")
def recommend(req: RecommendationRequest):
    prompt = f"Recommend the next quantum-learning mission for a student at level {req.level}, with {req.xp} XP and {req.unlocked} unlocked modules. Prefer a concrete next step among fundamentals, Quantum Studio, entanglement, algorithms, Bug Arena, or assessment. Return JSON keys: title, reason."
    return ai_json(prompt)
