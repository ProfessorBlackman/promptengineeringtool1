"use client"

import { type ReactNode } from "react"
import { useAuth } from "./auth-provider"
import AuthForm from "./auth-form"
import { Loader2 } from "lucide-react"

export default function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()



  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <AuthForm />
      </div>
    )
  }

  return <>{children}</>
}
