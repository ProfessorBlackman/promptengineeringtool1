"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Clock, Target, Settings } from "lucide-react"
import LLMSelectorModal from "@/components/llm-selector-modal"

interface TestResult {
  id: string
  promptId: string
  input: string
  output: string
  metrics: {
    relevance: number
    coherence: number
    accuracy: number
    creativity: number
  }
  timestamp: Date
  llmUsed: string
}

interface Prompt {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  parameters?: Record<string, any>
  testResults?: TestResult[]
}

interface LLMOption {
  id: string
  name: string
  provider: string
  description: string
  capabilities: string[]
  strengths: string[]
  pricing: "free" | "paid" | "freemium"
  speed: "fast" | "medium" | "slow"
  quality: "high" | "medium" | "standard"
  icon: React.ReactNode
  recommended?: boolean
}

export default function PromptTester() {
  const [selectedPromptId, setSelectedPromptId] = useState<string>("")
  const [testInput, setTestInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentTest, setCurrentTest] = useState<TestResult | null>(null)
  const [showLLMModal, setShowLLMModal] = useState(false)
  const [selectedLLM, setSelectedLLM] = useState<LLMOption | null>(null)

  // Mock prompts data
  const prompts: Prompt[] = [
    {
      id: "1",
      title: "Creative Story Generator",
      content: "Write a {genre} story about {character} who discovers {discovery}.",
      category: "Creative Writing",
      tags: ["storytelling", "creative"],
      parameters: { genre: "fantasy", character: "young wizard", discovery: "ancient artifact" },
    },
    {
      id: "2",
      title: "Code Review Assistant",
      content: "Review the following code for best practices and improvements:\n\n{code}",
      category: "Code Generation",
      tags: ["code-review", "programming"],
      parameters: { code: "// Your code here" },
    },
  ]

  const selectedPrompt = prompts.find((p) => p.id === selectedPromptId)

  const runTest = async () => {
    if (!selectedPrompt || !testInput.trim() || !selectedLLM) return

    setIsLoading(true)
    try {
      // Simulate API call delay based on selected LLM speed
      const delay = selectedLLM.speed === "fast" ? 1000 : selectedLLM.speed === "medium" ? 2000 : 3000
      await new Promise((resolve) => setTimeout(resolve, delay))

      // Mock response - in a real app, this would call the selected AI API
      const mockOutput = `This is a simulated response from ${selectedLLM.name} (${selectedLLM.provider}) for the prompt: "${selectedPrompt.title}"\n\nInput: ${testInput}\n\nThis would be the actual AI-generated content based on your prompt and input. The response quality and style would vary based on the selected model's capabilities.`

      // Simulate metrics calculation based on LLM quality
      const qualityMultiplier = selectedLLM.quality === "high" ? 1.2 : selectedLLM.quality === "medium" ? 1.0 : 0.8
      const metrics = {
        relevance: Math.min(100, (Math.random() * 40 + 60) * qualityMultiplier),
        coherence: Math.min(100, (Math.random() * 30 + 70) * qualityMultiplier),
        accuracy: Math.min(100, (Math.random() * 35 + 65) * qualityMultiplier),
        creativity: Math.min(100, (Math.random() * 50 + 50) * qualityMultiplier),
      }

      const testResult: TestResult = {
        id: Date.now().toString(),
        promptId: selectedPrompt.id,
        input: testInput,
        output: mockOutput,
        metrics,
        timestamp: new Date(),
        llmUsed: selectedLLM.name,
      }

      setCurrentTest(testResult)
    } catch (error) {
      console.error("Test failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLLMSelect = (llm: LLMOption) => {
    setSelectedLLM(llm)
  }

  const getMetricColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getMetricBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Test Configuration</CardTitle>
                <CardDescription>Select a prompt and provide test input</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLLMModal(true)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                {selectedLLM ? selectedLLM.name : "Select Model"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedLLM && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  {selectedLLM.icon}
                  <span className="font-medium text-sm">{selectedLLM.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedLLM.provider}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {selectedLLM.speed}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{selectedLLM.description}</p>
              </div>
            )}

            <div>
              <Label>Select Prompt</Label>
              <Select value={selectedPromptId} onValueChange={setSelectedPromptId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a prompt to test" />
                </SelectTrigger>
                <SelectContent>
                  {prompts.map((prompt) => (
                    <SelectItem key={prompt.id} value={prompt.id}>
                      {prompt.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPrompt && (
              <div>
                <Label>Prompt Preview</Label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">{selectedPrompt.content}</div>
                {selectedPrompt.parameters && Object.keys(selectedPrompt.parameters).length > 0 && (
                  <div className="mt-2">
                    <Label className="text-xs">Parameters:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(selectedPrompt.parameters).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          {key}: {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="testInput">Test Input</Label>
              <Textarea
                id="testInput"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Enter your test input here..."
                className="min-h-[100px]"
              />
            </div>

            <Button
              onClick={runTest}
              disabled={!selectedPrompt || !testInput.trim() || isLoading || !selectedLLM}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Testing with {selectedLLM?.name}...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Test
                </>
              )}
            </Button>

            {!selectedLLM && (
              <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
                Please select a language model to run tests
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              {currentTest
                ? `Performance metrics from ${currentTest.llmUsed}`
                : "Performance metrics and output analysis"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentTest ? (
              <Tabs defaultValue="output" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="output">Output</TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                </TabsList>

                <TabsContent value="output" className="space-y-4">
                  <div>
                    <Label>Generated Output</Label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm max-h-60 overflow-y-auto">
                      {currentTest.output}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Model: {currentTest.llmUsed}</span>
                    <span>Generated: {currentTest.timestamp.toLocaleString()}</span>
                  </div>
                </TabsContent>

                <TabsContent value="metrics" className="space-y-4">
                  {Object.entries(currentTest.metrics).map(([metric, score]) => (
                    <div key={metric} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="capitalize">{metric}</Label>
                        <Badge variant={getMetricBadgeVariant(score)}>{score.toFixed(1)}%</Badge>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  ))}

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <Label>Overall Score</Label>
                      <Badge
                        variant={getMetricBadgeVariant(
                          Object.values(currentTest.metrics).reduce((a, b) => a + b, 0) / 4,
                        )}
                      >
                        {(Object.values(currentTest.metrics).reduce((a, b) => a + b, 0) / 4).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 pt-2 border-t">
                    <p>Tested with: {currentTest.llmUsed}</p>
                    <p>Test completed: {currentTest.timestamp.toLocaleString()}</p>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Run a test to see results here</p>
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
        context="tester"
      />
    </div>
  )
}
