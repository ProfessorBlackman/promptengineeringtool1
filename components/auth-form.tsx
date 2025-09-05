"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {firebaseAuth} from "@/lib/firebase";

export default function AuthForm() {
  const [tab, setTab] = useState<"login" | "register" | "reset">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const resetFields = () => {
    setError(null)
    setLoading(false)
  }

  const handleLogin = async () => {
    resetFields()
    setLoading(true)
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth")
      await signInWithEmailAndPassword(firebaseAuth, email, password)
      toast({ title: "Welcome back", description: "Signed in successfully." })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login failed"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    resetFields()
    setLoading(true)
    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth")
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password)
      if (name) await updateProfile(cred.user, { displayName: name })
      toast({ title: "Account created", description: "You're signed in." })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Registration failed"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    resetFields()
    setLoading(true)
    try {
      const { sendPasswordResetEmail } = await import("firebase/auth")
      await sendPasswordResetEmail(firebaseAuth, email)
      toast({ title: "Password reset sent", description: "Check your inbox for the reset link." })
      setTab("login")
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Could not send reset email"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign in to Prompt Studio</CardTitle>
        <CardDescription>Use your email and password to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="reset">Recover</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email1">Email</Label>
              <Input id="email1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw1">Password</Label>
              <Input id="pw1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button className="w-full" onClick={handleLogin} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <button className="text-sm underline text-muted-foreground" onClick={() => setTab("reset")}>
              Forgot password?
            </button>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name2">Name</Label>
              <Input id="name2" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email2">Email</Label>
              <Input id="email2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw2">Password</Label>
              <Input id="pw2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button className="w-full" onClick={handleRegister} disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </TabsContent>

          <TabsContent value="reset" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email3">Email</Label>
              <Input id="email3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button className="w-full" onClick={handleReset} disabled={loading}>
              {loading ? "Sending..." : "Send reset email"}
            </Button>
            <button className="text-sm underline text-muted-foreground" onClick={() => setTab("login")}>
              Back to login
            </button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
