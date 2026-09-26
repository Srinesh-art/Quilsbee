import React, { useEffect, useState } from 'react'
import { BarChart3, RefreshCw, Users } from 'lucide-react'

const API = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

export default function InstructorDashboard() {
  const [data, setData] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = async () => {
    setBusy(true)
    try {
      const r = await fetch(API + '/instructor/summary')
      setData(await r.json())
    } catch {
      setData({ error: 'Analytics backend is offline.' })
    } finally { setBusy(false) }
  }

  useEffect(() => { load() }, [])

  return <div className="instructor-dashboard">
    <div className="instructor-head"><div><div className="eyebrow">INSTRUCTOR CONSOLE</div><h3>Learning analytics</h3><p>Live classroom telemetry from completed learning actions. This is the foundation for cohort-level dashboards.</p></div><button className="secondary" onClick={load} disabled={busy}><RefreshCw size={14}/> Refresh</button></div>
    {data?.error ? <div className="studio-error">{data.error}</div> : <><div className="instructor-stats"><div><Users size={17}/><span>LEARNERS</span><b>{data?.learners ?? 'â€”'}</b></div><div><BarChart3 size={17}/><span>EVENTS</span><b>{data?.events ?? 'â€”'}</b></div><div><span>AVG SCORE</span><b>{Number(data?.average_score || 0).toFixed(1)}</b></div><div><span>MAX SCORE</span><b>{Number(data?.max_score || 0).toFixed(1)}</b></div></div><div className="module-analytics"><div className="eyebrow">MODULE ACTIVITY</div>{(data?.top_modules || []).length ? data.top_modules.map(x => <div className="module-row" key={x.module}><span>{x.module}</span><i><b style={{ width: Math.min(100, x.events * 10) + '%' }}/></i><small>{x.events}</small></div>) : <p>No learning events recorded yet. Run a Studio experiment to populate the dashboard.</p>}</div></>}
  </div>
}

