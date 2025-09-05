"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, X, FileIcon as FileTemplate, Play, Trash2 } from "lucide-react"
import type { Template, Prompt } from "@/app/dashboard/page"

interface TemplateManagerProps {
  templates: Template[]
  prompts: Prompt[]
  onAddTemplate: (template: Omit<Template, "id" | "createdAt">) => void
  onDeleteTemplate: (id: string) => void
  onSavePrompt: (prompt: Omit<Prompt, "id" | "createdAt" | "updatedAt">) => void
}

export function TemplateManager({
  templates,
  prompts,
  onAddTemplate,
  onDeleteTemplate,
  onSavePrompt,
}: TemplateManagerProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [variableValues, setVariableValues] = useState<Record<string, any>>({})

  // Template creation state
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    basePrompt: "",
    category: "",
    variables: [] as Array<{
      name: string
      type: "text" | "number" | "select"
      options?: string[]
      defaultValue?: any
    }>,
  })

  const [newVariable, setNewVariable] = useState({
    name: "",
    type: "text" as "text" | "number" | "select",
    options: [] as string[],
    defaultValue: "",
  })

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

  const addVariable = () => {
    if (newVariable.name.trim()) {
      setNewTemplate((prev) => ({
        ...prev,
        variables: [...prev.variables, { ...newVariable }],
      }))
      setNewVariable({
        name: "",
        type: "text",
        options: [],
        defaultValue: "",
      })
    }
  }

  const removeVariable = (index: number) => {
    setNewTemplate((prev) => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index),
    }))
  }

  const createTemplate = () => {
    if (newTemplate.name.trim() && newTemplate.basePrompt.trim() && newTemplate.category) {
      onAddTemplate(newTemplate)
      setNewTemplate({
        name: "",
        description: "",
        basePrompt: "",
        category: "",
        variables: [],
      })
      setIsCreating(false)
    }
  }

  const generateFromTemplate = () => {
    if (!selectedTemplate) return

    let generatedPrompt = selectedTemplate.basePrompt

    // Replace variables in the prompt
    selectedTemplate.variables.forEach((variable) => {
      const value = variableValues[variable.name] || variable.defaultValue || ""
      generatedPrompt = generatedPrompt.replace(new RegExp(`\\{${variable.name}\\}`, "g"), value)
    })

    // Create a new prompt from the template
    onSavePrompt({
      title: `${selectedTemplate.name} - Generated`,
      content: generatedPrompt,
      category: selectedTemplate.category,
      tags: ["template-generated"],
      parameters: variableValues,
      constraints: [],
    })

    setSelectedTemplate(null)
    setVariableValues({})
  }

  const createTemplateFromPrompt = (prompt: Prompt) => {
    // Extract potential variables from the prompt content
    const variableMatches = prompt.content.match(/\{([^}]+)\}/g) || []
    const variables = variableMatches.map((match) => {
      const name = match.slice(1, -1)
      return {
        name,
        type: "text" as const,
        defaultValue: prompt.parameters?.[name] || "",
      }
    })

    setNewTemplate({
      name: `${prompt.title} Template`,
      description: `Template based on: ${prompt.title}`,
      basePrompt: prompt.content,
      category: prompt.category,
      variables,
    })
    setIsCreating(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Template Library</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Create and manage reusable prompt templates</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{template.name}</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(template)}>
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTemplate(template.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Badge variant="outline" className="w-fit">
                {template.category}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{template.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{template.variables.length} variables</span>
                <span>{template.createdAt.toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <FileTemplate className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">No templates created yet.</p>
          <Button onClick={() => setIsCreating(true)}>Create Your First Template</Button>
        </div>
      )}

      {/* Quick Actions for Existing Prompts */}
      {prompts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Create Template from Existing Prompt</CardTitle>
            <CardDescription>Convert your saved prompts into reusable templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {prompts.slice(0, 6).map((prompt) => (
                <Button
                  key={prompt.id}
                  variant="outline"
                  className="justify-start h-auto p-3 bg-transparent"
                  onClick={() => createTemplateFromPrompt(prompt)}
                >
                  <div className="text-left">
                    <div className="font-medium line-clamp-1">{prompt.title}</div>
                    <div className="text-xs text-gray-500">{prompt.category}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Template Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>Build a reusable template with customizable variables</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Template Name</Label>
                <Input
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter template name"
                />
              </div>

              <div>
                <Label>Category</Label>
                <Select
                  value={newTemplate.category}
                  onValueChange={(value) => setNewTemplate((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={newTemplate.description}
                onChange={(e) => setNewTemplate((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this template does"
              />
            </div>

            <div>
              <Label>Base Prompt</Label>
              <Textarea
                value={newTemplate.basePrompt}
                onChange={(e) => setNewTemplate((prev) => ({ ...prev, basePrompt: e.target.value }))}
                placeholder="Write your prompt template here. Use {variable_name} for variables."
                className="min-h-[120px]"
              />
            </div>

            <Separator />

            <div>
              <Label>Variables</Label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Variable name"
                    value={newVariable.name}
                    onChange={(e) => setNewVariable((prev) => ({ ...prev, name: e.target.value }))}
                  />
                  <Select
                    value={newVariable.type}
                    onValueChange={(value: "text" | "number" | "select") =>
                      setNewVariable((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="select">Select</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addVariable} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {newTemplate.variables.map((variable, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <span className="text-sm">
                      <strong>{variable.name}</strong> ({variable.type})
                    </span>
                    <X className="h-4 w-4 cursor-pointer text-red-500" onClick={() => removeVariable(index)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={createTemplate}>Create Template</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Use Template Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Use Template: {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>Fill in the variables to generate a new prompt</DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4">
              <div>
                <Label>Template Preview</Label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm">{selectedTemplate.basePrompt}</div>
              </div>

              {selectedTemplate.variables.map((variable) => (
                <div key={variable.name}>
                  <Label>{variable.name}</Label>
                  {variable.type === "select" && variable.options ? (
                    <Select
                      value={variableValues[variable.name] || variable.defaultValue}
                      onValueChange={(value) =>
                        setVariableValues((prev) => ({
                          ...prev,
                          [variable.name]: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {variable.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type={variable.type === "number" ? "number" : "text"}
                      value={variableValues[variable.name] || variable.defaultValue || ""}
                      onChange={(e) =>
                        setVariableValues((prev) => ({
                          ...prev,
                          [variable.name]: e.target.value,
                        }))
                      }
                      placeholder={`Enter ${variable.name}`}
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  Cancel
                </Button>
                <Button onClick={generateFromTemplate}>Generate Prompt</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
