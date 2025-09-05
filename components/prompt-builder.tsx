"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Plus, X, Save, Eye, Wand2} from "lucide-react"
import {useAuth} from "@/components/auth-provider"
import {useToast} from "@/hooks/use-toast"
import {addPrompt} from "@/lib/db"

interface Parameter {
    name: string
    type: "text" | "number" | "select"
    defaultValue: string
    options?: string[]
    description?: string
}

interface Constraint {
    type: "length" | "format" | "content" | "style"
    value: string
    description: string
}

interface Prompt {
    title: string
    content: string
    category: string
    tags: string[]
    parameters: Parameter[]
    constraints: Constraint[]
    description: string
}

export default function PromptBuilder() {
    const [prompt, setPrompt] = useState<Prompt>({
        title: "",
        content: "",
        category: "",
        tags: [],
        parameters: [],
        constraints: [],
        description: "",
    })

    const [newTag, setNewTag] = useState("")
    const [newParameter, setNewParameter] = useState<Parameter>({
        name: "",
        type: "text",
        defaultValue: "",
        description: "",
    })
    const [newConstraint, setNewConstraint] = useState<Constraint>({
        type: "length",
        value: "",
        description: "",
    })
    const [previewMode, setPreviewMode] = useState(false)
    const {user} = useAuth()
    const {toast} = useToast()

    const categories = [
        "Creative Writing",
        "Code Generation",
        "Business Communication",
        "Data Analysis",
        "Education",
        "Marketing",
        "Research",
        "Summarization",
        "Programming",

    ]

    const addTag = () => {
        if (newTag.trim() && !prompt.tags.includes(newTag.trim())) {
            setPrompt((prev) => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()],
            }))
            setNewTag("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        setPrompt((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }))
    }

    const addParameter = () => {
        if (newParameter.name.trim()) {
            setPrompt((prev) => ({
                ...prev,
                parameters: [...prev.parameters, {...newParameter}],
            }))
            setNewParameter({
                name: "",
                type: "text",
                defaultValue: "",
                description: "",
            })
        }
    }

    const removeParameter = (index: number) => {
        setPrompt((prev) => ({
            ...prev,
            parameters: prev.parameters.filter((_, i) => i !== index),
        }))
    }

    const addConstraint = () => {
        if (newConstraint.value.trim()) {
            setPrompt((prev) => ({
                ...prev,
                constraints: [...prev.constraints, {...newConstraint}],
            }))
            setNewConstraint({
                type: "length",
                value: "",
                description: "",
            })
        }
    }

    const removeConstraint = (index: number) => {
        setPrompt((prev) => ({
            ...prev,
            constraints: prev.constraints.filter((_, i) => i !== index),
        }))
    }

    const generatePreview = () => {
        let preview = prompt.content
        prompt.parameters.forEach((param) => {
            const placeholder = `{${param.name}}`
            const value = param.defaultValue || `[${param.name}]`
            preview = preview.replace(new RegExp(placeholder, "g"), value)
        })
        return preview
    }

    const savePromptToCloud = async () => {
        if (!user) {
            toast({title: "Sign in required", description: "Please sign in to save prompts.", variant: "destructive"})
            return
        }
        if (!prompt.title || !prompt.content) {
            toast({title: "Missing fields", description: "Title and content are required.", variant: "destructive"})
            return
        }
        try {
            const id = await addPrompt(user.uid, {...prompt, metadata: {source: "builder"}})
            toast({title: "Saved", description: `Prompt saved to your Library (ID: ${id}).`})
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Failed to save prompt"
            toast({title: "Error", description: msg, variant: "destructive"})
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Wand2 className="h-5 w-5"/>
                        Prompt Builder
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Create and customize AI prompts with parameters and constraints
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                        <Eye className="h-4 w-4 mr-2"/>
                        {previewMode ? "Edit" : "Preview"}
                    </Button>
                    <Button onClick={savePromptToCloud}>
                        <Save className="h-4 w-4 mr-2"/>
                        Save Prompt
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Builder Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Prompt Configuration</CardTitle>
                        <CardDescription>Define your prompt structure and parameters</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="basic" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="basic">Basic</TabsTrigger>
                                <TabsTrigger value="parameters">Parameters</TabsTrigger>
                                <TabsTrigger value="constraints">Constraints</TabsTrigger>
                            </TabsList>

                            <TabsContent value="basic" className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Prompt Title</Label>
                                    <Input
                                        id="title"
                                        value={prompt.title}
                                        onChange={(e) => setPrompt((prev) => ({...prev, title: e.target.value}))}
                                        placeholder="Enter a descriptive title"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="category">Category</Label>
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={prompt.description}
                                        onChange={(e) => setPrompt((prev) => ({...prev, description: e.target.value}))}
                                        placeholder="Describe what you want to do with this prompt..."
                                        className="min-h-[80px]"
                                    />
                                </div>

                                    <Select
                                        value={prompt.category}
                                        onValueChange={(value) => setPrompt((prev) => ({...prev, category: value}))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="content">Prompt Content</Label>
                                    <Textarea
                                        id="content"
                                        value={prompt.content}
                                        onChange={(e) => setPrompt((prev) => ({...prev, content: e.target.value}))}
                                        placeholder="Write your prompt here. Use {parameter_name} for dynamic values."
                                        className="min-h-[150px]"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Use curly braces around parameter names, e.g., {"{genre}"}, {"{character}"}
                                    </p>
                                </div>

                                <div>
                                    <Label>Tags</Label>
                                    <div className="flex gap-2 mb-2">
                                        <Input
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            placeholder="Add a tag"
                                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                        />
                                        <Button onClick={addTag} size="sm">
                                            <Plus className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {prompt.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                                {tag}
                                                <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)}/>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="parameters" className="space-y-4">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            value={newParameter.name}
                                            onChange={(e) => setNewParameter((prev) => ({
                                                ...prev,
                                                name: e.target.value
                                            }))}
                                            placeholder="Parameter name"
                                        />
                                        <Select
                                            value={newParameter.type}
                                            onValueChange={(value: "text" | "number" | "select") =>
                                                setNewParameter((prev) => ({...prev, type: value}))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="text">Text</SelectItem>
                                                <SelectItem value="number">Number</SelectItem>
                                                <SelectItem value="select">Select</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Input
                                        value={newParameter.defaultValue}
                                        onChange={(e) => setNewParameter((prev) => ({
                                            ...prev,
                                            defaultValue: e.target.value
                                        }))}
                                        placeholder="Default value"
                                    />

                                    <Input
                                        value={newParameter.description || ""}
                                        onChange={(e) => setNewParameter((prev) => ({
                                            ...prev,
                                            description: e.target.value
                                        }))}
                                        placeholder="Description (optional)"
                                    />

                                    <Button onClick={addParameter} size="sm" className="w-full">
                                        <Plus className="h-4 w-4 mr-2"/>
                                        Add Parameter
                                    </Button>
                                </div>

                                <ScrollArea className="h-48">
                                    <div className="space-y-2">
                                        {prompt.parameters.map((param, index) => (
                                            <div key={index} className="p-3 border rounded-lg">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium">{param.name}</span>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {param.type}
                                                        </Badge>
                                                        <X className="h-4 w-4 cursor-pointer text-red-500"
                                                           onClick={() => removeParameter(index)}/>
                                                    </div>
                                                </div>
                                                <div
                                                    className="text-sm text-gray-600">Default: {param.defaultValue || "None"}</div>
                                                {param.description && <div
                                                    className="text-xs text-gray-500 mt-1">{param.description}</div>}
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </TabsContent>

                            <TabsContent value="constraints" className="space-y-4">
                                <div className="space-y-4">
                                    <Select
                                        value={newConstraint.type}
                                        onValueChange={(value: "length" | "format" | "content" | "style") =>
                                            setNewConstraint((prev) => ({...prev, type: value}))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Constraint type"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="length">Length</SelectItem>
                                            <SelectItem value="format">Format</SelectItem>
                                            <SelectItem value="content">Content</SelectItem>
                                            <SelectItem value="style">Style</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Input
                                        value={newConstraint.value}
                                        onChange={(e) => setNewConstraint((prev) => ({...prev, value: e.target.value}))}
                                        placeholder="Constraint value"
                                    />

                                    <Input
                                        value={newConstraint.description}
                                        onChange={(e) => setNewConstraint((prev) => ({
                                            ...prev,
                                            description: e.target.value
                                        }))}
                                        placeholder="Description"
                                    />

                                    <Button onClick={addConstraint} size="sm" className="w-full">
                                        <Plus className="h-4 w-4 mr-2"/>
                                        Add Constraint
                                    </Button>
                                </div>

                                <ScrollArea className="h-48">
                                    <div className="space-y-2">
                                        {prompt.constraints.map((constraint, index) => (
                                            <div key={index} className="p-3 border rounded-lg">
                                                <div className="flex items-center justify-between mb-1">
                                                    <Badge variant="outline" className="capitalize">
                                                        {constraint.type}
                                                    </Badge>
                                                    <X className="h-4 w-4 cursor-pointer text-red-500"
                                                       onClick={() => removeConstraint(index)}/>
                                                </div>
                                                <div className="text-sm font-medium">{constraint.value}</div>
                                                <div
                                                    className="text-xs text-gray-500 mt-1">{constraint.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Preview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                        <CardDescription>
                            {previewMode ? "How your prompt will appear" : "Live preview with defaults"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {prompt.title && (
                            <div className="mb-4">
                                <h4 className="font-medium text-lg">{prompt.title}</h4>
                                {prompt.category && (
                                    <Badge variant="outline" className="mt-1">
                                        {prompt.category}
                                    </Badge>
                                )}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <Label>Generated Prompt</Label>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg min-h-[150px]">
                  <pre className="text-sm whitespace-pre-wrap">
                    {prompt.content ? generatePreview() : "Start writing your prompt to see the preview..."}
                  </pre>
                                </div>
                            </div>

                            {prompt.parameters.length > 0 && (
                                <div>
                                    <Label>Parameters ({prompt.parameters.length})</Label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {prompt.parameters.map((param, index) => (
                                            <div key={index} className="p-2 border rounded text-sm">
                                                <div className="font-medium">{param.name}</div>
                                                <div className="text-gray-500 text-xs">{param.type}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {prompt.constraints.length > 0 && (
                                <div>
                                    <Label>Constraints ({prompt.constraints.length})</Label>
                                    <div className="space-y-1 mt-2">
                                        {prompt.constraints.map((constraint, index) => (
                                            <div key={index}
                                                 className="text-sm p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                                                <span
                                                    className="font-medium capitalize">{constraint.type}:</span> {constraint.value}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {prompt.tags.length > 0 && (
                                <div>
                                    <Label>Tags</Label>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {prompt.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
