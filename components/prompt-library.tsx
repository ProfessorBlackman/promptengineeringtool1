"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Edit, Trash2, Copy, Star, BookOpen, RefreshCw } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { listPrompts, updatePrompt, deletePrompt } from "@/lib/db"
import { useToast } from "@/hooks/use-toast"

interface Prompt {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  constraints: string[]
  parameters: Record<string, any>
  createdAt: Date
  updatedAt: Date
  rating?: number
  usage?: number
}

interface PromptLibraryProps {
  onSelectPrompt?: (prompt: Prompt) => void
}

export default function PromptLibrary({ onSelectPrompt }: PromptLibraryProps) {
  const { user } = useAuth()
  const { toast } = useToast()

  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [loading, setLoading] = useState(false)

  const categories = useMemo(() => ["all", ...new Set(prompts.map((p) => p.category))], [prompts])

  // Delete confirmation dialog logic
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [pendingDeletePrompt, setPendingDeletePrompt] = useState<Prompt | null>(null)

  const requestDeletePrompt = (prompt: Prompt) => {
    setPendingDeletePrompt(prompt)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeletePrompt = async () => {
    if (pendingDeletePrompt) {
      await handleDeletePrompt(pendingDeletePrompt.id)
      setIsDeleteDialogOpen(false)
      setPendingDeletePrompt(null)
    }
  }

  const cancelDeletePrompt = () => {
    setIsDeleteDialogOpen(false)
    setPendingDeletePrompt(null)
  }

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || prompt.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const fetchPrompts = async () => {
    if (!user) return
    setLoading(true)
    try {
      const raw = await listPrompts(user.uid)
      // map Firestore docs into our view model
      const mapped: Prompt[] = raw.map((d: any) => ({
        id: d.id,
        title: d.title,
        content: d.content,
        category: d.category,
        tags: d.tags || [],
        constraints: (d.constraints || []).map((c: any) => c.value ?? ""),
        parameters: (d.parameters || []).reduce((acc: any, p: any) => {
          acc[p.name] = p.defaultValue
          return acc
        }, {}),
        createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : new Date(),
        updatedAt: d.updatedAt?.toDate ? d.updatedAt.toDate() : new Date(),
        rating: d.metadata?.rating ?? undefined,
        usage: d.metadata?.usage ?? undefined,
      }))
      setPrompts(mapped)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load prompts"
      toast({ title: "Error", description: msg, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrompts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid])

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt({ ...prompt })
    setIsEditDialogOpen(true)
  }

  const handleSavePrompt = async () => {
    if (!user || !editingPrompt) return
    try {
      await updatePrompt(user.uid, editingPrompt.id, {
        title: editingPrompt.title,
        content: editingPrompt.content,
        category: editingPrompt.category,
        tags: editingPrompt.tags,
      })
      toast({ title: "Saved", description: "Prompt updated." })
      setIsEditDialogOpen(false)
      setEditingPrompt(null)
      fetchPrompts()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update prompt"
      toast({ title: "Error", description: msg, variant: "destructive" })
    }
  }

  const handleDeletePrompt = async (id: string) => {
    if (!user) return
    try {
      await deletePrompt(user.uid, id)
      setPrompts((prev) => prev.filter((p) => p.id !== id))
      toast({ title: "Deleted", description: "Prompt removed from your Library." })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to delete prompt"
      toast({ title: "Error", description: msg, variant: "destructive" })
    }
  }

  const handleCopyPrompt = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({ title: "Copied", description: "Prompt content copied to clipboard." })
  }

  const handleSelectPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
    onSelectPrompt?.(prompt)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Prompt Library
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage and organize your prompt collection</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchPrompts} disabled={loading}>
            <RefreshCw
              className="h-4 w-4 mr-2 animate-spin"
              style={{ animationPlayState: loading ? "running" : "paused" }}
            />
            {loading ? "Syncing..." : "Sync"}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Prompt
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredPrompts.length} of {prompts.length} prompts
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrompts.map((prompt) => (
          <Card key={prompt.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base line-clamp-2">{prompt.title}</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEditPrompt(prompt)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleCopyPrompt(prompt.content)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => requestDeletePrompt(prompt)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Badge variant="outline">{prompt.category}</Badge>
            </CardHeader>

            <CardContent className="space-y-3" onClick={() => handleSelectPrompt(prompt)}>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{prompt.content}</p>

              <div className="flex flex-wrap gap-1">
                {prompt.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {prompt.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{prompt.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {prompt.rating?.toFixed(1)}
                </div>
                <div>Used {prompt.usage ?? 0} times</div>
              </div>

              <div className="text-xs text-gray-500">Updated {prompt.updatedAt.toLocaleDateString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400">No prompts found matching your criteria.</p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Prompt</DialogTitle>
            <DialogDescription>Modify your prompt details and parameters.</DialogDescription>
          </DialogHeader>

          {editingPrompt && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingPrompt.title}
                  onChange={(e) => setEditingPrompt({ ...editingPrompt, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={editingPrompt.category}
                  onChange={(e) => setEditingPrompt({ ...editingPrompt, category: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="content">Prompt Content</Label>
                <Textarea
                  id="content"
                  value={editingPrompt.content}
                  onChange={(e) => setEditingPrompt({ ...editingPrompt, content: e.target.value })}
                  className="min-h-[120px]"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={editingPrompt.tags.join(", ")}
                  onChange={(e) =>
                    setEditingPrompt({
                      ...editingPrompt,
                      tags: e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSavePrompt}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the prompt "{pendingDeletePrompt?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={cancelDeletePrompt}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeletePrompt}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
