import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, Bug, ChevronRight, Code2, Cpu, Flame, Gamepad2, Lightbulb, Lock, MessageCircle, Play, Puzzle as PuzzleIcon, Send, Sparkles, Trophy, User, Zap } from 'lucide-react';
import './App.css';
import './ui-redesign.css';
import Qubit3D from './components/Qubit3D';
import QuantumHeroScene from './components/QuantumHeroScene';
import QuantumStudio from './components/QuantumStudio';
import AlgorithmDemo from './components/AlgorithmDemo';
import EntanglementDemo from './components/EntanglementDemo';
import FinalChallenge from './components/FinalChallenge';
import InstructorDashboard from './components/InstructorDashboard';
import AlgorithmGallery from './components/AlgorithmGallery';
import LearningAdvisor from './components/LearningAdvisor';
import CurriculumPath from './components/CurriculumPath';
import AuthModal from './components/AuthModal';
import { useAuth } from './auth/AuthContext';
import { supabase } from './lib/supabase';

const API = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const BASE = import.meta.env.BASE_URL || '/';
const asset = path => `${BASE}${path.replace(/^\//, '')}`;
const starterBug={title:'The Broken Hadamard',difficulty:'Easy',code:'from qiskit import QuantumCircuit\nqc = QuantumCircuit(1)\nqc.x(0)\nqc.measure_all()',hint:'Create a 50/50 superposition before measurement.'};
const pieces=['WHEEL','BODY','ENGINE','WINDOW','DOOR','LIGHT','ROOF','SEAT'];

function XPBar({xp,level}){return <div className="xp-wrap"><div className="xp-meta"><span>LEVEL {level}</span><b>{xp} XP</b></div><div className="xp-track"><div style={{width:(xp%500)/5+'%'}}/></div></div>}


function speakComic(text){if(typeof window==='undefined'||!window.speechSynthesis)return;const synth=window.speechSynthesis;synth.cancel();const voices=synth.getVoices();const english=voices.filter(v=>/^en(-|$)/i.test(v.lang));const preferred=['Microsoft Jenny Online (Natural) - English (United States)','Microsoft Aria Online (Natural) - English (United States)','Google US English','Samantha','Ava'];const voice=preferred.map(n=>english.find(v=>v.name===n)).find(Boolean)||english.find(v=>v.localService&&/US|GB|AU|IN/i.test(v.lang))||english.find(v=>v.default)||english[0];const u=new SpeechSynthesisUtterance(text);u.lang=voice?.lang||'en-US';if(voice)u.voice=voice;u.rate=.94;u.pitch=1.02;u.volume=1;synth.speak(u)}
function VideoHero(){return <section className="video-hero quantum-hero"><QuantumHeroScene/><div className="hero-circuit-glow"/><div className="hero-copy"><div className="eyebrow"><span className="pulse-dot"/> QUILSBEE · LEARNING OS</div><h1>Build a working quantum intuition.<br/><em>Then put it to the test.</em></h1><p>Learn qubits, gates, algorithms and measurement through guided lessons, interactive experiments and real circuit debugging.</p><button className="primary" onClick={()=>document.getElementById('learn').scrollIntoView({behavior:'smooth'})}><Play size={16}/> Start learning</button></div><div className="scroll-note"><span>SCROLL TO ENTER</span><ChevronRight size={13}/></div></section>}

function ComicCard({earn}){return <div className="comic-card"><div className="comic-art"><div className="comic-badge">EPISODE 01 · HOVER DIALOGUE TO HEAR</div><div className="comic-sun"/><div className="comic-character">Q</div><div className="comic-panel p1">CLASSICAL<br/><b className="speakable" onMouseEnter={()=>speakComic('Classical computers use one or zero.')}>ONE OR ZERO.</b></div><div className="comic-panel p2">QUANTUM<br/><b className="speakable" onMouseEnter={()=>speakComic('Quantum computers can use a superposition of both.')}>WHY NOT BOTH?</b></div></div><div className="comic-copy"><div className="eyebrow">COMIC LESSON · 8 MIN</div><h3>The Qubit Who Refused to Choose</h3><p>Meet Nova, a qubit who teaches superposition through a story instead of a textbook.</p><button className="secondary" onClick={()=>earn(80)}>Open comic <ChevronRight size={16}/></button></div></div>}

