import React, { useState } from "react"
import { ArrowRight, Eye, EyeOff, LogOut, Mail, ShieldCheck, User, X } from "lucide-react"
import { supabase, SUPABASE_URL } from "../lib/supabase"
import { useAuth } from "../auth/AuthContext"

export default function AuthModal({ open, onClose }) {
  const { user, profile, signOut } = useAuth()
  const [mode, setMode] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  if (!open) return null

  const resetFeedback = () => {
    setMessage("")
    setError("")
  }

  const submit = async (event) => {
    event.preventDefault()
    resetFeedback()
    setBusy(true)

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: displayName.trim() } }
        })

        if (signUpError) throw signUpError
        if (data.session) setMessage("Account created. Welcome to Quilsbee.")
        else setMessage("Account created. Check your email to confirm the account.")
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        })
        if (signInError) throw signInError
        setMessage("Signed in successfully.")
      }
    } catch (err) {
      setError(err?.message || "Authentication failed.")
    } finally {
      setBusy(false)
    }
  }

  const google = async () => {
    resetFeedback()
    setBusy(true)
    try {
      const settingsResponse = await fetch(SUPABASE_URL + "/auth/v1/settings", {
        headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY }
      })
      const settings = await settingsResponse.json()
      if (!settings?.external?.google) {
        throw new Error("Google sign-in is not enabled for this Supabase project yet. Email sign-in is ready; enable Google under Authentication → Sign In → Google.")
      }
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin }
      })
      if (oauthError) throw oauthError
    } catch (err) {
      setError(err?.message || "Google sign-in could not start.")
      setBusy(false)
    }
  }

  const logout = async () => {
    setBusy(true)
    const { error: signOutError } = await signOut()
    if (signOutError) setError(signOutError.message)
    else setMessage("Signed out.")
    setBusy(false)
  }

  return (
    <div className="auth-overlay" role="presentation" onMouseDown={onClose}>
      <section className="auth-card" role="dialog" aria-modal="true" aria-label="Quilsbee account" onMouseDown={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose} aria-label="Close account panel"><X size={18}/></button>
        <div className="auth-mark">Q</div>
        <div className="eyebrow">QUILSBEE · ACCOUNT</div>

        {user ? (
          <div className="account-view">
            <div className="account-avatar"><User size={24}/></div>
            <h2>{profile?.display_name || user.email?.split("@")[0] || "Explorer"}</h2>
            <p className="auth-email">{user.email}</p>
            <div className="account-status"><ShieldCheck size={16}/> Your account is connected and ready to save progress.</div>
            {message && <div className="auth-message">{message}</div>}
            {error && <div className="auth-error">{error}</div>}
            <button className="auth-submit danger" onClick={logout} disabled={busy}><LogOut size={16}/> {busy ? "Signing out..." : "Sign out"}</button>
          </div>
        ) : (
          <>
            <h2>{mode === "login" ? "Continue your journey." : "Create your learner account."}</h2>
            <p className="auth-subtitle">{mode === "login" ? "Sign in to keep XP, lessons, circuits and achievements across devices." : "Your progress will be linked to your account instead of this browser."}</p>
            <div className="auth-tabs">
              <button className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); resetFeedback() }}>Sign in</button>
              <button className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); resetFeedback() }}>Create account</button>
            </div>
            <button className="auth-google" onClick={google} disabled={busy}><span>G</span> Continue with Google</button>
            <div className="auth-divider"><span>or use email</span></div>
            <form onSubmit={submit}>
              {mode === "signup" && (
                <label>Display name<input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" autoComplete="name" required/></label>
              )}
              <label><Mail size={15}/> Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/></label>
              <label><ShieldCheck size={15}/> Password<div className="password-field"><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} required/><button type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div></label>
              <button className="auth-submit" type="submit" disabled={busy}><ArrowRight size={16}/>{busy ? "Working..." : mode === "login" ? "Sign in" : "Create account"}</button>
            </form>
            {message && <div className="auth-message">{message}</div>}
            {error && <div className="auth-error">{error}</div>}
          </>
        )}
      </section>
    </div>
  )
}
