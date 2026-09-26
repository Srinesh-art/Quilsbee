import React, { useState } from "react"
import { Check, ChevronRight, LoaderCircle, RotateCcw, SkipForward, Sparkles, X } from "lucide-react"

const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "")
const POINTS = 25

export default function MCQSession({ lesson, level, onEarn }) {
  const [question, setQuestion] = useState(null)
  const [selected, setSelected] = useState(null)
  const [status, setStatus] = useState("idle")
  const [message, setMessage] = useState("")
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem("quantum_mcq_recent") || "[]") } catch { return [] }
  })

  const generate = async () => {
    setStatus("loading")
    setQuestion(null)
    setSelected(null)
    setMessage("")
    try {
      const nonce = String(Date.now()) + "-" + Math.random().toString(36).slice(2)
      const response = await fetch(API + "/ai/mcq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson, level, recent_questions: recent.slice(-8), nonce })
      })
      const data = await response.json()
      if (!response.ok || !data.question) throw new Error(data.error || "Could not generate the question.")
      setQuestion(data)
      const nextRecent = [...recent, data.question].slice(-8)
      setRecent(nextRecent)
      localStorage.setItem("quantum_mcq_recent", JSON.stringify(nextRecent))
      setStatus("ready")
    } catch (error) {
      setStatus("error")
      setMessage(error.message || "The AI question service is unavailable.")
    }
  }

  const answer = (index) => {
    if (status !== "ready" || selected !== null) return
    setSelected(index)
    if (index === question.correct_index) {
      setStatus("correct")
      setMessage(question.explanation || "Correct. Nice work.")
      onEarn?.(POINTS)
    } else {
      setStatus("incorrect")
      setMessage(question.explanation || "Not quite. Review the lesson and try the next question.")
    }
  }

  const skip = () => {
    setStatus("skipped")
    setQuestion(null)
    setSelected(null)
    setMessage("Skipped. No XP is awarded, and you can continue learning.")
  }

  return (
    <div className="mcq-session">
      <div className="mcq-head">
        <div>
          <div className="eyebrow"><Sparkles size={13}/> AI CHECKPOINT</div>
          <h4>Test the topic you are learning</h4>
          <p>Gemini creates a fresh question from <b>{lesson}</b>. Skip it whenever you want.</p>
        </div>
        {status === "ready" && <span className="mcq-points">+{POINTS} XP</span>}
      </div>

      {status === "idle" && (
        <div className="mcq-start">
          <button className="primary small" onClick={generate}><Sparkles size={14}/> Generate MCQ</button>
          <button className="secondary small" onClick={skip}><SkipForward size={14}/> Skip</button>
        </div>
      )}

      {status === "loading" && (
        <div className="mcq-loading"><LoaderCircle size={17}/> Gemini is generating a new question...</div>
      )}

      {question && ["ready","correct","incorrect"].includes(status) && (
        <div className="mcq-question">
          <div className="mcq-question-label">QUESTION</div>
          <h5>{question.question}</h5>
          <div className="mcq-options">
            {question.options.map((option, index) => {
              const isCorrect = index === question.correct_index
              const isChosen = selected === index
              const className = "mcq-option" +
                (isChosen ? " chosen" : "") +
                (status !== "ready" && isCorrect ? " correct" : "") +
                (isChosen && !isCorrect ? " wrong" : "")
              return (
                <button key={option} className={className} onClick={() => answer(index)} disabled={status !== "ready"}>
                  <span>{String.fromCharCode(65 + index)}</span>
                  <b>{option}</b>
                  {status !== "ready" && isCorrect && <Check size={15}/>}
                  {status !== "ready" && isChosen && !isCorrect && <X size={15}/>}
                </button>
              )
            })}
          </div>
          {message && <div className={"mcq-feedback " + (status === "correct" ? "good" : "bad")}><b>{status === "correct" ? "Correct · +25 XP" : "Not quite"}</b><p>{message}</p></div>}
          {status !== "ready" && (
            <div className="mcq-actions">
              <button className="secondary small" onClick={generate}><RotateCcw size={14}/> New question</button>
              <button className="secondary small" onClick={skip}><SkipForward size={14}/> Skip</button>
            </div>
          )}
        </div>
      )}

      {status === "skipped" && (
        <div className="mcq-skipped">
          <SkipForward size={16}/>
          <span>{message}</span>
          <button className="secondary small" onClick={generate}><ChevronRight size={14}/> Try one</button>
        </div>
      )}

      {status === "error" && (
        <div className="mcq-error">
          <div><b>MCQ unavailable</b><p>{message}</p></div>
          <button className="secondary small" onClick={generate}><RotateCcw size={14}/> Retry</button>
        </div>
      )}
    </div>
  )
}