function Experiment({earn}){const [v,setV]=useState(50);return <div className="experiment-card"><div className="lab-top"><div><div className="eyebrow">INTERACTIVE EXPERIMENT</div><h3>Collapse the Qubit</h3></div><span className="lab-status">LIVE</span></div><div className="experiment-stage"><div className="orbit"/><div className="qubit-core" style={{transform:'rotate('+v*3.6+'deg)'}}>|ψ⟩</div><div className="measurement">P(0) {v}% · P(1) {100-v}%</div></div><input type="range" min="0" max="100" value={v} onChange={e=>setV(+e.target.value)}/><button className="primary small" onClick={()=>earn(120)}><Sparkles size={15}/> Record experiment</button></div>}

function Debugger({earn,lesson,level,onBug}){const [mode,setMode]=useState('solve');const [code,setCode]=useState(starterBug.code);const [previousCode,setPreviousCode]=useState('');const [previousBug,setPreviousBug]=useState({});const [result,setResult]=useState(null);const [busy,setBusy]=useState(false);const analyze=async()=>{setBusy(true);setResult(null);try{const r=await fetch(API+'/debug/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,language:'python',lesson,level,mode,previous_code:previousCode,previous_bug:previousBug})});const data=await r.json();setResult(data);if(mode==='solve'&&data.fixed_previous_bug){setMode('create');setPreviousCode(code);setPreviousBug(data);earn(180)}else if(mode==='create'&&data.meaningful_bug&&data.is_harder_than_previous){setPreviousCode(code);setPreviousBug(data);onBug(data);earn(220)} }catch(e){setResult({verdict:'ERROR',reason:'Backend unavailable. Start FastAPI on port 8000.',error_summary:e.message})}finally{setBusy(false)}};return <div className="debugger"><div className="terminal-head"><div className="traffic"><i/><i/><i/></div><span>quantum-lab / compiler</span><span className="live-chip">● {mode.toUpperCase()} MODE</span></div><div className="debug-grid"><div className="code-pane"><div className="pane-label"><Bug size={14}/> {mode==='solve'?'BUG #001 · FIX THE CIRCUIT':'BUG FACTORY · CREATE THE NEXT CHALLENGE'}</div><textarea className="code-editor" value={code} onChange={e=>setCode(e.target.value)} spellCheck="false"/><div className="compiler-note">LOCAL CIRCUIT CHECK + LEARNING REVIEW</div></div><div className="challenge-pane"><div className="eyebrow">{mode==='solve'?'YOUR TURN':'PUBLISH A HARDER BUG'}</div><h3>{mode==='solve'?starterBug.title:'Make the next learner think harder'}</h3><p>{mode==='solve'?starterBug.hint:'Change the working program so it contains a meaningful quantum bug. Syntax-only typos are rejected.'}</p><button className="primary" disabled={busy} onClick={analyze}><Code2 size={15}/>{busy?'Judging…':mode==='solve'?'Compile & verify fix':'Validate & publish bug'}</button>{result&&<div className={'judge '+(result.verdict==='REJECTED'?'bad':'good')}><b>{result.verdict||'AI JUDGE'}</b><p>{result.reason||result.error_summary||result.error}</p>{result.safe_hint&&<small>Hint: {result.safe_hint}</small>}<div className="judge-grid"><span>ERROR <b>{String(result.has_error)}</b></span><span>MEANINGFUL <b>{String(result.meaningful_bug)}</b></span><span>HARDER <b>{String(result.is_harder_than_previous)}</b></span><span>DIFFICULTY <b>{result.difficulty_score??'—'}</b></span></div></div>}</div></div><div className="chain"><div><span>YOU</span><b>FIX BUG</b></div><ChevronRight/><div><span>YOU</span><b>PLANT HARDER BUG</b></div><ChevronRight/><div><span>NEXT LEARNER</span><b>DEBUG IT</b></div></div></div>}

const mangaHotspots={
1:[
[7,8,26,25,'After years of traditional computing... I finally step into a new world. A world where information can be more than just 0 or 1.'],
[60,16,27,17,'This is... Quantum Computing!'],
[7,43,29,17,'Welcome, Student. Before we meet qubits, you must understand the idea of a computing model.'],
[40,43,25,17,'A computing model is a framework that defines how information is represented, processed, and how we obtain the result.'],
[34,78,31,14,'So the key difference is how information is represented and processed...'],
[57,76,22,14,'Exactly! And that starts with the qubit.']
],
2:[
[7,9,26,16,'I know a classical bit can be 0 or 1... But what exactly is a qubit?'],
[57,9,30,18,'A qubit is the basic unit of quantum information. Unlike a classical bit, it can exist in a superposition of 0 and 1.'],
[57,43,28,19,'So a qubit is not just 0 or 1... It is both, until we measure it?'],
[74,54,20,17,'Exactly! A qubit exists in a superposition, and when we measure it, we get either 0 or 1 with certain probabilities.'],
[8,61,31,20,'Hi! I am Qubi! I can be in multiple states at once! When you measure me, I collapse to either 0 or 1. But until then, I am in a superposition!'],
[7,85,34,11,'This is amazing... A single qubit already has more possibilities than a classical bit!'],
[61,85,31,12,'Great! In the next panels, we will explore basis states, Bloch sphere and how to visualize qubits.']
],
3:[
[7,9,26,16,'So a qubit can be in a superposition... But what are these |0⟩ and |1⟩ exactly?'],
[59,9,31,18,'Great question! |0⟩ and |1⟩ are called the basis states of a qubit. They are like the north and south poles of the qubit world.'],
[7,61,29,16,'So |0⟩ and |1⟩ are just like reference points... And any other qubit state is somewhere in between?'],
[18,70,24,13,'Exactly! They form a basis for the qubit state space.'],
[68,61,26,17,'Well done! These basis states might look simple, but they are the building blocks of everything in quantum computing.'],
[7,82,34,10,'I started with a simple question... but now I see, these two states are the foundation of an entirely new world.']
],
4:[
[7,8,28,19,'Looking at this world... there are endless possibilities. But how do we start representing a qubit mathematically?'],
[58,8,31,19,'Every complex idea has simple building blocks, Akira. For a qubit, those building blocks are the basis states |0⟩ and |1⟩.'],
[67,42,24,18,'So |0⟩ and |1⟩ are just two reference points on the Bloch sphere?'],
[7,62,29,14,'Yes! Any qubit state can be expressed as a combination of these two basis states.'],
[57,62,31,15,'|0⟩ and |1⟩ are like the two colors on my palette. By mixing them with different amounts, I can create infinite shades of possibilities!'],
[8,84,27,10,'Two simple states... but they open the door to infinite possibilities. I am just getting started.']
],
5:[
[7,9,29,18,'Wow... The universe looks so different from here. It makes me feel like there are infinite possibilities out there.'],
[61,9,31,18,'Exactly, Akira. A qubit is not limited to 0 or 1. It can be in a superposition of both.'],
[46,51,26,15,'So before we measure, it is not just 0 or 1... it is both, with certain probabilities!'],
[7,78,30,15,'So superposition is like a spinning coin... but at the quantum level!'],
[58,79,29,12,'A world of possibilities.']
],
6:[
[7,9,29,18,'So a qubit can be in both |0⟩ and |1⟩... but how do we describe how much of each state it has?'],
[60,9,31,18,'We use probability amplitudes. They tell us the amount of each basis state in a qubit.'],
[43,45,24,13,'Wow! So the qubit has an equal chance of giving 0 or 1 when measured!'],
[7,75,30,13,'So alpha and beta are not just normal numbers, they can have a phase too?'],
[57,75,31,15,'Exactly! That is what makes quantum states rich and powerful. The phase plays a crucial role in interference.'],
[12,89,30,8,'Now I understand. A qubit is not just 0 or 1. It is a combination with probability amplitudes.']
],
7:[
[7,9,29,18,'Woah... What is this glowing sphere, Sensei? Is this a map of all possible qubit states?'],
[61,9,31,18,'Exactly, Akira! This is the Bloch Sphere. It is a powerful way to visualize the state of a single qubit.'],
[7,60,30,15,'So by just changing the angles theta and phi, I can represent any qubit state on this sphere?'],
[8,72,30,12,'That is so intuitive! It is like a coordinate system for quantum states!'],
[62,61,30,16,'Exactly, Akira. The Bloch sphere makes it easy to visualize qubit states and understand rotations.'],
[7,86,31,10,'Now I can actually see the whole world of qubit states... Not just 0 or 1, but an infinite number of possibilities.']
],
8:[
[7,9,29,18,'So we can represent qubit states... But how do we actually change a qubit from |0⟩ to |1⟩ or create superposition?'],
[60,9,31,18,'We use quantum gates. Gates are like operations applied to a qubit, just like classical gates, but for quantum states.'],
[7,78,31,14,'Amazing... With quantum gates, we can create, rotate, combine and control qubit states.'],
[61,78,31,14,'Exactly, Akira. Quantum gates give us the power to manipulate qubits, and when we combine them, we can solve problems that classical computers cannot.']
],
9:[
[7,9,29,18,'We have learned that a qubit can be in a superposition of |0⟩ and |1⟩. But what happens when we measure it?'],
[61,9,31,18,'Good question! When we measure a qubit, we get only one definite result — either 0 or 1. The superposition collapses into a single state based on its probabilities.'],
[7,78,30,13,'So if I measure many times, I do not always get the same result, but the distribution matches the probabilities!'],
[58,78,32,13,'Exactly! With measurement, we can extract useful information from quantum systems.']
],
10:[
[7,9,29,18,'We can already do so much with classical computers. So why do we need qubits? What makes them so special?'],
[61,9,31,18,'Great question! Qubits give us a completely new way to process information. They can be in multiple states at once, which opens the door to solving problems that classical computers struggle with.'],
[7,86,31,10,'So qubits are not just a new type of bit. They are the key to a future where we can solve problems that seem impossible today.'],
[61,86,31,10,'Exactly, Akira. Qubits give us a new perspective on computation — and a brighter tomorrow for science, technology and society.']
],
11:[
[7,8,29,18,'So... I finally understand qubits now. Their states, superposition, probability amplitudes, measurement, and even the Bloch sphere... It is amazing, Sensei!'],
[59,8,32,18,'Good, Akira. You have learned how a qubit behaves — how to represent it, how to measure it, and why it is powerful. But remember... this is just the beginning.'],
[7,31,30,20,'What is happening?! The academy systems are showing an alert!'],
[40,31,25,20,'Unknown quantum state? But we just measured it...'],
[59,31,32,20,'Sensei... We measured the qubit and got 0 or 1. How can its state be changing again?'],
[77,46,17,12,'Look at the data, Akira.'],
[7,65,29,15,'But... this is impossible. The results are not consistent. It is not behaving like a normal qubit.'],
[69,64,24,15,'No, Akira... It means... this is not the qubit we thought we were studying.'],
[15,83,32,12,'They have learned how to observe it. Now let us see if they can control it.']
]};

function MangaViewer(){const pageCanvasRef=useRef(null);const turnFrontRef=useRef(null);const turnBackRef=useRef(null);const [page,setPage]=useState(1);const [total,setTotal]=useState(11);const [active,setActive]=useState(null);const [ready,setReady]=useState(false);const [turn,setTurn]=useState('');const [loadError,setLoadError]=useState('');const turningRef=useRef(false);const pdfRef=useRef(null);const renderPage=async(pageNumber,canvas)=>{if(!pdfRef.current||!canvas)return;const p=await pdfRef.current.getPage(pageNumber);const base=p.getViewport({scale:1});const maxWidth=920;const scale=Math.min(maxWidth/base.width,1.55);const vp=p.getViewport({scale});canvas.width=vp.width;canvas.height=vp.height;const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);await p.render({canvasContext:ctx,viewport:vp}).promise};useEffect(()=>{let mounted=true;(async()=>{const pdfjs=await import('pdfjs-dist/legacy/build/pdf.mjs');pdfjs.GlobalWorkerOptions.workerSrc=asset('pdfjs/pdf.worker.min.mjs');const pdf=await pdfjs.getDocument({url:asset('assets/comics/quantum-manga.pdf')}).promise;if(!mounted)return;pdfRef.current=pdf;setTotal(pdf.numPages);setReady(true)})().catch(e=>{if(mounted)setLoadError(e?.message||'PDF could not be loaded.')});return()=>{mounted=false;pdfRef.current?.destroy?.()}},[]);useEffect(()=>{if(!ready||!pageCanvasRef.current)return;renderPage(page,pageCanvasRef.current).catch(()=>{})},[page,ready]);const turnTo=async(nextPage,direction)=>{if(turningRef.current||nextPage===page||nextPage<1||nextPage>total||!pdfRef.current)return;turningRef.current=true;setActive(null);try{await Promise.all([renderPage(page,turnFrontRef.current),renderPage(nextPage,turnBackRef.current)]);requestAnimationFrame(()=>setTurn(direction));window.setTimeout(()=>{setPage(nextPage);setTurn('');turningRef.current=false},760)}catch{turningRef.current=false}};const prev=()=>turnTo(Math.max(1,page-1),'prev');const next=()=>turnTo(Math.min(total,page+1),'next');const hotspots=mangaHotspots[page]||[];return <div className="manga-card manga-reader"><div className="manga-copy"><div className="eyebrow">QUANTUM MANGA · {total} PAGES</div><h3>Quilsbee: The Quantum Manga</h3><p>Read the original chapter inside the comic lesson. Turn each page like a physical book and hover a highlighted speech bubble to hear the dialogue aloud.</p><div className="voice-note"><span className="voice-dot"/> NATURAL VOICE · HOVER TO SPEAK</div><a className="manga-open" href={asset('assets/comics/quantum-manga.pdf')} target="_blank" rel="noreferrer">Open original PDF <ChevronRight size={15}/></a></div><div className="manga-stage"><div className="manga-book"><div className="manga-page-base"><canvas ref={pageCanvasRef}/>{ready&&hotspots.map((h,i)=><button key={i} className={'manga-hotspot '+(active===i?'speaking':'')} style={{left:h[0]+'%',top:h[1]+'%',width:h[2]+'%',height:h[3]+'%'}} aria-label="Play dialogue" onMouseEnter={()=>{setActive(i);speakComic(h[4])}} onMouseLeave={()=>setActive(null)} onClick={()=>{setActive(i);speakComic(h[4])}}/> )}</div><div className={'manga-turn-sheet '+turn}><div className="manga-turn-face manga-turn-front"><canvas ref={turnFrontRef}/></div><div className="manga-turn-face manga-turn-back"><canvas ref={turnBackRef}/></div><div className="manga-turn-shadow"/></div>{!ready&&!loadError&&<div className="manga-loading">Loading quantum manga…</div>}{loadError&&<div className="manga-loading">Quantum manga failed to load. {loadError}</div>}</div><div className="manga-controls"><button className="manga-page-prev" onClick={prev} disabled={page===1||!!turn} aria-label="Previous page">← <span>Prev</span></button><span className="manga-page-count">PAGE {page} / {total}</span><button className="manga-page-next" onClick={next} disabled={page===total||!!turn} aria-label="Next page">Next <ChevronRight size={15}/></button></div></div></div>}

function StoryMode({earn,level}){const [universe,setUniverse]=useState('');const [concept,setConcept]=useState('quantum superposition');const [out,setOut]=useState(null);const [busy,setBusy]=useState(false);const generate=async()=>{if(!universe.trim())return;setBusy(true);try{const r=await fetch(API+'/ai/story',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({universe,concept,level})});const data=await r.json();setOut(data);earn(25)}catch(e){setOut({title:'Backend unavailable',explanation:'Start the FastAPI server and configure GEMINI_API_KEY.',where_it_breaks:e.message})}finally{setBusy(false)}};return <><div className="story-input"><input value={universe} onChange={e=>setUniverse(e.target.value)} placeholder="Anything: Interstellar, Minecraft, cricket, a character, your own story…"/><input value={concept} onChange={e=>setConcept(e.target.value)} placeholder="Concept to learn"/><button className="primary" disabled={busy} onClick={generate}><Sparkles size={15}/>{busy?'Generating…':'Generate lesson'}</button></div>{out&&<div className="movie-coach"><div className="coach-avatar">Q</div><div><div className="eyebrow">AI STORY LESSON</div><h3>{out.title}</h3><p><b>Concept:</b> {out.explanation}</p><p><b>Analogy:</b> {out.analogy}</p><p><b>Where it breaks:</b> {out.where_it_breaks}</p><p><b>Example:</b> {out.example}</p><p><b>Challenge:</b> {out.challenge}</p></div></div>}</>}

function QBot({open,setOpen,lesson,level,code,bug}){const [q,setQ]=useState('');const [messages,setMessages]=useState([]);const [busy,setBusy]=useState(false);const ask=async()=>{if(!q.trim())return;const question=q;setQ('');setBusy(true);try{const r=await fetch(API+'/ai/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:question,lesson,code,bug,level,history:messages})});const d=await r.json();setMessages(m=>[...m,{q:question,a:d.answer||d.error||'No answer returned.'}])}catch(e){setMessages(m=>[...m,{q:question,a:'Q-Bot backend is offline. Start FastAPI on port 8000.'}])}finally{setBusy(false)}};return <div className="qbot-root"><button className="qbot-fab" onClick={()=>setOpen(!open)}><div className="qbot-face"><i/><i/></div><span>Q</span></button>{open&&<aside className="qbot-drawer"><div className="assistant-head"><div className="bot-mini">Q</div><div><b>Q-BOT</b><span>Contextual quantum tutor</span></div><button className="close" onClick={()=>setOpen(false)}>×</button></div><div className="qbot-context">LESSON: {lesson} · LEVEL {level}</div><div className="chat-body">{messages.length===0?<div className="welcome"><Sparkles size={20}/><b>Ask anything about what you're doing.</b><p>Q-Bot receives your current lesson and debugging context.</p></div>:messages.map((m,i)=><div className="chat-pair" key={i}><div className="bubble user">{m.q}</div><div className="bubble bot">{m.a}</div></div>)}</div><div className="chat-input"><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ask()} placeholder={busy?'Thinking…':'Ask Q-Bot…'}/><button onClick={ask} disabled={busy}><Send size={16}/></button></div></aside>}</div>}

function LoginScreen(){
  const [mode,setMode]=useState('login'),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[name,setName]=useState('');
  const [show,setShow]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const submit=async e=>{e.preventDefault();setError('');setBusy(true);try{
    if(mode==='signup'){
      const {error:err}=await supabase.auth.signUp({email:email.trim(),password,options:{data:{display_name:name.trim()}}});
      if(err)throw err;
    }else{
      const {error:err}=await supabase.auth.signInWithPassword({email:email.trim(),password});
      if(err)throw err;
    }
  }catch(err){setError(err?.message||'Authentication failed.')}finally{setBusy(false)}};
  const google=async()=>{setError('');setBusy(true);try{
    const r=await fetch(import.meta.env.VITE_SUPABASE_URL+'/auth/v1/settings',{headers:{apikey:import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}});
    const s=await r.json();if(!s?.external?.google)throw new Error('Google sign-in is not enabled yet. Use email sign-in or enable Google in Supabase.');
    const {error:err}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin}});if(err)throw err;
  }catch(err){setError(err?.message||'Google sign-in could not start.');setBusy(false)}};
  return <div className="quantum-login">
    <section className="quantum-login-card">
        <div className="login-card-top"><span className="status-dot"/><span>SECURE QUANTUM ACCESS</span><i>QX-01</i></div>
        <div className="login-tabs"><button className={mode==='login'?'active':''} onClick={()=>{setMode('login');setError('')}}>SIGN IN</button><button className={mode==='signup'?'active':''} onClick={()=>{setMode('signup');setError('')}}>CREATE ACCOUNT</button></div>
        <h2>{mode==='login'?'Welcome back, explorer.':'Initialize your account.'}</h2>
        <p className="login-subtitle">{mode==='login'?'Resume your quantum journey where you left off.':'Create your identity and save your learning progress.'}</p>
        <button className="login-google" onClick={google} disabled={busy}><b>G</b> Continue with Google</button>
        <div className="login-divider"><span>OR CONTINUE WITH EMAIL</span></div>
        <form onSubmit={submit}>
          {mode==='signup'&&<label>DISPLAY NAME<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" autoComplete="name" required/></label>}
          <label>EMAIL ADDRESS<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/></label>
          <label>PASSWORD<div className="login-password"><input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Minimum 6 characters" minLength={6} autoComplete={mode==='login'?'current-password':'new-password'} required/><button type="button" onClick={()=>setShow(v=>!v)}>{show?'HIDE':'SHOW'}</button></div></label>
          <button className="login-submit" disabled={busy}>{busy?'AUTHENTICATING...':mode==='login'?'ENTER QUILSBEE':'CREATE IDENTITY'} <span>↗</span></button>
        </form>
        {error&&<div className="login-error">{error}</div>}
        <div className="login-security"><span>◈</span> Your session is protected by Supabase authentication.</div>
      </section>
  </div>
}

