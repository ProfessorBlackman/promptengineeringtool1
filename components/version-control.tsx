"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { GitBranch, ContrastIcon as Compare, Save, GitCommit } from "lucide-react"

interface PromptVersion {
  id: string
  promptId: string
  version: string
  content: string
  changes: string
  author: string
  timestamp: Date
  isActive: boolean
  tags: string[]
  metrics?: {
    performance: number
    usage: number
  }
}

interface Prompt {
  id: string
  title: string
  currentVersion: string
  versions: PromptVersion[]
}

export default function VersionControl() {
  const [prompts] = useState<Prompt[]>([
    {
      id: "1",
      title: "Creative Story Generator",
      currentVersion: "v1.2",
      versions: [
        {
          id: "v1.0",
          promptId: "1",
          version: "v1.0",
          content: "Write a story about a character.",
          changes: "Initial version",
          author: "John Doe",
          timestamp: new Date("2024-01-10"),
          isActive: false,
          tags: ["initial"],
          metrics: { performance: 65, usage: 23 },
        },
        {
          id: "v1.1",
          promptId: "1",
          version: "v1.1",
          content: "Write a {genre} story about a {character} who discovers something.",
          changes: "Added genre and character parameters",
          author: "John Doe",
          timestamp: new Date("2024-01-15"),
          isActive: false,
          tags: ["parameters"],
          metrics: { performance: 78, usage: 45 },
        },
        {
          id: "v1.2",
          promptId: "1",
          version: "v1.2",
          content:
            "Write a {genre} story about a {character} who discovers {discovery}. The story should be {length} words long and include {elements}.",
          changes: "Added discovery, length, and elements parameters for better control",
          author: "Jane Smith",
          timestamp: new Date("2024-01-20"),
          isActive: true,
          tags: ["enhanced", "detailed"],
          metrics: { performance: 89, usage: 156 },
        },
      ],
    },
  ])

  const [selectedPromptId, setSelectedPromptId] = useState<string>("1")
  const [selectedVersions, setSelectedVersions] = useState<string[]>([])
  const [showCompareDialog, setShowCompareDialog] = useState(false)
  const [showCreateVersionDialog, setShowCreateVersionDialog] = useState(false)
  const [newVersionData, setNewVersionData] = useState({
    content: "",
    changes: "",
    tags: "",
  })

  const selectedPrompt = prompts.find((p) => p.id === selectedPromptId)
  const sortedVersions =
    selectedPrompt?.versions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) || []

  const handleCompareVersions = () => {
    if (selectedVersions.length === 2) {
      setShowCompareDialog(true)
    }
  }

  const handleVersionSelect = (versionId: string) => {
    setSelectedVersions((prev) => {
      if (prev.includes(versionId)) {
        return prev.filter((id) => id !== versionId)
      } else if (prev.length < 2) {
        return [...prev, versionId]
      } else {
        return [prev[1], versionId]
      }
    })
  }

  const handleCreateVersion = () => {
    // In a real app, this would create a new version
    console.log("Creating new version:", newVersionData)
    setShowCreateVersionDialog(false)
    setNewVersionData({ content: "", changes: "", tags: "" })
  }

  const getVersionBadgeVariant = (version: PromptVersion) => {
    if (version.isActive) return "default"
    if (version.tags.includes("deprecated")) return "destructive"
    return "secondary"
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Version Control
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Track changes and manage prompt versions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCompareVersions} disabled={selectedVersions.length !== 2}>
            <Compare className="h-4 w-4 mr-2" />
            Compare ({selectedVersions.length}/2)
          </Button>
          <Button onClick={() => setShowCreateVersionDialog(true)}>
            <Save className="h-4 w-4 mr-2" />
            New Version
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prompt Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Prompt</CardTitle>
            <CardDescription>Choose a prompt to view its version history</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedPromptId} onValueChange={setSelectedPromptId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {prompts.map((prompt) => (
                  <SelectItem key={prompt.id} value={prompt.id}>
                    {prompt.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedPrompt && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Current Version</span>
                  <Badge>{selectedPrompt.currentVersion}</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedPrompt.versions.find((v) => v.isActive)?.content.slice(0, 100)}...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Version History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Version History</CardTitle>
            <CardDescription>
              {selectedPrompt ? `${sortedVersions.length} versions available` : "Select a prompt to view history"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedPrompt ? (
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {sortedVersions.map((version) => (
                    <div
                      key={version.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedVersions.includes(version.id)
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => handleVersionSelect(version.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={getVersionBadgeVariant(version)}>{version.version}</Badge>
                          {version.isActive && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Active
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{version.timestamp.toLocaleDateString()}</div>
                      </div>

                      <div className="mb-2">
                        <p className="text-sm font-medium mb-1">Changes:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{version.changes}</p>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{version.content}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">by {version.author}</span>
                          {version.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        {version.metrics && (
                          <div className="flex items-center gap-3 text-xs">
                            <span className={getPerformanceColor(version.metrics.performance)}>
                              {version.metrics.performance}% performance
                            </span>
                            <span className="text-gray-500">{version.metrics.usage} uses</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <GitCommit className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a prompt to view its version history</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Compare Dialog */}
      <Dialog open={showCompareDialog} onOpenChange={setShowCompareDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compare Versions</DialogTitle>
            <DialogDescription>Side-by-side comparison of selected versions</DialogDescription>
          </DialogHeader>

          {selectedVersions.length === 2 && selectedPrompt && (
            <div className="grid grid-cols-2 gap-6">
              {selectedVersions.map((versionId) => {
                const version = selectedPrompt.versions.find((v) => v.id === versionId)
                if (!version) return null

                return (
                  <div key={versionId} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant={getVersionBadgeVariant(version)}>{version.version}</Badge>
                      <span className="text-sm text-gray-500">{version.timestamp.toLocaleDateString()}</span>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Content:</Label>
                      <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm">{version.content}</div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Changes:</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{version.changes}</p>
                    </div>

                    {version.metrics && (
                      <div>
                        <Label className="text-sm font-medium">Performance:</Label>
                        <div className="mt-1 text-sm">
                          <span className={getPerformanceColor(version.metrics.performance)}>
                            {version.metrics.performance}% performance
                          </span>
                          <span className="text-gray-500 ml-3">{version.metrics.usage} uses</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Version Dialog */}
      <Dialog open={showCreateVersionDialog} onOpenChange={setShowCreateVersionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Version</DialogTitle>
            <DialogDescription>Create a new version of your prompt with improvements</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Prompt Content</Label>
              <Textarea
                id="content"
                value={newVersionData.content}
                onChange={(e) => setNewVersionData({ ...newVersionData, content: e.target.value })}
                placeholder="Enter the updated prompt content..."
                className="min-h-[120px]"
              />
            </div>

            <div>
              <Label htmlFor="changes">Change Description</Label>
              <Textarea
                id="changes"
                value={newVersionData.changes}
                onChange={(e) => setNewVersionData({ ...newVersionData, changes: e.target.value })}
                placeholder="Describe what changes you made and why..."
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={newVersionData.tags}
                onChange={(e) => setNewVersionData({ ...newVersionData, tags: e.target.value })}
                placeholder="e.g., enhancement, bug-fix, optimization"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateVersionDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateVersion}>
                <GitCommit className="h-4 w-4 mr-2" />
                Create Version
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
