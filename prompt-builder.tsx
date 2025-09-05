"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, X, Save } from "lucide-react"
import type { Prompt } from "@/app/dashboard/page"

interface PromptBuilderProps {
  onSave: (prompt: Omit<Prompt, "id" | "createdAt" | "updatedAt">) => void
  initialPrompt?: Prompt
}

export function PromptBuilder({ onSave, initialPrompt }: PromptBuilderProps) {
  const [title, setTitle] = useState(initialPrompt?.title || "")
  const [content, setContent] = useState(initialPrompt?.content || "")
  const [category, setCategory] = useState(initialPrompt?.category || "")
  const [tags, setTags] = useState<string[]>(initialPrompt?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [constraints, setConstraints] = useState<string[]>(initialPrompt?.constraints || [])
  const [newConstraint, setNewConstraint] = useState("")
  const [parameters, setParameters] = useState<Record<string, any>>(initialPrompt?.parameters || {})
  const [newParamKey, setNewParamKey] = useState("")
  const [newParamValue, setNewParamValue] = useState("")

  const categories = [
    "Creative Writing",
    "Code Generation",
    "Data Analysis",
    "Question Answering",
    "Summarization",
    "Translation",
    "Classification",
    "Reasoning",
    "Other",
  ]

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const addConstraint = () => {
    if (newConstraint.trim() && !constraints.includes(newConstraint.trim())) {
      setConstraints([...constraints, newConstraint.trim()])
      setNewConstraint("")
    }
  }

  const removeConstraint = (constraintToRemove: string) => {
    setConstraints(constraints.filter((constraint) => constraint !== constraintToRemove))
  }

  const addParameter = () => {
    if (newParamKey.trim() && newParamValue.trim()) {
      setParameters({
        ...parameters,
        [newParamKey.trim()]: newParamValue.trim(),
      })
      setNewParamKey("")
      setNewParamValue("")
    }
  }

  const removeParameter = (key: string) => {
    const newParams = { ...parameters }
    delete newParams[key]
    setParameters(newParams)
  }

  const handleSave = () => {
    if (!title.trim() || !content.trim() || !category) {
      return
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      category,
      tags,
      constraints,
      parameters,
    })

    // Reset form
    setTitle("")
    setContent("")
    setCategory("")
    setTags([])
    setConstraints([])
    setParameters({})
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Prompt Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title for your prompt"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === "Enter" && addTag()}
              />
              <Button onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Parameters</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newParamKey}
                onChange={(e) => setNewParamKey(e.target.value)}
                placeholder="Parameter name"
              />
              <Input
                value={newParamValue}
                onChange={(e) => setNewParamValue(e.target.value)}
                placeholder="Default value"
              />
              <Button onClick={addParameter} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {Object.entries(parameters).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-sm">
                    <strong>{key}:</strong> {value}
                  </span>
                  <X className="h-4 w-4 cursor-pointer text-red-500" onClick={() => removeParameter(key)} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Constraints</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newConstraint}
                onChange={(e) => setNewConstraint(e.target.value)}
                placeholder="Add a constraint"
                onKeyPress={(e) => e.key === "Enter" && addConstraint()}
              />
              <Button onClick={addConstraint} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {constraints.map((constraint, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-sm">{constraint}</span>
                  <X className="h-4 w-4 cursor-pointer text-red-500" onClick={() => removeConstraint(constraint)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <Label htmlFor="content">Prompt Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your prompt here. You can reference parameters using {parameter_name} syntax."
          className="min-h-[200px] mt-2"
        />
        <p className="text-sm text-gray-500 mt-2">
          Tip: Use {"{"} {"}"} to reference parameters in your prompt content
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Prompt
        </Button>
      </div>
    </div>
  )
}
