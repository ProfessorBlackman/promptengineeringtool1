"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Edit, Trash2, FileIcon as FileTemplate, Settings, Save } from "lucide-react"

interface Template {
  id: string
  name: string
  description: string
  category: string
  structure: string
  variables: string[]
  examples: string[]
  createdAt: Date
  usage: number
}

export default function TemplateManager() {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "Story Template",
      description: "Template for creative storytelling prompts",
      category: "Creative Writing",
      structure:
        "Write a {genre} story about {character} who {action}. The story should be {length} and include {elements}.",
      variables: ["genre", "character", "action", "length", "elements"],
      examples: [
        "Write a fantasy story about a young wizard who discovers an ancient artifact. The story should be 500 words and include magic, adventure, friendship.",
        "Write a sci-fi story about a space explorer who encounters alien life. The story should be 1000 words and include technology, mystery, discovery.",
      ],
      createdAt: new Date("2024-01-15"),
      usage: 45,
    },
    {
      id: "2",
      name: "Code Review Template",
      description: "Template for code analysis and review prompts",
      category: "Programming",
      structure: "Review the following {language} code for {focus_areas}:\n\n{code}\n\nProvide {output_format}.",
      variables: ["language", "focus_areas", "code", "output_format"],
      examples: [
        "Review the following JavaScript code for best practices, security issues:\n\n// code here\n\nProvide specific suggestions with examples.",
        "Review the following Python code for performance, readability:\n\n# code here\n\nProvide detailed analysis with recommendations.",
      ],
      createdAt: new Date("2024-01-10"),
      usage: 32,
    },
  ])

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    name: "",
    description: "",
    category: "",
    structure: "",
    variables: [],
    examples: [],
  })

  const categories = ["all", ...new Set(templates.map((t) => t.category))]

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.structure) return

    const template: Template = {
      id: Date.now().toString(),
      name: newTemplate.name,
      description: newTemplate.description || "",
      category: newTemplate.category || "General",
      structure: newTemplate.structure,
      variables: extractVariables(newTemplate.structure),
      examples: newTemplate.examples || [],
      createdAt: new Date(),
      usage: 0,
    }

    setTemplates((prev) => [...prev, template])
    setNewTemplate({
      name: "",
      description: "",
      category: "",
      structure: "",
      variables: [],
      examples: [],
    })
    setIsCreateDialogOpen(false)
  }

  const extractVariables = (structure: string): string[] => {
    const matches = structure.match(/\{([^}]+)\}/g)
    return matches ? matches.map((match) => match.slice(1, -1)) : []
  }

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate({ ...template })
    setIsEditDialogOpen(true)
  }

  const handleSaveTemplate = () => {
    if (!editingTemplate) return

    setTemplates((prev) =>
      prev.map((t) =>
        t.id === editingTemplate.id
          ? { ...editingTemplate, variables: extractVariables(editingTemplate.structure) }
          : t,
      ),
    )
    setIsEditDialogOpen(false)
    setEditingTemplate(null)
  }

  const handleDeleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id))
  }

  const handleUseTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setTemplates((prev) => prev.map((t) => (t.id === template.id ? { ...t, usage: t.usage + 1 } : t)))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileTemplate className="h-5 w-5" />
            Template Manager
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Create and manage reusable prompt templates</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates List */}
        <Card>
          <CardHeader>
            <CardTitle>Available Templates</CardTitle>
            <CardDescription>Choose a template to customize and use</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{template.name}</h4>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditTemplate(template)
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteTemplate(template.id)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                      <span className="text-xs text-gray-500">Used {template.usage} times</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Template Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Template Preview</CardTitle>
            <CardDescription>
              {selectedTemplate ? "Customize and use this template" : "Select a template to preview"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedTemplate ? (
              <Tabs defaultValue="structure" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="structure">Structure</TabsTrigger>
                  <TabsTrigger value="variables">Variables</TabsTrigger>
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                </TabsList>

                <TabsContent value="structure" className="space-y-4">
                  <div>
                    <Label>Template Structure</Label>
                    <Textarea
                      value={selectedTemplate.structure}
                      readOnly
                      className="min-h-[120px] bg-gray-50 dark:bg-gray-800"
                    />
                  </div>
                  <Button onClick={() => handleUseTemplate(selectedTemplate)} className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Use This Template
                  </Button>
                </TabsContent>

                <TabsContent value="variables" className="space-y-4">
                  <div>
                    <Label>Template Variables</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {selectedTemplate.variables.map((variable) => (
                        <Badge key={variable} variant="secondary">
                          {`{${variable}}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    These variables will be replaced with actual values when using the template.
                  </div>
                </TabsContent>

                <TabsContent value="examples" className="space-y-4">
                  <div>
                    <Label>Usage Examples</Label>
                    <ScrollArea className="h-60 mt-2">
                      <div className="space-y-3">
                        {selectedTemplate.examples.map((example, index) => (
                          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                            {example}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileTemplate className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a template to see its details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Template Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>Design a reusable template for your prompts</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={newTemplate.name || ""}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="Enter template name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newTemplate.description || ""}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                placeholder="Describe what this template is for"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newTemplate.category || ""}
                onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                placeholder="e.g., Creative Writing, Programming"
              />
            </div>

            <div>
              <Label htmlFor="structure">Template Structure</Label>
              <Textarea
                id="structure"
                value={newTemplate.structure || ""}
                onChange={(e) => setNewTemplate({ ...newTemplate, structure: e.target.value })}
                placeholder="Use {variable_name} for dynamic parts"
                className="min-h-[120px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use curly braces around variable names, e.g., {`{genre}`}, {`{character}`}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTemplate}>
                <Save className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>Modify your template structure and details</DialogDescription>
          </DialogHeader>

          {editingTemplate && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Template Name</Label>
                <Input
                  id="edit-name"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editingTemplate.description}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={editingTemplate.category}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-structure">Template Structure</Label>
                <Textarea
                  id="edit-structure"
                  value={editingTemplate.structure}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, structure: e.target.value })}
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
