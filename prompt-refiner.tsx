"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Sparkles, RefreshCw, CheckCircle, AlertCircle, Lightbulb } from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Prompt } from "@/app/dashboard/page"

interface PromptRefinerProps {
  prompts: Prompt[]
  onUpdatePrompt: (id: string, updates: Partial<Prompt>) => void
}

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

export function PromptRefiner({ prompts, onUpdatePrompt }: PromptRefinerProps) {
  const [selectedPromptId, setSelectedPromptId] = useState<string>("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [mode, setMode] = useState<"existing" | "custom">("existing")

  const selectedPrompt = prompts.find((p) => p.id === selectedPromptId)
  const currentPrompt = mode === "existing" ? selectedPrompt?.content || "" : customPrompt

  const analyzePrompt = async () => {
    if (!currentPrompt.trim()) return

    setIsAnalyzing(true)
    try {
      const analysisPrompt = `
Analyze the following prompt and provide detailed feedback for improvement:

PROMPT TO ANALYZE:
"${currentPrompt}"

Please provide your analysis in the following JSON format:
{
  "score": <number between 0-100>,
  "strengths": [<array of strings describing what works well>],
  "weaknesses": [<array of strings describing areas for improvement>],
  "suggestions": [
    {
      "type": "<clarity|specificity|effectiveness|structure>",
      "title": "<brief title>",
      "description": "<detailed explanation>",
      "before": "<problematic part>",
      "after": "<improved version>",
      "impact": "<high|medium|low>"
    }
  ],
  "refinedPrompt": "<improved version of the entire prompt>"
}

Focus on:
1. Clarity and readability
2. Specificity and precision
3. Effectiveness for AI models
4. Structure and organization
5. Potential ambiguities
6. Missing context or constraints
`

      const { text } = await generateText({
        model: openai("gpt-4"),
        prompt: analysisPrompt,
      })

      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0])
        setAnalysisResult(analysis)
      }
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const applyRefinement = () => {
    if (!analysisResult || !selectedPrompt) return

    onUpdatePrompt(selectedPrompt.id, {
      content: analysisResult.refinedPrompt,
      title: `${selectedPrompt.title} (Refined)`,
    })
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
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
            <CardTitle>Prompt Input</CardTitle>
            <CardDescription>Select an existing prompt or enter a custom one for analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={mode} onValueChange={(value: "existing" | "custom") => setMode(value)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="existing">Existing Prompt</TabsTrigger>
                <TabsTrigger value="custom">Custom Prompt</TabsTrigger>
              </TabsList>

              <TabsContent value="existing" className="space-y-4">
                <Select value={selectedPromptId} onValueChange={setSelectedPromptId}>
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

                {selectedPrompt && (
                  <div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm max-h-40 overflow-y-auto">
                      {selectedPrompt.content}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{selectedPrompt.category}</Badge>
                      {selectedPrompt.tags.slice(0, 2).map((tag) => (
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

            <Button onClick={analyzePrompt} disabled={!currentPrompt.trim() || isAnalyzing} className="w-full">
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze Prompt
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>AI-powered insights and improvement suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            {analysisResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Score</span>
                  <span className={`text-lg font-bold ${getScoreColor(analysisResult.score)}`}>
                    {analysisResult.score}/100
                  </span>
                </div>
                <Progress value={analysisResult.score} className="h-2" />

                <Tabs defaultValue="suggestions" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                    <TabsTrigger value="strengths">Strengths</TabsTrigger>
                    <TabsTrigger value="refined">Refined</TabsTrigger>
                  </TabsList>

                  <TabsContent value="suggestions" className="space-y-3">
                    {analysisResult.suggestions.map((suggestion, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{suggestion.title}</h4>
                          <Badge variant={getImpactBadge(suggestion.impact) as any}>{suggestion.impact} impact</Badge>
                        </div>
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
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm">
                        {analysisResult.refinedPrompt}
                      </div>
                    </div>

                    {mode === "existing" && selectedPrompt && (
                      <Button onClick={applyRefinement} className="w-full">
                        Apply Refinement to Prompt
                      </Button>
                    )}
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
    </div>
  )
}
