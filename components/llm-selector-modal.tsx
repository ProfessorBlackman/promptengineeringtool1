"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Zap, Clock, Star, Brain, Code, Sparkles, Plus, Key, Globe, Database } from "lucide-react"
import { listLLMs, listPublicLLMs, listAPIKeys, type LLMDoc, type APIKeyDoc } from "@/lib/db"
import { useAuth } from "@/components/auth-provider"
import AddLLMModal from "@/components/add-llm-modal"
import AddAPIKeyModal from "@/components/add-api-key-modal"

interface LLMSelectorModalProps {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  onSelectAction: (llm: LLMDoc & { id: string }, apiKey?: APIKeyDoc & { id: string }) => void
  currentSelection?: string
  context?: "refiner" | "tester" | "general"
}

export default function LLMSelectorModal({
  open,
  onOpenChangeAction,
  onSelectAction,
  currentSelection,
  context = "general",
}: LLMSelectorModalProps) {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProvider, setSelectedProvider] = useState("all")
  const [selectedAPIKeyId, setSelectedAPIKeyId] = useState("none")

  // Data states
  const [userLLMs, setUserLLMs] = useState<(LLMDoc & { id: string })[]>([])
  const [publicLLMs, setPublicLLMs] = useState<(LLMDoc & { id: string })[]>([])
  const [apiKeys, setAPIKeys] = useState<(APIKeyDoc & { id: string })[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [showAddLLMModal, setShowAddLLMModal] = useState(false)
  const [showAddAPIKeyModal, setShowAddAPIKeyModal] = useState(false)

  // Fetch data when the modal opens
  useEffect(() => {
    if (!open || !user) return

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [userLLMsData, publicLLMsData, apiKeysData] = await Promise.all([
          listLLMs(user.uid),
          listPublicLLMs(),
          listAPIKeys(user.uid)
        ])

        setUserLLMs(userLLMsData)
        setPublicLLMs(publicLLMsData)
        setAPIKeys(apiKeysData)
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError("Failed to load models and API keys")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [open, user])

  const allLLMs = [...userLLMs, ...publicLLMs]
  const providers = ["all", ...new Set(allLLMs.map((llm) => llm.provider))]

  const filteredLLMs = allLLMs.filter((llm) => {
    const matchesSearch =
      llm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      llm.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      llm.capabilities.some((cap) => cap.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesProvider = selectedProvider === "all" || llm.provider === selectedProvider
    return matchesSearch && matchesProvider
  })

  const recommendedLLMs = publicLLMs

  const otherLLMs = filteredLLMs.filter((llm) => !recommendedLLMs.some(r => r.id === llm.id))

  const selectedAPIKey = apiKeys.find(key => key.id === selectedAPIKeyId && selectedAPIKeyId !== "none")

  const handleSelect = (llm: LLMDoc & { id: string }) => {
    onSelectAction(llm, selectedAPIKey)
    onOpenChangeAction(false)
  }

  const handleLLMAdded = async () => {
    if (!user) return
    try {
      const userLLMsData = await listLLMs(user.uid)
      setUserLLMs(userLLMsData)
    } catch (err) {
      console.error("Failed to refresh LLMs:", err)
    }
  }

  const handleAPIKeyAdded = async () => {
    if (!user) return
    try {
      const apiKeysData = await listAPIKeys(user.uid)
      setAPIKeys(apiKeysData)
    } catch (err) {
      console.error("Failed to refresh API keys:", err)
    }
  }

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case "free":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "freemium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "paid":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getSpeedIcon = (speed: string) => {
    switch (speed) {
      case "fast":
        return <Zap className="h-3 w-3 text-green-600" />
      case "medium":
        return <Clock className="h-3 w-3 text-yellow-600" />
      case "slow":
        return <Clock className="h-3 w-3 text-red-600" />
      default:
        return <Clock className="h-3 w-3 text-gray-600" />
    }
  }

  const getContextRecommendation = () => {
    switch (context) {
      case "refiner":
        return "For prompt refinement, we recommend models with strong analytical capabilities."
      case "tester":
        return "For testing, faster models can provide quicker feedback during development."
      default:
        return "Choose a model that best fits your specific use case."
    }
  }

  const renderLLMCard = (llm: LLMDoc & { id: string }, isRecommended = false) => (
    <div
      key={llm.id}
      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
        currentSelection === llm.id ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200" : ""
      }`}
      onClick={() => handleSelect(llm)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {userLLMs.some(u => u.id === llm.id) ? (
            <Database className="h-4 w-4 text-blue-600" />
          ) : (
            <Globe className="h-4 w-4 text-green-600" />
          )}
          <h4 className="font-medium">{llm.name}</h4>
          <Badge variant="outline">{llm.provider}</Badge>
          {isRecommended && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Recommended
            </Badge>
          )}
          {!llm.isPublic && (
            <Badge variant="secondary" className="text-xs">Custom</Badge>
          )}
        </div>
        {/*<div className="flex items-center gap-2">*/}
        {/*  <Badge className={getPricingColor(llm.pricing)}>{llm.pricing}</Badge>*/}
        {/*  {getSpeedIcon(llm.speed)}*/}
        {/*  <div className="flex items-center gap-1">*/}
        {/*    <Star className="h-3 w-3 text-yellow-500" />*/}
        {/*    <span className="text-xs">{llm.quality}</span>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{llm.description}</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-xs font-medium text-gray-500">Capabilities:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {llm.capabilities.slice(0, 3).map((capability) => (
              <Badge key={capability} variant="secondary" className="text-xs">
                {capability}
              </Badge>
            ))}
            {llm.capabilities.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{llm.capabilities.length - 3}
              </Badge>
            )}
          </div>
        </div>

        <div>
          <span className="text-xs font-medium text-gray-500">Best for:</span>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {llm.strengths.slice(0, 2).join(", ")}
          </div>
        </div>
      </div>

      {llm.apiUrl && (
        <div className="mt-2 pt-2 border-t">
          <span className="text-xs font-medium text-gray-500">API URL:</span>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-mono">
            {llm.apiUrl}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChangeAction}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Select Language Model</DialogTitle>
            <DialogDescription>{getContextRecommendation()}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* API Key Selection */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  <span className="font-medium">API Key (Optional)</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddAPIKeyModal(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add API Key
                </Button>
              </div>

              <Select value={selectedAPIKeyId} onValueChange={setSelectedAPIKeyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an API key (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No API key</SelectItem>
                  {apiKeys.filter(key => key.isActive).map((key) => (
                    <SelectItem key={key.id} value={key.id}>
                      {key.name} ({key.provider})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedAPIKey && (
                <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                  Selected: {selectedAPIKey.name} for {selectedAPIKey.provider}
                </div>
              )}
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                {providers.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider === "all" ? "All Providers" : provider}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                onClick={() => setShowAddLLMModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Model
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading models...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                <p>{error}</p>
              </div>
            ) : (
              <Tabs defaultValue="recommended" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="recommended">
                    Recommended ({recommendedLLMs.length})
                  </TabsTrigger>
                  <TabsTrigger value="all">
                    All Models ({filteredLLMs.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="recommended">
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {recommendedLLMs.length > 0 ? (
                        recommendedLLMs.map((llm) => renderLLMCard(llm, true))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No recommended models found for your search.</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="all">
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {filteredLLMs.length > 0 ? (
                        <>
                          {recommendedLLMs.map((llm) => renderLLMCard(llm, true))}
                          {otherLLMs.map((llm) => renderLLMCard(llm, false))}
                        </>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No models found matching your criteria.</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChangeAction(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddLLMModal
        open={showAddLLMModal}
        onOpenChangeAction={setShowAddLLMModal}
        onLLMAddedAction={handleLLMAdded}
      />

      <AddAPIKeyModal
        open={showAddAPIKeyModal}
        onOpenChangeAction={setShowAddAPIKeyModal}
        onAPIKeyAddedAction={handleAPIKeyAdded}
      />
    </>
  )
}
