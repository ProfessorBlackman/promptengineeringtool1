"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GitBranch, History, RotateCcw, GitCommit, Users, Clock } from "lucide-react"
import type { Prompt, PromptVersion } from "@/app/dashboard/page"

interface VersionControlProps {
  prompt: Prompt
  versions: PromptVersion[]
  onCreateVersion: (version: Omit<PromptVersion, "id" | "createdAt">) => void
  onRevertToVersion: (versionId: string) => void
  onUpdatePrompt: (updates: Partial<Prompt>) => void
}

export function VersionControl({
  prompt,
  versions,
  onCreateVersion,
  onRevertToVersion,
  onUpdatePrompt,
}: VersionControlProps) {
  const [isCommitting, setIsCommitting] = useState(false)
  const [commitMessage, setCommitMessage] = useState("")
  const [selectedVersion, setSelectedVersion] = useState<PromptVersion | null>(null)

  const promptVersions = versions.filter((v) => v.promptId === prompt.id).sort((a, b) => b.version - a.version)

  const createNewVersion = () => {
    if (!commitMessage.trim()) return

    const newVersion: Omit<PromptVersion, "id" | "createdAt"> = {
      promptId: prompt.id,
      version: Math.max(...promptVersions.map((v) => v.version), 0) + 1,
      content: prompt.content,
      title: prompt.title,
      changes: commitMessage,
      createdBy: "Current User", // In a real app, this would be the authenticated user
      isActive: true,
    }

    // Mark previous version as inactive
    promptVersions.forEach((v) => {
      if (v.isActive) {
        v.isActive = false
      }
    })

    onCreateVersion(newVersion)
    setCommitMessage("")
    setIsCommitting(false)
  }

  const revertToVersion = (version: PromptVersion) => {
    onUpdatePrompt({
      content: version.content,
      title: version.title,
    })
    onRevertToVersion(version.id)
    setSelectedVersion(null)
  }

  const getDiffStats = (oldContent: string, newContent: string) => {
    const oldLines = oldContent.split("\n")
    const newLines = newContent.split("\n")

    let additions = 0
    let deletions = 0

    // Simple diff calculation
    if (newLines.length > oldLines.length) {
      additions = newLines.length - oldLines.length
    } else {
      deletions = oldLines.length - newLines.length
    }

    return { additions, deletions }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Version Control</h3>
          <Badge variant="outline">v{promptVersions.find((v) => v.isActive)?.version || 1}</Badge>
        </div>
        <Button onClick={() => setIsCommitting(true)}>
          <GitCommit className="h-4 w-4 mr-2" />
          Commit Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Version History
            </CardTitle>
            <CardDescription>Track changes and manage versions of your prompt</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {promptVersions.map((version, index) => {
                  const prevVersion = promptVersions[index + 1]
                  const diffStats = prevVersion
                    ? getDiffStats(prevVersion.content, version.content)
                    : { additions: 0, deletions: 0 }

                  return (
                    <div
                      key={version.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        version.isActive
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => setSelectedVersion(version)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={version.isActive ? "default" : "secondary"}>v{version.version}</Badge>
                          {version.isActive && (
                            <Badge variant="outline" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {version.createdAt.toLocaleDateString()}
                        </div>
                      </div>

                      <p className="text-sm font-medium mb-1">{version.changes}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">by {version.createdBy}</p>

                      {(diffStats.additions > 0 || diffStats.deletions > 0) && (
                        <div className="flex items-center gap-2 text-xs">
                          {diffStats.additions > 0 && <span className="text-green-600">+{diffStats.additions}</span>}
                          {diffStats.deletions > 0 && <span className="text-red-600">-{diffStats.deletions}</span>}
                        </div>
                      )}
                    </div>
                  )
                })}

                {promptVersions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No versions yet. Commit your first version!</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Changes</CardTitle>
            <CardDescription>Review your modifications before committing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Current Content</Label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm max-h-60 overflow-y-auto">
                  {prompt.content}
                </div>
              </div>

              {promptVersions.length > 0 && (
                <div>
                  <Label>Changes Since Last Version</Label>
                  <div className="p-3 border rounded-md text-sm">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Users className="h-3 w-3" />
                      Last modified: {prompt.updatedAt.toLocaleString()}
                    </div>
                    <p className="text-green-600">+ Modified content and structure</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commit Dialog */}
      <Dialog open={isCommitting} onOpenChange={setIsCommitting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Commit New Version</DialogTitle>
            <DialogDescription>Create a new version of your prompt with a descriptive message</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="commitMessage">Commit Message</Label>
              <Textarea
                id="commitMessage"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Describe the changes you made..."
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCommitting(false)}>
                Cancel
              </Button>
              <Button onClick={createNewVersion} disabled={!commitMessage.trim()}>
                Commit Version
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Version Details Dialog */}
      <Dialog open={!!selectedVersion} onOpenChange={() => setSelectedVersion(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Version {selectedVersion?.version} Details</DialogTitle>
            <DialogDescription>Review this version and optionally revert to it</DialogDescription>
          </DialogHeader>

          {selectedVersion && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>Created By</Label>
                  <p>{selectedVersion.createdBy}</p>
                </div>
                <div>
                  <Label>Created At</Label>
                  <p>{selectedVersion.createdAt.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <Label>Changes</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedVersion.changes}</p>
              </div>

              <Separator />

              <div>
                <Label>Content</Label>
                <ScrollArea className="h-60 w-full border rounded-md p-3">
                  <pre className="text-sm whitespace-pre-wrap">{selectedVersion.content}</pre>
                </ScrollArea>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedVersion(null)}>
                  Close
                </Button>
                {!selectedVersion.isActive && (
                  <Button onClick={() => revertToVersion(selectedVersion)}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Revert to This Version
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
