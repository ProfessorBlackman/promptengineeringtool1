"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, Edit, Trash2, Copy, Calendar, Tag } from "lucide-react"
import type { Prompt } from "@/app/dashboard/page"

interface PromptLibraryProps {
  prompts: Prompt[]
  onUpdatePrompt: (id: string, updates: Partial<Prompt>) => void
  onDeletePrompt: (id: string) => void
}

export function PromptLibrary({ prompts, onUpdatePrompt, onDeletePrompt }: PromptLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)

  const categories = ["all", ...new Set(prompts.map((p) => p.category))]
  const allTags = ["all", ...new Set(prompts.flatMap((p) => p.tags))]

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || prompt.category === selectedCategory
    const matchesTag = selectedTag === "all" || prompt.tags.includes(selectedTag)

    return matchesSearch && matchesCategory && matchesTag
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt)
  }

  const handleSaveEdit = () => {
    if (editingPrompt) {
      onUpdatePrompt(editingPrompt.id, {
        title: editingPrompt.title,
        content: editingPrompt.content,
        category: editingPrompt.category,
        tags: editingPrompt.tags,
      })
      setEditingPrompt(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag === "all" ? "All Tags" : tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredPrompts.length} of {prompts.length} prompts
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrompts.map((prompt) => (
          <Card key={prompt.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{prompt.title}</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(prompt.content)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(prompt)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeletePrompt(prompt.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Badge variant="outline" className="w-fit">
                {prompt.category}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{prompt.content}</p>

              {prompt.tags.length > 0 && (
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
              )}

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {prompt.createdAt.toLocaleDateString()}
                </div>
                {prompt.testResults && prompt.testResults.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {prompt.testResults.length} tests
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No prompts found matching your criteria.</p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingPrompt} onOpenChange={() => setEditingPrompt(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Prompt</DialogTitle>
            <DialogDescription>Make changes to your prompt below.</DialogDescription>
          </DialogHeader>

          {editingPrompt && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={editingPrompt.title}
                  onChange={(e) =>
                    setEditingPrompt({
                      ...editingPrompt,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={editingPrompt.content}
                  onChange={(e) =>
                    setEditingPrompt({
                      ...editingPrompt,
                      content: e.target.value,
                    })
                  }
                  className="min-h-[200px]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingPrompt(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
