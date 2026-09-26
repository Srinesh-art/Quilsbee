import os
import sqlite3
from datetime import datetime, timezone

DB_PATH = os.path.join(os.path.dirname(__file__), "quantum_world.db")

def _connect():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("CREATE TABLE IF NOT EXISTS learning_events (id INTEGER PRIMARY KEY AUTOINCREMENT, learner_id TEXT NOT NULL, event TEXT NOT NULL, module TEXT, score REAL, metadata TEXT, created_at TEXT NOT NULL)")
    return conn

def record_event(learner_id, event, module="", score=None, metadata=""):
    conn = _connect()
    conn.execute("INSERT INTO learning_events (learner_id,event,module,score,metadata,created_at) VALUES (?,?,?,?,?,?)", (learner_id, event, module, score, metadata, datetime.now(timezone.utc).isoformat()))
    conn.commit()
    conn.close()

def summary():
    conn = _connect()
    total = conn.execute("SELECT COUNT(*) FROM learning_events").fetchone()[0]
    learners = conn.execute("SELECT COUNT(DISTINCT learner_id) FROM learning_events").fetchone()[0]
    modules = conn.execute("SELECT module, COUNT(*) FROM learning_events WHERE module <> '' GROUP BY module ORDER BY COUNT(*) DESC LIMIT 10").fetchall()
    scores = conn.execute("SELECT AVG(score), MAX(score) FROM learning_events WHERE score IS NOT NULL").fetchone()
    conn.close()
    return {"events": total, "learners": learners, "top_modules": [{"module": m, "events": n} for m, n in modules], "average_score": scores[0] or 0, "max_score": scores[1] or 0}
