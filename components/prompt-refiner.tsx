"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Sparkles, RefreshCw, CheckCircle, AlertCircle, Lightbulb, Settings } from "lucide-react"
import LLMSelectorModal from "@/components/llm-selector-modal"
import { useAuth } from "@/components/auth-provider"
import { listPrompts, type LLMDoc, type APIKeyDoc } from "@/lib/db"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface RefinementSuggestion {
  type: "clarity" | "specificity" | "effectiveness" | "structure"
  title: string
  description: string
  before: string
  after: string
  impact: "high" | "medium" | "low"
}

interface AnalysisResult {
  score: number
  suggestions: RefinementSuggestion[]
  strengths: string[]
  weaknesses: string[]
  refinedPrompt: string
}

export default function PromptRefiner() {
  const [selectedPromptId, setSelectedPromptId] = useState<string>("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [extraInstructions, setExtraInstructions] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [mode, setMode] = useState<"existing" | "custom">("existing")
  const [showLLMModal, setShowLLMModal] = useState(false)
  const [selectedLLM, setSelectedLLM] = useState<(LLMDoc & { id: string }) | null>(null)
  const [selectedAPIKey, setSelectedAPIKey] = useState<(APIKeyDoc & { id: string }) | null>(null)
  const { user } = useAuth()
  const [prompts, setPrompts] = useState<any[]>([])
  const [promptsLoading, setPromptsLoading] = useState(false)
  const [promptsError, setPromptsError] = useState<string | null>(null)
  const [showRefinedModal, setShowRefinedModal] = useState(false)

  useEffect(() => {
    if (!user) return
    setPromptsLoading(true)
    setPromptsError(null)
    listPrompts(user.uid)
      .then((data) => setPrompts(data))
      .catch(() => setPromptsError("Failed to load prompts"))
      .finally(() => setPromptsLoading(false))
  }, [user])

  const selectedPrompt = prompts.find((p) => p.id === selectedPromptId)
  const currentPrompt = mode === "existing" ? selectedPrompt?.content || "" : customPrompt

  const analyzePrompt = async () => {
    if (!currentPrompt.trim()) return

    setIsAnalyzing(true)
    try {
      // Call the backend API endpoint
      const response = await fetch('/api/refine-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.uid,
          llmId: selectedLLM?.id,
          apiKeyId: selectedAPIKey?.id,
          prompt: currentPrompt,
          extraInstructions: extraInstructions.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to refine prompt')
      }

      const result: AnalysisResult = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error("Analysis failed:", error)
      // Fallback to mock data for demo purposes
      const mockResult: AnalysisResult = {
        score: Math.floor(Math.random() * 30) + 70,
        suggestions: [
          {
            type: "clarity",
            title: "Add specific context",
            description: "The prompt lacks specific context that would help the AI understand the desired output format.",
            before: "Write a story about a character",
            after: "Write a 500-word short story about a character",
            impact: "high",
          },
          {
            type: "specificity",
            title: "Define the genre",
            description: "Specifying the genre would help generate more targeted content.",
            before: "discovers something",
            after: "discovers a mysterious artifact in a fantasy setting",
            impact: "medium",
          },
        ],
        strengths: [
          "Clear action-oriented instruction",
          "Open-ended enough to allow creativity",
        ],
        weaknesses: [
          "Lacks specific output format requirements",
          "Missing context about target audience",
        ],
        refinedPrompt: `Write a 500-word fantasy short story about a young adventurer who discovers a mysterious glowing artifact in an ancient ruin. The story should include dialogue, vivid descriptions of the setting, and end with a cliffhanger that sets up a larger adventure. Target audience: young adults. Tone: exciting and mysterious.`,
      }
      setAnalysisResult(mockResult)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleLLMSelect = (llm: LLMDoc & { id: string }, apiKey?: APIKeyDoc & { id: string }) => {
    setSelectedLLM(llm)
    setSelectedAPIKey(apiKey || null)
  }

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "default"
      default:
        return "outline"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Prompt Input</CardTitle>
                <CardDescription>Select an existing prompt or enter a custom one for analysis</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowLLMModal(true)}
                className="flex items-center gap-2"
              >
        {/* Prompt Input Card */}
                <Settings className="h-4 w-4" />
                {selectedLLM ? selectedLLM.name : "Select Model"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedLLM && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{selectedLLM.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedLLM.provider}
                  </Badge>
                  {!selectedLLM.isPublic && (
                    <Badge variant="secondary" className="text-xs">Custom</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{selectedLLM.description}</p>
                {selectedAPIKey && (
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                    Using API key: {selectedAPIKey.name}
                  </div>
                )}
              </div>
            )}
            <Tabs value={mode} onValueChange={(value: string) => setMode(value as "existing" | "custom")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="existing">Existing Prompt</TabsTrigger>
                <TabsTrigger value="custom">Custom Prompt</TabsTrigger>
              </TabsList>
              <TabsContent value="existing">
                {promptsLoading ? (
                  <div className="text-sm text-gray-500">Loading prompts...</div>
                ) : promptsError ? (
                  <div className="text-sm text-red-600">{promptsError}</div>
                ) : (
                  <Select value={selectedPromptId} onValueChange={setSelectedPromptId} disabled={prompts.length === 0}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a prompt to analyze" />
                    </SelectTrigger>
                    <SelectContent>
                      {prompts.map((prompt) => (
                        <SelectItem key={prompt.id} value={prompt.id}>
                          {prompt.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {selectedPrompt && (
                  <div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm max-h-40 overflow-y-auto">
                      {selectedPrompt.content}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{selectedPrompt.category}</Badge>
                      {selectedPrompt.tags?.slice(0, 2).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="custom" className="space-y-4">
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Enter your prompt here for analysis..."
                  className="min-h-[150px]"
                />
              </TabsContent>
            </Tabs>

            <div>
              <label className="text-sm font-medium mb-2 block">Extra Instructions (Optional)</label>
              <Textarea
                value={extraInstructions}
                onChange={(e) => setExtraInstructions(e.target.value)}
                placeholder="Add any specific instructions for refining this prompt (e.g., make it more concise, focus on technical accuracy, adjust tone for beginners, etc.)"
                className="min-h-[80px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                These instructions will guide the AI in how to refine your prompt
              </p>
            </div>

            <Button
              onClick={analyzePrompt}
              disabled={!currentPrompt.trim() || isAnalyzing || !selectedLLM}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing with {selectedLLM?.name}...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Refine Prompt
                </>
              )}
            </Button>

            {!selectedLLM && (
              <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
                Please select a language model to begin analysis
              </p>
            )}
            {selectedLLM && !selectedAPIKey && (
              <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
                Consider selecting an API key for enhanced functionality
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              {selectedLLM
                ? `AI-powered insights from ${selectedLLM.name}`
                : "AI-powered insights and improvement suggestions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analysisResult ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Overall Score</span>
                  <span className={`text-lg font-bold ${getScoreColor(analysisResult.score)}`}>
                    {analysisResult.score}/100
                  </span>
                </div>
                <Progress value={analysisResult.score} className="h-2 mb-4" />
                <Tabs defaultValue="suggestions" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                    <TabsTrigger value="strengths">Strengths</TabsTrigger>
                    <TabsTrigger value="refined">Refined</TabsTrigger>
                  </TabsList>
                  <TabsContent value="suggestions" className="space-y-4">
                    {analysisResult.suggestions.map((suggestion, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <h4 className="font-medium text-sm">{suggestion.title}</h4>
                        <Badge variant={getImpactBadge(suggestion.impact) as any}>{suggestion.impact} impact</Badge>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{suggestion.description}</p>
                        {suggestion.before && suggestion.after && (
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs font-medium text-red-600">Before:</span>
                              <div className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                {suggestion.before}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-green-600">After:</span>
                              <div className="text-xs bg-green-50 dark:bg-green-900/20 p-2 rounded">
                                {suggestion.after}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="strengths" className="space-y-2">
                    {analysisResult.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </div>
                    ))}
                    {analysisResult.weaknesses.length > 0 && (
                      <>
                        <div className="text-sm font-medium mt-4 mb-2">Areas for Improvement:</div>
                        {analysisResult.weaknesses.map((weakness, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded"
                          >
                            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{weakness}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </TabsContent>
                  <TabsContent value="refined" className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">Refined Prompt</span>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="ml-auto"
                          onClick={() => setShowRefinedModal(true)}
                        >
                          View Large
                        </Button>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm overflow-hidden">
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              pre: ({ children, ...props }) => (
                                <pre className="whitespace-pre-wrap break-words overflow-x-auto bg-gray-100 dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700" {...props}>{children}</pre>
                              ),
                              code: ({ children, className, ...props }) => {
                                const match = /language-(\w+)/.exec(className || "");
                                const isInline = !(className && match);
                                if (!isInline && match) {
                                  return (
                                    <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div">
                                      {String(children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                  );
                                }
                                return (
                                  <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded text-[1em] font-mono" {...props}>{children}</code>
                                );
                              },
                              p: ({ children, ...props }) => (
                                <p className="break-words" {...props}>{children}</p>
                              ),
                              strong: ({ children, ...props }) => (
                                <strong className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded" {...props}>{children}</strong>
                              ),
                              em: ({ children, ...props }) => (
                                <em className="bg-blue-100 dark:bg-blue-900 px-1 rounded" {...props}>{children}</em>
                              )
                            }}
                          >
                            {analysisResult.refinedPrompt}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Run analysis to see AI-powered suggestions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <LLMSelectorModal
        open={showLLMModal}
        onOpenChangeAction={setShowLLMModal}
        onSelectAction={handleLLMSelect}
        currentSelection={selectedLLM?.id}
        context="refiner"
      />

      {/* Modal for a large refined prompt view */}
      {showRefinedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-4xl max-h-max w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              onClick={() => setShowRefinedModal(false)}
              aria-label="Close"
            >
              <span>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </span>
            </button>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <span>Refined Prompt</span>
            </h3>
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  pre: function PreComponent({ children, ...props }) {
                    return (
                      <pre className="whitespace-pre-wrap break-words overflow-x-auto bg-gray-100 dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700" {...props}>{children}</pre>
                    );
                  },
                  code: function CodeComponent({ children, className, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const isInline = !(className && match);
                    if (!isInline && match) {
                      return (
                        <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div">
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      );
                    }
                    return (
                      <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded text-[1em] font-mono" {...props}>{children}</code>
                    );
                  },
                  p: function PComponent({ children, ...props }) {
                    return <p className="break-words" {...props}>{children}</p>;
                  },
                  strong: function StrongComponent({ children, ...props }) {
                    return <strong className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded" {...props}>{children}</strong>;
                  },
                  em: function EmComponent({ children, ...props }) {
                    return <em className="bg-blue-100 dark:bg-blue-900 px-1 rounded" {...props}>{children}</em>;
                }}}
              >
                {analysisResult?.refinedPrompt}
              </ReactMarkdown>
            </div>
          </div>
        </div>
        )}
    </div>
    )
}
