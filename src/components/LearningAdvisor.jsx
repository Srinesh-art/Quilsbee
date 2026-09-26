import React, { useEffect, useState } from 'react'
import { ArrowRight, BrainCircuit } from 'lucide-react'

const API = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

export default function LearningAdvisor({ level, xp, unlocked }) {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetch(API + '/ai/recommend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ level, xp, unlocked }) })
      .then(r => r.json()).then(setData).catch(() => setData({ title: 'Continue with Quantum Studio', reason: 'Build and simulate a circuit to turn the next concept into something observable.' }))
  }, [level, xp, unlocked])
  return <div className="learning-advisor"><div className="advisor-icon"><BrainCircuit size={20}/></div><div><div className="eyebrow">PERSONALIZED NEXT MISSION</div><h3>{data?.title || 'Choosing your next missionâ€¦'}</h3><p>{data?.reason || 'Q-Bot is mapping your current progress to the next useful challenge.'}</p></div><ArrowRight size={18}/></div>
}

