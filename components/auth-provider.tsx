"use client"

import type React from "react"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { User } from "firebase/auth"
import {firebaseAuth} from "@/lib/firebase";

type AuthContextValue = {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsub: (() => void) | null = null
    ;(async () => {
      try {
        unsub = firebaseAuth.onAuthStateChanged((u) => {
          setUser(u)
          setLoading(false)
        })
      } catch (e) {
        // Firebase not configured yet; keep loading false so Setup UI can render
        setLoading(false)
      }
    })()
    return () => {
      if (unsub) unsub()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signOut: async () => {
        await firebaseAuth.signOut()
      },
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
