"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Clock, Target } from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Prompt, TestResult } from "@/app/dashboard/page"

interface PromptTesterProps {
  prompts: Prompt[]
  onUpdatePrompt: (id: string, updates: Partial<Prompt>) => void
}

export function PromptTester({ prompts, onUpdatePrompt }: PromptTesterProps) {
  const [selectedPromptId, setSelectedPromptId] = useState<string>("")
  const [testInput, setTestInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentTest, setCurrentTest] = useState<TestResult | null>(null)

  const selectedPrompt = prompts.find((p) => p.id === selectedPromptId)

  const runTest = async () => {
    if (!selectedPrompt || !testInput.trim()) return

    setIsLoading(true)
    try {
      // Replace parameters in prompt content
      let processedPrompt = selectedPrompt.content
      if (selectedPrompt.parameters) {
        Object.entries(selectedPrompt.parameters).forEach(([key, value]) => {
          processedPrompt = processedPrompt.replace(new RegExp(`\\{${key}\\}`, "g"), value)
        })
      }

      const fullPrompt = `${processedPrompt}\n\nInput: ${testInput}`

      const { text } = await generateText({
        model: openai("gpt-4"),
        prompt: fullPrompt,
      })

      // Simulate metrics calculation (in a real app, you'd use more sophisticated analysis)
      const metrics = {
        relevance: Math.random() * 40 + 60, // 60-100
        coherence: Math.random() * 30 + 70, // 70-100
        accuracy: Math.random() * 35 + 65, // 65-100
        creativity: Math.random() * 50 + 50, // 50-100
      }

      const testResult: TestResult = {
        id: Date.now().toString(),
        promptId: selectedPrompt.id,
        input: testInput,
        output: text,
        metrics,
        timestamp: new Date(),
      }

      setCurrentTest(testResult)

      // Update prompt with test result
      const updatedTestResults = [...(selectedPrompt.testResults || []), testResult]
      onUpdatePrompt(selectedPrompt.id, { testResults: updatedTestResults })
    } catch (error) {
      console.error("Test failed:", error)
    } finally {
      setIsLoading(false)
    }
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
            <CardTitle>Test Configuration</CardTitle>
            <CardDescription>Select a prompt and provide test input</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <Button onClick={runTest} disabled={!selectedPrompt || !testInput.trim() || isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Running Test...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Test
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Performance metrics and output analysis</CardDescription>
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
                  <div className="text-xs text-gray-500">Generated at: {currentTest.timestamp.toLocaleString()}</div>
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

      {/* Test History */}
      {selectedPrompt && selectedPrompt.testResults && selectedPrompt.testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test History</CardTitle>
            <CardDescription>Previous test results for this prompt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedPrompt.testResults
                .slice(-5)
                .reverse()
                .map((result) => (
                  <div key={result.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm font-medium">
                        Input: {result.input.substring(0, 100)}
                        {result.input.length > 100 && "..."}
                      </div>
                      <div className="text-xs text-gray-500">{result.timestamp.toLocaleString()}</div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {Object.entries(result.metrics).map(([metric, score]) => (
                        <div key={metric} className="text-center">
                          <div className="text-xs text-gray-500 capitalize">{metric}</div>
                          <div className={`text-sm font-medium ${getMetricColor(score)}`}>{score.toFixed(1)}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
