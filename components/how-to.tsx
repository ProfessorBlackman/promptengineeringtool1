"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Lightbulb, Keyboard, Layers, Save, Tags, Filter, ShieldCheck } from "lucide-react"

export default function HowTo() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">How to use Prompt Engineering Studio</h2>
        <p className="text-muted-foreground">
          Learn the essentials of building, organizing, and testing prompts efficiently. Includes all keyboard shortcuts
          and tips.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" /> Quick Start
          </CardTitle>
          <CardDescription>Build a prompt in minutes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ol className="list-decimal pl-5 space-y-1">
            <li>Open Builder and give your prompt a clear title.</li>
            <li>
              Write the prompt. Use placeholders like {"{genre}"} and {"{character}"} for dynamic values.
            </li>
            <li>Add Parameters that map to each placeholder and set sensible defaults.</li>
            <li>Define Constraints (e.g., length, style) to guide the output.</li>
            <li>Preview and then Save to your Library for reuse.</li>
          </ol>
          <Separator />
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Best Practice</Badge>
            <span className="text-muted-foreground">
              Keep placeholders consistent and well-documented in the parameter descriptions.
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" /> Keyboard Shortcuts
          </CardTitle>
          <CardDescription>Navigate and work faster</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <ul className="grid md:grid-cols-2 gap-2">
            <li>
              <strong>Sidebar toggle:</strong> Cmd/Ctrl + B
            </li>
            <li>
              <strong>Go Analytics:</strong> Shift + Cmd/Ctrl + A or g then a
            </li>
            <li>
              <strong>Go Curated:</strong> Shift + Cmd/Ctrl + C or g then c
            </li>
            <li>
              <strong>Go Templates:</strong> Shift + Cmd/Ctrl + T or g then t
            </li>
            <li>
              <strong>Go Library:</strong> Shift + Cmd/Ctrl + L or g then l
            </li>
            <li>
              <strong>Go How To:</strong> Shift + Cmd/Ctrl + H or g then h
            </li>
          </ul>
          <p className="text-xs text-muted-foreground">
            The sidebar supports a built-in toggle shortcut mapping for Cmd/Ctrl + B. See Sidebar component guidance for
            more details.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" /> Parameters, Constraints, and Tags
          </CardTitle>
          <CardDescription>Structure your prompt for reuse</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <ul className="space-y-1">
            <li>
              <strong>Parameters:</strong> Define each placeholder. Provide defaults and descriptions for clarity.
            </li>
            <li>
              <strong>Constraints:</strong> Add rules like "max 500 words" or "professional tone".
            </li>
            <li>
              <strong>Tags:</strong> Categorize prompts for quick discovery in the Library and Curated views.
            </li>
          </ul>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge>
              <Save className="h-3 w-3 mr-1" /> Save frequently
            </Badge>
            <Badge>
              <Tags className="h-3 w-3 mr-1" /> Tag consistently
            </Badge>
            <Badge>
              <Filter className="h-3 w-3 mr-1" /> Filter in Library
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" /> Account and Sync
          </CardTitle>
          <CardDescription>Secure access and cloud storage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Sign in to securely save prompts and preferences to Firestore. Your data is scoped to your account and can
            be accessed from any device after login.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
