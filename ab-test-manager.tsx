"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FlaskConical, Play, Plus, Eye } from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Prompt, ABTest, ABTestResult, TestMetrics } from "@/app/dashboard/page"

interface ABTestManagerProps {
  prompts: Prompt[]
  abTests: ABTest[]
  onCreateTest: (test: ABTest) => void
  onUpdateTest: (id: string, updates: Partial<ABTest>) => void
}

export function ABTestManager({ prompts, abTests, onCreateTest, onUpdateTest }: ABTestManagerProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const [newTest, setNewTest] = useState({
    name: "",
    description: "",
    promptAId: "",
    promptBId: "",
    testInputs: [""],
  })

  const addTestInput = () => {
    setNewTest(prev => ({
      ...prev,
      testInputs: [...prev.testInputs, ""]
    }))
  }

  const updateTestInput = (index: number, value: string) => {
    setNewTest(prev => ({
      ...prev,
      testInputs: prev.testInputs.map((input, i) => i === index ? value : input)
    }))
  }

  const removeTestInput = (index: number) => {
    setNewTest(prev => ({
      ...prev,
      testInputs: prev.testInputs.filter((_, i) => i !== index)
    }))
  }

  const createTest = () => {
    const promptA = prompts.find(p => p.id === newTest.promptAId)
    const promptB = prompts.find(p => p.id === newTest.promptBId)

    if (!promptA || !promptB || !newTest.name.trim()) return

    const test: ABTest = {
      id: Date.now().toString(),
      name: newTest.name,
      description: newTest.description,
      promptA,
      promptB,
      testInputs: newTest.testInputs.filter(input => input.trim()),
      results: [],
      status: 'draft',
      createdAt: new Date(),
    }

    onCreateTest(test)
    setNewTest({
      name: "",
      description: "",
      promptAId: "",
      promptBId: "",
      testInputs: [""],
    })
    setIsCreating(false)
  }

  const runTest = async (test: ABTest) => {
    setIsRunning(true)
    onUpdateTest(test.id, { status: 'running' })

    const results: ABTestResult[] = []

    for (const input of test.testInputs) {
      try {
        // Test Prompt A
        const { text: outputA } = await generateText({
          model: openai("gpt-4"),
          prompt: `${test.promptA.content}\n\nInput: ${input}`,
        })

        // Test Prompt B
        const { text: outputB } = await generateText({
          model: openai("gpt-4"),
          prompt: `${test.promptB.content}\n\nInput: ${input}`,
        })

        // Simulate metrics calculation
        const metricsA: TestMetrics = {
          relevance: Math.random() * 40 + 60,
          coherence: Math.random() * 30 + 70,
          accuracy: Math.random() * 35 + 65,
          creativity: Math.random() * 50 + 50,
          responseTime: Math.random() * 2000 + 1000,
          tokenCount: outputA.split(' ').length,
        }

        const metricsB: TestMetrics = {
          relevance: Math.random() * 40 + 60,
          coherence: Math.random() * 30 + 70,
          accuracy: Math.random() * 35 + 65,
          creativity: Math.random() * 50 + 50,
          responseTime: Math.random() * 2000 + 1000,
          tokenCount: outputB.split(' ').length,
        }

        // Determine winner based on average metrics
        const avgA = (metricsA.relevance + metricsA.coherence + metricsA.accuracy + metricsA.creativity) / 4
        const avgB = (metricsB.relevance + metricsB.coherence + metricsB.accuracy + metricsB.creativity) / 4
        const winner = Math.abs(avgA - avgB) < 5 ? 'tie' : (avgA > avgB ? 'A' : 'B')

        const result: ABTestResult = {
          id: Date.now().toString() + Math.random(),
          testId: test.id,
          input,
          outputA,
          outputB,
          metricsA,
          metricsB,
          winner,
          timestamp: new Date(),
        }

        results.push(result)
      } catch (error) {
        console.error('Test failed for input:', input, error)
      }
    }

    onUpdateTest(test.id, {
      status: 'completed',
      results,
      completedAt: new Date(),
    })

    setIsRunning(false)
  }

  const getTestStats = (test: ABTest) => {
    if (test.results.length === 0) return null

    const winsA = test.results.filter(r => r.winner === 'A').length
    const winsB = test.results.filter(r => r.winner === 'B').length
    const ties = test.results.filter(r => r.winner === 'tie').length

    const avgMetricsA = test.results.reduce((acc, r) => ({
      relevance: acc.relevance + r.metricsA.relevance,
      coherence: acc.coherence + r.metricsA.coherence,
      accuracy: acc.accuracy + r.metricsA.accuracy,
      creativity: acc.creativity + r.metricsA.creativity,
      responseTime: acc.responseTime + r.metricsA.responseTime,
      tokenCount: acc.tokenCount + r.metricsA.tokenCount,
    }), { relevance: 0, coherence: 0, accuracy: 0, creativity: 0, responseTime: 0, tokenCount: 0 })

    const avgMetricsB = test.results.reduce((acc, r) => ({
      relevance: acc.relevance + r.metricsB.relevance,
      coherence: acc.coherence + r.metricsB.coherence,
      accuracy: acc.accuracy + r.metricsB.accuracy,
      creativity: acc.creativity + r.metricsB.creativity,
      responseTime: acc.responseTime + r.metricsB.responseTime,
      tokenCount: acc.tokenCount + r.metricsB.tokenCount,
    }), { relevance: 0, coherence: 0, accuracy: 0, creativity: 0, responseTime: 0, tokenCount: 0 })

    const count = test.results.length

    return {
      winsA,
      winsB,
      ties,
      avgMetricsA: {
        relevance: avgMetricsA.relevance / count,
        coherence: avgMetricsA.coherence / count,
        accuracy: avgMetricsA.accuracy / count,
        creativity: avgMetricsA.creativity / count,
        responseTime: avgMetricsA.responseTime / count,
        tokenCount: avgMetricsA.tokenCount / count,
      },
      avgMetricsB: {
        relevance: avgMetricsB.relevance / count,
        coherence: avgMetricsB.coherence / count,
        accuracy: avgMetricsB.accuracy / count,
        creativity: avgMetricsB.creativity / count,
        responseTime: avgMetricsB.responseTime / count,
        tokenCount: avgMetricsB.tokenCount / count,
      },
    }
  }

  const getStatusColor = (status: ABTest['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'running': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5" />
          <h3 className="text-lg font-semibold">A/B Test Manager</h3>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New A/B Test
        </Button>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {abTests.map((test) => {
          const stats = getTestStats(test)
          
          return (
            <Card key={test.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{test.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedTest(test)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {test.status === 'draft' && (
                      <Button variant="ghost" size="sm" onClick={() => runTest(test)} disabled={isRunning}>
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <Badge className={getStatusColor(test.status)}>
                  {test.status}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {test.description}
                </p>

                <div className="text-xs text-gray-500">
                  <div>Prompt A: {test.promptA.title}</div>
                  <div>Prompt B: {test.promptB.title}</div>
                  <div>{test.testInputs.length} test inputs</div>
                </div>

                {stats && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>A wins: {stats.winsA}</span>
                      <span>B wins: {stats.winsB}</span>
                      <span>Ties: {stats.ties}</span>
                    </div>
                    <div className="flex gap-1 h-2">
                      <div 
                        className="bg-blue-500 rounded-l" 
                        style={{ width: `${(stats.winsA / test.results.length) * 100}%` }}
                      />
                      <div 
                        className="bg-red-500" 
                        style={{ width: `${(stats.winsB / test.results.length) * 100}%` }}
                      />
                      <div 
                        className="bg-gray-300 rounded-r" 
                        style={{ width: `${(stats.ties / test.results.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Created: {test.createdAt.toLocaleDateString()}
                  {test.completedAt && (
                    <div>Completed: {test.completedAt.toLocaleDateString()}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {abTests.length === 0 && (
        <div className="text-center py-12">
          <FlaskConical className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">No A/B tests created yet.</p>
          <Button onClick={() => setIsCreating(true)}>Create Your First A/B Test</Button>
        </div>
      )}

      {/* Create Test Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New A/B Test</DialogTitle>
            <DialogDescription>
              Compare two prompts to determine which performs better
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Test Name</Label>
                <Input
                  value={newTest.name}
                  onChange={(e) => setNewTest(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter test name"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={newTest.description}
                  onChange={(e) => setNewTest(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the test"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Prompt A</Label>
                <Select value={newTest.promptAId} onValueChange={(value) => setNewTest(prev => ({ ...prev, promptAId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select first prompt" />
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

              <div>
                <Label>Prompt B</Label>
                <Select value={newTest.promptBId} onValueChange={(value) => setNewTest(prev => ({ ...prev, promptBId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select second prompt" />
                  </SelectTrigger>
                  <SelectContent>
                    {prompts.filter(p => p.id !== newTest.promptAId).map((prompt) => (
                      <SelectItem key={prompt.id} value={prompt.id}>
                        {prompt.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Test Inputs</Label>
              <div className="space-y-2">
                {newTest.testInputs.map((input, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={input}
                      onChange={(e) => updateTestInput(index, e.target.value)}
                      placeholder={`Test input ${index + 1}`}
                      className="min-h-[60px]"
                    />
                    {newTest.testInputs.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeTestInput(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addTestInput}>
                  Add Test Input
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={createTest} disabled={!newTest.name.trim() || !newTest.promptAId || !newTest.promptBId}>
                Create Test
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Test Details Dialog */}
      <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTest?.name}
              <Badge className={getStatusColor(selectedTest?.status || 'draft')}>
                {selectedTest?.status}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {selectedTest?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedTest && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {(() => {
                  const stats = getTestStats(selectedTest)
                  return stats ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Prompt A Wins</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-600">{stats.winsA}</div>
                          <div className="text-xs text-gray-500">
                            {((stats.winsA / selectedTest.results.length) * 100).toFixed(1)}%
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Prompt B Wins</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-600">{stats.winsB}</div>
                          <div className="text-xs text-gray-500">
                            {((stats.winsB / selectedTest.results.length) * 100).toFixed(1)}%
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Ties</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-gray-600">{stats.ties}</div>
                          <div className="text-xs text-gray-500">
                            {((stats.ties / selectedTest.results.length) * 100).toFixed(1)}%
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No results yet. Run the test to see data.</p>
                      {selectedTest.status === 'draft' && (
                        <Button className="mt-4" onClick={() => runTest(selectedTest)} disabled={isRunning}>
                          <Play className="h-4 w-4 mr-2" />
                          Run Test
                        </Button>
                      )}
                    </div>
                  )
                })()}
              </TabsContent>

              <TabsContent value="results" className="space-y-4">
                <ScrollArea className="h-96">
                  {selectedTest.results.map((result, index) => (
                    <div key={result.id} className="p-4 border rounded-lg mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Test {index + 1}</h4>
                        <Badge variant={result.winner === 'A' ? 'default' : result.winner === 'B' ? 'destructive' : 'secondary'}>
                          {result.winner === 'tie' ? 'Tie' : `Prompt ${result.winner} wins`}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <strong>Input:</strong> {result.input}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-blue-600 mb-1">Prompt A Output</h5>
                          <div className="text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded max-h-32 overflow-y-auto">
                            {result.outputA}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-red-600 mb-1">Prompt B Output</h5>
                          <div className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded max-h-32 overflow-y-auto">
                            {result.outputB}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="comparison" className="space-y-4">
                {(() => {
                  const stats = getTestStats(selectedTest)
                  return stats ? (
                    <div className="space-y-6">
                      {Object.entries(stats.avgMetricsA).map(([metric, valueA]) => {
                        const valueB = stats.avgMetricsB[metric as keyof typeof stats.avgMetricsB]
                        const maxValue = Math.max(valueA, valueB)
                        
                        return (
                          <div key={metric} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label className="capitalize">{metric}</Label>
                              <div className="flex gap-4 text-sm">
                                <span className="text-blue-600">A: {valueA.toFixed(1)}</span>
                                <span className="text-red-600">B: {valueB.toFixed(1)}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <Progress value={(valueA / maxValue) * 100} className="h-2" />
                              </div>
                              <div className="flex-1">
                                <Progress value={(valueB / maxValue) * 100} className="h-2" />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No comparison data available yet.</p>
                    </div>
                  )
                })()}
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Prompt A</h4>
                    <div className="text-sm">
                      <div className="font-medium">{selectedTest.promptA.title}</div>
                      <div className="text-gray-600 dark:text-gray-400 mt-1">
                        {selectedTest.promptA.content.substring(0, 200)}...
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Prompt B</h4>
                    <div className="text-sm">
                      <div className="font-medium">{selectedTest.promptB.title}</div>
                      <div className="text-gray-600 dark:text-gray-400 mt-1">
                        {selectedTest.promptB.content.substring(0, 200)}...
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Test Inputs</h4>
                  <div className="space-y-2">
                    {selectedTest.testInputs.map((input, index) => (
                      <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                        <strong>Input {index + 1}:</strong> {input}
                      </div>
                    ))}
                  \
