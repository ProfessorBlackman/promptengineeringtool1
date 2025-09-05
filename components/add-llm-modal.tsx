"use client"

import React, {useState} from "react"
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Badge} from "@/components/ui/badge"
import {Plus, X, Globe} from "lucide-react"
import {addLLM} from "@/lib/db"
import {useAuth} from "@/components/auth-provider"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"

interface AddLLMModalProps {
    open: boolean
    onOpenChangeAction: (open: boolean) => void
    onLLMAddedAction: () => void
}

export default function AddLLMModal({open, onOpenChangeAction, onLLMAddedAction}: AddLLMModalProps) {
    const {user} = useAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        provider: "",
        description: "",
        modelId: "",
        endpoint: "",
        apiUrl: "",
    })
    const [capabilities, setCapabilities] = useState<string[]>([])
    const [strengths, setStrengths] = useState<string[]>([])
    const [newCapability, setNewCapability] = useState("")
    const [newStrength, setNewStrength] = useState("")
    const [template, setTemplate] = useState<string>("openai")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || !formData.name || !formData.provider || !formData.modelId || !formData.apiUrl) return

        setLoading(true)
        try {
            const llmData = {
                ...formData,
                capabilities,
                strengths,
                isPublic: false,
                template
            }

            await addLLM(user.uid, llmData)

            // Reset form
            setFormData({
                name: "",
                provider: "",
                description: "",
                modelId: "",
                endpoint: "",
                apiUrl: ""
            })
            setCapabilities([])
            setStrengths([])
            setTemplate("openai")

            onLLMAddedAction()
            onOpenChangeAction(false)
        } catch (error) {
            console.error("Failed to add LLM:", error)
        } finally {
            setLoading(false)
        }
    }

    const addCapability = () => {
        if (newCapability.trim() && !capabilities.includes(newCapability.trim())) {
            setCapabilities([...capabilities, newCapability.trim()])
            setNewCapability("")
        }
    }

    const addStrength = () => {
        if (newStrength.trim() && !strengths.includes(newStrength.trim())) {
            setStrengths([...strengths, newStrength.trim()])
            setNewStrength("")
        }
    }

    const removeCapability = (capability: string) => {
        setCapabilities(capabilities.filter(c => c !== capability))
    }

    const removeStrength = (strength: string) => {
        setStrengths(strengths.filter(s => s !== strength))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Language Model</DialogTitle>
                    <DialogDescription>
                        Add a custom language model configuration to your collection
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                            {/*<TabsTrigger value="api">API Configuration</TabsTrigger>*/}
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Name *</label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="e.g., GPT-4 Turbo"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Provider *</label>
                                    <Input
                                        value={formData.provider}
                                        onChange={(e) => setFormData({...formData, provider: e.target.value})}
                                        placeholder="e.g., OpenAI"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Describe the model's capabilities and use cases"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Model ID *</label>
                                    <Input
                                        value={formData.modelId}
                                        onChange={(e) => setFormData({...formData, modelId: e.target.value})}
                                        placeholder="e.g., gpt-4-turbo"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Quick Templates</label>
                                    <Select onValueChange={setTemplate}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Load preset"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="openai">OpenAI Template</SelectItem>
                                            <SelectItem value="anthropic">Anthropic Template</SelectItem>
                                            <SelectItem value="gemini">Gemini Template</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium">API URL * <Globe
                                    className="h-4 w-4 inline ml-1"/></label>
                                <Input
                                    value={formData.apiUrl}
                                    onChange={(e) => setFormData({...formData, apiUrl: e.target.value})}
                                    placeholder="https://api.openai.com/v1/chat/completions"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">The complete URL for making API requests to
                                    this model</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="capabilities" className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Capabilities</label>
                                <div className="flex gap-2 mb-2">
                                    <Input
                                        value={newCapability}
                                        onChange={(e) => setNewCapability(e.target.value)}
                                        placeholder="e.g., Text Generation"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCapability())}
                                    />
                                    <Button type="button" size="sm" onClick={addCapability}>
                                        <Plus className="h-4 w-4"/>
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {capabilities.map((capability) => (
                                        <Badge key={capability} variant="secondary" className="flex items-center gap-1">
                                            {capability}
                                            <X className="h-3 w-3 cursor-pointer"
                                               onClick={() => removeCapability(capability)}/>
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Strengths</label>
                                <div className="flex gap-2 mb-2">
                                    <Input
                                        value={newStrength}
                                        onChange={(e) => setNewStrength(e.target.value)}
                                        placeholder="e.g., Complex reasoning"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStrength())}
                                    />
                                    <Button type="button" size="sm" onClick={addStrength}>
                                        <Plus className="h-4 w-4"/>
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {strengths.map((strength) => (
                                        <Badge key={strength} variant="secondary" className="flex items-center gap-1">
                                            {strength}
                                            <X className="h-3 w-3 cursor-pointer"
                                               onClick={() => removeStrength(strength)}/>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        {/*<TabsContent value="api" className="space-y-4">*/}
                        {/*  <div className="flex items-center space-x-2">*/}
                        {/*    <input*/}
                        {/*      type="checkbox"*/}
                        {/*      id="enableRequestStructure"*/}
                        {/*      checked={enableRequestStructure}*/}
                        {/*      onChange={(e) => setEnableRequestStructure(e.target.checked)}*/}
                        {/*    />*/}
                        {/*    <label htmlFor="enableRequestStructure" className="text-sm font-medium">*/}
                        {/*      <Code className="h-4 w-4 inline mr-1" />*/}
                        {/*      Configure Request Structure*/}
                        {/*    </label>*/}
                        {/*  </div>*/}

                        {/*  /!*{enableRequestStructure && (*!/*/}
                        {/*  /!*  <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">*!/*/}
                        {/*  /!*    <div className="grid grid-cols-2 gap-4">*!/*/}
                        {/*  /!*      <div>*!/*/}
                        {/*  /!*        <label className="text-sm font-medium">HTTP Method</label>*!/*/}
                        {/*  /!*        <Select value={requestStructure.method} onValueChange={(value: any) =>*!/*/}
                        {/*  /!*          setRequestStructure({ ...requestStructure, method: value })}>*!/*/}
                        {/*  /!*          <SelectTrigger>*!/*/}
                        {/*  /!*            <SelectValue />*!/*/}
                        {/*  /!*          </SelectTrigger>*!/*/}
                        {/*  /!*          <SelectContent>*!/*/}
                        {/*  /!*            <SelectItem value="POST">POST</SelectItem>*!/*/}
                        {/*  /!*            <SelectItem value="GET">GET</SelectItem>*!/*/}
                        {/*  /!*            <SelectItem value="PUT">PUT</SelectItem>*!/*/}
                        {/*  /!*            <SelectItem value="PATCH">PATCH</SelectItem>*!/*/}
                        {/*  /!*          </SelectContent>*!/*/}
                        {/*  /!*        </Select>*!/*/}
                        {/*  /!*      </div>*!/*/}
                        {/*  /!*      <div>*!/*/}
                        {/*  /!*        <label className="text-sm font-medium">Quick Templates</label>*!/*/}
                        {/*  /!*        <Select onValueChange={loadPresetTemplate}>*!/*/}
                        {/*  /!*          <SelectTrigger>*!/*/}
                        {/*  /!*            <SelectValue placeholder="Load preset" />*!/*/}
                        {/*  /!*          </SelectTrigger>*!/*/}
                        {/*  /!*          <SelectContent>*!/*/}
                        {/*  /!*            <SelectItem value="openai">OpenAI Template</SelectItem>*!/*/}
                        {/*  /!*            <SelectItem value="anthropic">Anthropic Template</SelectItem>*!/*/}
                        {/*  /!*            <SelectItem value="gemini">Gemini Template</SelectItem>*!/*/}
                        {/*  /!*            <SelectItem value="custom">Custom Template</SelectItem>*!/*/}
                        {/*  /!*          </SelectContent>*!/*/}
                        {/*  /!*        </Select>*!/*/}
                        {/*  /!*      </div>*!/*/}
                        {/*  /!*    </div>*!/*/}
                        {/*  */}
                        {/*  /!*    <div>*!/*/}
                        {/*  /!*      <label className="text-sm font-medium">Headers</label>*!/*/}
                        {/*  /!*      <div className="flex gap-2 mb-2">*!/*/}
                        {/*  /!*        <Input*!/*/}
                        {/*  /!*          value={newHeaderKey}*!/*/}
                        {/*  /!*          onChange={(e) => setNewHeaderKey(e.target.value)}*!/*/}
                        {/*  /!*          placeholder="Header name"*!/*/}
                        {/*  /!*          className="flex-1"*!/*/}
                        {/*  /!*        />*!/*/}
                        {/*  /!*        <Input*!/*/}
                        {/*  /!*          value={newHeaderValue}*!/*/}
                        {/*  /!*          onChange={(e) => setNewHeaderValue(e.target.value)}*!/*/}
                        {/*  /!*          placeholder="Header value"*!/*/}
                        {/*  /!*          className="flex-1"*!/*/}
                        {/*  /!*        />*!/*/}
                        {/*  /!*        <Button type="button" size="sm" onClick={addHeader}>*!/*/}
                        {/*  /!*          <Plus className="h-4 w-4" />*!/*/}
                        {/*  /!*        </Button>*!/*/}
                        {/*  /!*      </div>*!/*/}
                        {/*  /!*      <div className="space-y-1">*!/*/}
                        {/*  /!*        {Object.entries(requestStructure.headers).map(([key, value]) => (*!/*/}
                        {/*  /!*          <div key={key} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded text-sm">*!/*/}
                        {/*  /!*            <span><strong>{key}:</strong> {value}</span>*!/*/}
                        {/*  /!*            <X className="h-3 w-3 cursor-pointer" onClick={() => removeHeader(key)} />*!/*/}
                        {/*  /!*          </div>*!/*/}
                        {/*  /!*        ))}*!/*/}
                        {/*  /!*      </div>*!/*/}
                        {/*  /!*    </div>*!/*/}
                        {/*  */}
                        {/*  /!*    /!*<div>*!/*!/*/}
                        {/*  /!*    /!*  <label className="text-sm font-medium">Request Body Template (JSON)</label>*!/*!/*/}
                        {/*  /!*    /!*  <Textarea*!/*!/*/}
                        {/*  /!*    /!*    value={bodyTemplateJson}*!/*!/*/}
                        {/*  /!*    /!*    onChange={(e) => setBodyTemplateJson(e.target.value)}*!/*!/*/}
                        {/*  /!*    /!*    placeholder='{ "model": "{{modelId}}", "prompt": "{{prompt}}" }'*!/*!/*/}
                        {/*  /!*    /!*    rows={8}*!/*!/*/}
                        {/*  /!*    /!*    className="font-mono text-sm"*!/*!/*/}
                        {/*  /!*    /!*  />*!/*!/*/}
                        {/*  /!*    /!*  <p className="text-xs text-gray-500 mt-1">*!/*!/*/}
                        {/*  /!*    /!*    Use variables: {`{{modelId}}`}, {`{{prompt}}`}, {`{{apiKey}}`}*!/*!/*/}
                        {/*  /!*    /!*  </p>*!/*!/*/}
                        {/*  /!*    /!*</div>*!/*!/*/}
                        {/*  */}
                        {/*  /!*    <div className="grid grid-cols-3 gap-4">*!/*/}
                        {/*  /!*      <div>*!/*/}
                        {/*  /!*        <label className="text-sm font-medium">Content Path</label>*!/*/}
                        {/*  /!*        <Input*!/*/}
                        {/*  /!*          value={requestStructure.responseMapping.contentPath}*!/*/}
                        {/*  /!*          onChange={(e) => setRequestStructure({*!/*/}
                        {/*  /!*            ...requestStructure,*!/*/}
                        {/*  /!*            responseMapping: { ...requestStructure.responseMapping, contentPath: e.target.value }*!/*/}
                        {/*  /!*          })}*!/*/}
                        {/*  /!*          placeholder="choices[0].message.content"*!/*/}
                        {/*  /!*        />*!/*/}
                        {/*  /!*      </div>*!/*/}
                        {/*  /!*      <div>*!/*/}
                        {/*  /!*        <label className="text-sm font-medium">Error Path</label>*!/*/}
                        {/*  /!*        <Input*!/*/}
                        {/*  /!*          value={requestStructure.responseMapping.errorPath}*!/*/}
                        {/*  /!*          onChange={(e) => setRequestStructure({*!/*/}
                        {/*  /!*            ...requestStructure,*!/*/}
                        {/*  /!*            responseMapping: { ...requestStructure.responseMapping, errorPath: e.target.value }*!/*/}
                        {/*  /!*          })}*!/*/}
                        {/*  /!*          placeholder="error.message"*!/*/}
                        {/*  /!*        />*!/*/}
                        {/*  /!*      </div>*!/*/}
                        {/*  /!*      <div>*!/*/}
                        {/*  /!*        <label className="text-sm font-medium">Usage Path</label>*!/*/}
                        {/*  /!*        <Input*!/*/}
                        {/*  /!*          value={requestStructure.responseMapping.usagePath}*!/*/}
                        {/*  /!*          onChange={(e) => setRequestStructure({*!/*/}
                        {/*  /!*            ...requestStructure,*!/*/}
                        {/*  /!*            responseMapping: { ...requestStructure.responseMapping, usagePath: e.target.value }*!/*/}
                        {/*  /!*          })}*!/*/}
                        {/*  /!*          placeholder="usage"*!/*/}
                        {/*  /!*        />*!/*/}
                        {/*  /!*      </div>*!/*/}
                        {/*  /!*    </div>*!/*/}
                        {/*  /!*  </div>*!/*/}
                        {/*  /!*)}*!/*/}
                        {/*</TabsContent>*/}
                    </Tabs>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => onOpenChangeAction(false)}>
                            Cancel
                        </Button>
                        <Button type="submit"
                                disabled={loading || !formData.name || !formData.provider || !formData.modelId || !formData.apiUrl}>
                            {loading ? "Adding..." : "Add Model"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
