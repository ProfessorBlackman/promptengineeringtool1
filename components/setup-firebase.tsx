"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { writeLocalConfig, hasFirebaseConfig } from "@/lib/firebase"
import { TriangleAlert, CheckCircle2 } from "lucide-react"

export default function SetupFirebase({ onConfigured }: { onConfigured?: () => void }) {
  const [json, setJson] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setError(null)
    setSaved(false)
    try {
      const parsed = JSON.parse(json)
      if (!parsed.apiKey || !parsed.projectId || !parsed.authDomain) {
        setError("Missing required keys: apiKey, authDomain, projectId")
        return
      }
      writeLocalConfig(parsed)
      setSaved(true)
      if (hasFirebaseConfig()) {
        onConfigured?.()
        // reload to ensure Firebase initializes from new config
        window.location.reload()
      }
    } catch (e) {
      setError("Invalid JSON. Paste the Firebase config object from your Firebase console.")
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Connect Firebase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Setup required</AlertTitle>
            <AlertDescription>
              Paste your Firebase Web App configuration JSON. You can find it in Firebase Console {"->"} Project
              Settings {"->"} Your apps {"->"} SDK setup and configuration.
            </AlertDescription>
          </Alert>
          <div className="space-y-2">
            <Label htmlFor="cfg">Firebase Config JSON</Label>
            <Textarea
              id="cfg"
              placeholder='{"apiKey":"...","authDomain":"...","projectId":"...","appId":"..."}'
              className="min-h-[160px]"
              value={json}
              onChange={(e) => setJson(e.target.value)}
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>Invalid configuration</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {saved && !error && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Saved</AlertTitle>
              <AlertDescription>Config saved to this browser. Reloading...</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save & Reload</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
