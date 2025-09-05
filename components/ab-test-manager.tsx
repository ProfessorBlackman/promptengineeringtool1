"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TestTube, Play, Pause, BarChart3, Users } from "lucide-react"

interface ABTest {
  id: string
  name: string
  description: string
  status: "draft" | "running" | "completed" | "paused"
  variantA: {
    name: string
    content: string
    metrics: {
      responses: number
      avgRating: number
      successRate: number
    }
  }
  variantB: {
    name: string
    content: string
    metrics: {
      responses: number
      avgRating: number
      successRate: number
    }
  }
  trafficSplit: number
  startDate: Date
  endDate?: Date
  totalResponses: number
  winner?: "A" | "B" | "tie"
  confidence: number
}

export default function ABTestManager() {
  const [tests, setTests] = useState<ABTest[]>([
    {
      id: "1",
      name: "Story Generator Comparison",
      description: "Testing different approaches to creative story generation",
      status: "running",
      variantA: {
        name: "Detailed Prompt",
        content:
          "Write a detailed {genre} story about {character} who discovers {discovery}. Include dialogue, setting descriptions, and character development. The story should be {length} words.",
        metrics: {
          responses: 156,
          avgRating: 4.2,
          successRate: 78,
        },
      },
      variantB: {
        name: "Simple Prompt",
        content: "Write a {genre} story about {character} discovering {discovery}.",
        metrics: {
          responses: 144,
          avgRating: 3.8,
          successRate: 65,
        },
      },
      trafficSplit: 50,
      startDate: new Date("2024-01-15"),
      totalResponses: 300,
      confidence: 85,
    },
    {
      id: "2",
      name: "Code Review Styles",
      description: "Comparing formal vs casual tone in code review prompts",
      status: "completed",
      variantA: {
        name: "Formal Tone",
        content:
          "Please conduct a comprehensive code review of the following {language} code, focusing on best practices, security, and performance optimization.",
        metrics: {
          responses: 89,
          avgRating: 4.5,
          successRate: 82,
        },
      },
      variantB: {
        name: "Casual Tone",
        content:
          "Hey! Can you take a look at this {language} code and let me know what you think? Any improvements or issues you spot?",
        metrics: {
          responses: 91,
          avgRating: 4.1,
          successRate: 76,
        },
      },
      trafficSplit: 50,
      startDate: new Date("2024-01-10"),
      endDate: new Date("2024-01-25"),
      totalResponses: 180,
      winner: "A",
      confidence: 92,
    },
  ])

  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newTest, setNewTest] = useState({
    name: "",
    description: "",
    variantA: { name: "", content: "" },
    variantB: { name: "", content: "" },
    trafficSplit: 50,
  })

  const handleCreateTest = () => {
    const test: ABTest = {
      id: Date.now().toString(),
      name: newTest.name,
      description: newTest.description,
      status: "draft",
      variantA: {
        ...newTest.variantA,
        metrics: { responses: 0, avgRating: 0, successRate: 0 },
      },
      variantB: {
        ...newTest.variantB,
        metrics: { responses: 0, avgRating: 0, successRate: 0 },
      },
      trafficSplit: newTest.trafficSplit,
      startDate: new Date(),
      totalResponses: 0,
      confidence: 0,
    }

    setTests((prev) => [...prev, test])
    setNewTest({
      name: "",
      description: "",
      variantA: { name: "", content: "" },
      variantB: { name: "", content: "" },
      trafficSplit: 50,
    })
    setShowCreateDialog(false)
  }

  const handleStartTest = (testId: string) => {
    setTests((prev) => prev.map((test) => (test.id === testId ? { ...test, status: "running" as const } : test)))
  }

  const handlePauseTest = (testId: string) => {
    setTests((prev) => prev.map((test) => (test.id === testId ? { ...test, status: "paused" as const } : test)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-green-100 text-green-800">Running</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getWinnerBadge = (test: ABTest) => {
    if (!test.winner) return null

    if (test.winner === "tie") {
      return <Badge variant="outline">Tie</Badge>
    }

    return <Badge className="bg-purple-100 text-purple-800">Winner: Variant {test.winner}</Badge>
  }

  const calculateImprovement = (variantA: any, variantB: any) => {
    const improvement = ((variantA.avgRating - variantB.avgRating) / variantB.avgRating) * 100
    return improvement.toFixed(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            A/B Test Manager
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Compare prompt variations and optimize performance</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <TestTube className="h-4 w-4 mr-2" />
          New A/B Test
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tests List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Tests</CardTitle>
            <CardDescription>Manage your A/B testing experiments</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {tests.map((test) => (
                  <div
                    key={test.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTest?.id === test.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setSelectedTest(test)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{test.name}</h4>
                      <div className="flex gap-2">
                        {getStatusBadge(test.status)}
                        {getWinnerBadge(test)}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{test.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Variant A</div>
                        <div className="text-gray-500">{test.variantA.metrics.responses} responses</div>
                        <div className="text-gray-500">⭐ {test.variantA.metrics.avgRating.toFixed(1)}</div>
                      </div>
                      <div>
                        <div className="font-medium">Variant B</div>
                        <div className="text-gray-500">{test.variantB.metrics.responses} responses</div>
                        <div className="text-gray-500">⭐ {test.variantB.metrics.avgRating.toFixed(1)}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <div className="text-xs text-gray-500">{test.confidence}% confidence</div>
                      <div className="flex gap-2">
                        {test.status === "draft" && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStartTest(test.id)
                            }}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        )}
                        {test.status === "running" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePauseTest(test.id)
                            }}
                          >
                            <Pause className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Test Details */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              {selectedTest ? "Detailed analysis and metrics" : "Select a test to view results"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedTest ? (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="variants">Variants</TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">Total Responses</span>
                      </div>
                      <div className="text-2xl font-bold">{selectedTest.totalResponses}</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="h-4 w-4" />
                        <span className="font-medium">Confidence</span>
                      </div>
                      <div className="text-2xl font-bold">{selectedTest.confidence}%</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Traffic Split</span>
                      <span className="text-sm text-gray-500">
                        {selectedTest.trafficSplit}% / {100 - selectedTest.trafficSplit}%
                      </span>
                    </div>
                    <Progress value={selectedTest.trafficSplit} className="h-2" />
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div>Started: {selectedTest.startDate.toLocaleDateString()}</div>
                    {selectedTest.endDate && <div>Ended: {selectedTest.endDate.toLocaleDateString()}</div>}
                  </div>

                  {selectedTest.winner && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                      <div className="font-medium text-green-800 dark:text-green-200">
                        🎉 Variant {selectedTest.winner} is the winner!
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        {calculateImprovement(
                          selectedTest.winner === "A" ? selectedTest.variantA.metrics : selectedTest.variantB.metrics,
                          selectedTest.winner === "A" ? selectedTest.variantB.metrics : selectedTest.variantA.metrics,
                        )}
                        % improvement in average rating
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="variants" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Variant A: {selectedTest.variantA.name}</h4>
                        {selectedTest.winner === "A" && <Badge className="bg-green-100 text-green-800">Winner</Badge>}
                      </div>
                      <div className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded mb-3">
                        {selectedTest.variantA.content}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="text-gray-500">Responses</div>
                          <div className="font-medium">{selectedTest.variantA.metrics.responses}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Avg Rating</div>
                          <div className="font-medium">{selectedTest.variantA.metrics.avgRating.toFixed(1)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Success Rate</div>
                          <div className="font-medium">{selectedTest.variantA.metrics.successRate}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Variant B: {selectedTest.variantB.name}</h4>
                        {selectedTest.winner === "B" && <Badge className="bg-green-100 text-green-800">Winner</Badge>}
                      </div>
                      <div className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded mb-3">
                        {selectedTest.variantB.content}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="text-gray-500">Responses</div>
                          <div className="font-medium">{selectedTest.variantB.metrics.responses}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Avg Rating</div>
                          <div className="font-medium">{selectedTest.variantB.metrics.avgRating.toFixed(1)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Success Rate</div>
                          <div className="font-medium">{selectedTest.variantB.metrics.successRate}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="metrics" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Average Rating Comparison</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Variant A</span>
                          <span className="text-sm font-medium">
                            {selectedTest.variantA.metrics.avgRating.toFixed(1)}
                          </span>
                        </div>
                        <Progress value={(selectedTest.variantA.metrics.avgRating / 5) * 100} className="h-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Variant B</span>
                          <span className="text-sm font-medium">
                            {selectedTest.variantB.metrics.avgRating.toFixed(1)}
                          </span>
                        </div>
                        <Progress value={(selectedTest.variantB.metrics.avgRating / 5) * 100} className="h-2" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Success Rate Comparison</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Variant A</span>
                          <span className="text-sm font-medium">{selectedTest.variantA.metrics.successRate}%</span>
                        </div>
                        <Progress value={selectedTest.variantA.metrics.successRate} className="h-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Variant B</span>
                          <span className="text-sm font-medium">{selectedTest.variantB.metrics.successRate}%</span>
                        </div>
                        <Progress value={selectedTest.variantB.metrics.successRate} className="h-2" />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a test to view detailed results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Test Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New A/B Test</DialogTitle>
            <DialogDescription>Set up a new experiment to compare prompt variations</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="test-name">Test Name</Label>
              <Input
                id="test-name"
                value={newTest.name}
                onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                placeholder="Enter test name"
              />
            </div>

            <div>
              <Label htmlFor="test-description">Description</Label>
              <Textarea
                id="test-description"
                value={newTest.description}
                onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                placeholder="Describe what you're testing"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="variant-a-name">Variant A Name</Label>
                <Input
                  id="variant-a-name"
                  value={newTest.variantA.name}
                  onChange={(e) =>
                    setNewTest({
                      ...newTest,
                      variantA: { ...newTest.variantA, name: e.target.value },
                    })
                  }
                  placeholder="e.g., Original"
                />
              </div>
              <div>
                <Label htmlFor="variant-b-name">Variant B Name</Label>
                <Input
                  id="variant-b-name"
                  value={newTest.variantB.name}
                  onChange={(e) =>
                    setNewTest({
                      ...newTest,
                      variantB: { ...newTest.variantB, name: e.target.value },
                    })
                  }
                  placeholder="e.g., Modified"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="variant-a-content">Variant A Content</Label>
              <Textarea
                id="variant-a-content"
                value={newTest.variantA.content}
                onChange={(e) =>
                  setNewTest({
                    ...newTest,
                    variantA: { ...newTest.variantA, content: e.target.value },
                  })
                }
                placeholder="Enter the first prompt variation"
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="variant-b-content">Variant B Content</Label>
              <Textarea
                id="variant-b-content"
                value={newTest.variantB.content}
                onChange={(e) =>
                  setNewTest({
                    ...newTest,
                    variantB: { ...newTest.variantB, content: e.target.value },
                  })
                }
                placeholder="Enter the second prompt variation"
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="traffic-split">Traffic Split (%)</Label>
              <Input
                id="traffic-split"
                type="number"
                min="10"
                max="90"
                value={newTest.trafficSplit}
                onChange={(e) => setNewTest({ ...newTest, trafficSplit: Number.parseInt(e.target.value) })}
              />
              <p className="text-xs text-gray-500 mt-1">
                Percentage of traffic for Variant A (Variant B gets the remainder)
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTest}>Create Test</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
