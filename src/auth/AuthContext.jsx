import React, { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = async (user) => {
    if (!user) {
      setProfile(null)
      return
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    if (error) {
      console.warn("Profile lookup failed:", error.message)
      setProfile(null)
      return
    }

    if (data) {
      setProfile(data)
      return
    }

    const fallbackProfile = {
      id: user.id,
      display_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Explorer",
      xp: 420,
      level: 2,
      updated_at: new Date().toISOString()
    }
    const { data: created, error: createError } = await supabase
      .from("profiles")
      .insert(fallbackProfile)
      .select("*")
      .maybeSingle()

    if (!createError) setProfile(created)
    else console.warn("Profile creation needs the profiles RLS policy/trigger:", createError.message)
  }

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(async ({ data: { session: current } }) => {
      if (!mounted) return
      setSession(current)
      await loadProfile(current?.user || null)
      if (mounted) setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        setSession(nextSession)
        await loadProfile(nextSession?.user || null)
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ session, user: session?.user || null, profile, setProfile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}