export default function App(){const {user,profile,loading}=useAuth();const [xp,setXp]=useState(()=>Number(localStorage.getItem('quantum_xp')||420)),[level,setLevel]=useState(()=>Number(localStorage.getItem('quantum_level')||2)),[unlocked,setUnlocked]=useState(()=>Number(localStorage.getItem('quantum_unlocked')||2)),[menu,setMenu]=useState('home'),[qopen,setQopen]=useState(false),[authOpen,setAuthOpen]=useState(false),[bug,setBug]=useState(starterBug);useEffect(()=>{if(!localStorage.getItem('quantum_learner_id'))localStorage.setItem('quantum_learner_id',crypto.randomUUID?.()||('learner-'+Date.now()));},[]);useEffect(()=>{if(profile){setXp(profile.xp??420);setLevel(profile.level??2);localStorage.setItem('quantum_xp',String(profile.xp??420));localStorage.setItem('quantum_level',String(profile.level??2));}},[profile]);if(loading)return <div className="quantum-login quantum-login-loading"><div className="login-loader"><span></span><b>INITIALIZING QUANTUM ACCESS</b><small>Synchronizing your learning space…</small></div></div>;if(!user)return <LoginScreen/>;const earn=n=>{setXp(x=>{const y=x+n;const nextLevel=2+Math.floor(y/500);localStorage.setItem('quantum_xp',String(y));if(nextLevel!==level){setLevel(nextLevel);localStorage.setItem('quantum_level',String(nextLevel));}if(user){supabase.from('profiles').update({xp:y,level:nextLevel,updated_at:new Date().toISOString()}).eq('id',user.id).then(({error})=>{if(error)console.warn('Could not save learner progress',error.message)});}return y});setUnlocked(x=>{const next=Math.min(8,x+1);localStorage.setItem('quantum_unlocked',String(next));return next})};const lesson=menu==='debug'?'Debug the Quantum Circuit':menu==='story'?'AI Story Mode':menu==='studio'?'Quantum Circuit Studio':'Quilsbee';return <div className="platform"><header className="topbar"><div className="brand"><div className="brand-mark">Q</div><div><b>QUILSBEE</b><small>LEARNING PLATFORM</small></div></div><nav aria-label="Primary navigation">{[['home','Learn'],['studio','Quantum Studio'],['debug','Bug Arena'],['story','Story Mode']].map(x=><button className={menu===x[0]?'active':''} onClick={()=>{setMenu(x[0]);document.getElementById(x[0]==='home'?'learn':x[0])?.scrollIntoView({behavior:'smooth'})}} key={x[0]}>{x[1]}</button>)}</nav><div className="top-actions"><div className="streak"><Flame size={15}/> 7 day streak</div><div className="level-pill"><Trophy size={14}/> LVL {level}</div><button className="avatar" onClick={()=>setAuthOpen(true)} aria-label={user?'Open account':'Sign in'} title={user?'Account':'Sign in'}>{user?(profile?.display_name?.[0]||user.email?.[0]||'Q').toUpperCase():<User size={17}/>}</button></div></header><a className="skip-link" href="#learn">Skip to content</a><main id="main-content"><VideoHero/><section className="dashboard" id="learn"><div className="dashboard-head"><div><div className="eyebrow">YOUR LEARNING OS</div><h2>Your quantum learning path.</h2><p>Follow the concept, test the idea, then demonstrate that you can use it.</p></div><XPBar xp={xp} level={level}/></div><div className="stats"><div><span>MASTERED</span><b>6</b><small>core concepts</small></div><div><span>NEXT MILESTONE</span><b>{500-(xp%500)}</b><small>XP remaining</small></div><div><span>BUILD</span><b>{unlocked}/8</b><small>components unlocked</small></div><div><span>DEBUG REVIEW</span><b>LIVE</b><small>learning loop</small></div></div></section><section className="content-section"><div className="section-title"><span>01</span><div><div className="eyebrow">LEARNING PATH</div><h2>Learn the system, then test it.</h2></div></div><LearningAdvisor level={level} xp={xp} unlocked={unlocked}/><CurriculumPath xp={xp} level={level} onEarn={earn}/></section><section className="content-section" id="quantum"><div className="manga-subsection"><div className="section-title compact"><span>01A</span><div><div className="eyebrow">QUANTUM MANGA</div><h2>Read the concept as a story.</h2></div></div><MangaViewer/></div></section><section className="content-section split" id="qubit"><Experiment earn={earn}/><div className="concept-panel"><div className="eyebrow">CONCEPT SNAPSHOT</div><h3>Superposition, made visible.</h3><p>See how a qubit combines basis states, how gates change its state, and how measurement produces an outcome.</p><div className="formula">|ψ⟩ = α|0⟩ + β|1⟩</div><button className="secondary" onClick={()=>earn(40)}><Lightbulb size={15}/> I get it</button></div></section><section className="content-section bloch-section"><div className="section-title"><span>01B</span><div><div className="eyebrow">3D QUBIT LAB</div><h2>See a qubit state in 3D.</h2></div></div><p className="section-lead">Rotate the Bloch sphere, move the state vector, and apply Hadamard to see a qubit leave |0⟩ and enter superposition.</p><Qubit3D onComplete={()=>earn(35)}/></section><section className="content-section" id="studio"><div className="section-title"><span>02</span><div><div className="eyebrow">QUANTUM STUDIO</div><h2>Construct the circuit. Run the idea.</h2></div></div><p className="section-lead">Design circuits visually, inspect the state, generate executable code, compare simulator results, and verify your reasoning with a focused assessment.</p><QuantumStudio onComplete={()=>earn(60)}/></section><section className="content-section" id="algorithms"><div className="section-title"><span>02A</span><div><div className="eyebrow">ALGORITHM LAB</div><h2>Understand the method behind the circuit.</h2></div></div><p className="section-lead">Trace search, oracle methods, teleportation, Fourier methods and hybrid optimization from the underlying idea to a runnable circuit.</p><AlgorithmGallery/><AlgorithmDemo onComplete={()=>earn(70)}/></section><section className="content-section" id="entanglement"><div className="section-title"><span>02B</span><div><div className="eyebrow">ENTANGLEMENT LAB</div><h2>Measure correlation, not just theory.</h2></div></div><EntanglementDemo onComplete={()=>earn(70)}/></section><section className="content-section" id="instructor"><div className="section-title"><span>05</span><div><div className="eyebrow">INSTRUCTOR DASHBOARD</div><h2>Learning progress, at a glance.</h2></div></div><InstructorDashboard/></section><section className="content-section" id="assessment"><div className="section-title"><span>04</span><div><div className="eyebrow">ASSESSMENT</div><h2>Build the circuit under constraint.</h2></div></div><p className="section-lead">A final challenge checks whether your gate sequence produces the requested Bell state and whether you understand why it works.</p><FinalChallenge onPassChallenge={()=>earn(250)}/></section><section className="content-section" id="debug"><div className="section-title"><span>02</span><div><div className="eyebrow">BUG ARENA</div><h2>Debug the circuit. Explain the failure.</h2></div></div><p className="section-lead">Find a meaningful circuit error, verify the correction, then create a harder one for the next learner. Syntax-only mistakes do not count.</p><Debugger earn={earn} lesson={lesson} level={level} onBug={setBug}/></section><section className="content-section" id="story"><div className="section-title"><span>03</span><div><div className="eyebrow">STORY MODE</div><h2>Put a quantum idea in context.</h2></div></div><p className="section-lead">Choose a familiar world, character, sport, game or story and use it to build a concrete mental model for the concept.</p><StoryMode earn={earn} level={level}/></section><section className="content-section"><div className="puzzle-card"><div><div className="eyebrow">MASTERY COLLECTION</div><h3>Build your quantum car</h3><p>Complete meaningful learning actions to unlock the next component.</p><div className="piece-list">{pieces.map((p,i)=><div className={i<unlocked?'piece unlocked':'piece'} key={p}>{i<unlocked?<PuzzleIcon size={16}/>:<Lock size={14}/>}<span>{p}</span></div>)}</div></div><div className="rover quantum-car" aria-label="Quantum car assembly visualization"><div className="rover-shadow"/><div className="rover-body"><div className="car-hood"/><div className="car-cabin"><div className="car-windshield"/><div className="car-window-side"/></div><div className="car-door-line"/><div className="car-handle"/><div className="car-mirror"/><div className="car-front-grille"/><div className="rover-light car-headlight"/><div className="car-taillight"/></div><div className="rover-wheel w1"><div className="wheel-rim"/><div className="wheel-hub"/></div><div className="rover-wheel w2"><div className="wheel-rim"/><div className="wheel-hub"/></div></div></div></section><section className="content-section game-mode-section" id="game-mode"><div className="game-mode-card"><div className="game-mode-icon"><Gamepad2 size={24}/></div><div className="game-mode-copy"><div className="eyebrow">GAME MODE · FUTURE RELEASE</div><h2>Turn quantum learning into play.</h2><p>A dedicated game mode is planned for a future release, with interactive challenges that let you explore quantum ideas through missions, puzzles and progression.</p><div className="game-mode-status"><span className="game-mode-dot"/> IN DEVELOPMENT <span>·</span> COMING IN A FUTURE RELEASE</div></div><div className="game-mode-mark">SOON</div></div></section></main><QBot open={qopen} setOpen={setQopen} lesson={lesson} level={level} code={bug.code} bug={JSON.stringify(bug)}/><footer aria-label="Site footer"><div><b>QUILSBEE</b><span>Learn the strange. Build the impossible.</span></div><div>© 2026 · Built for curious minds</div></footer><AuthModal open={authOpen} onClose={()=>setAuthOpen(false)}/></div>}









