"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Target, Clock, Award, Users } from "lucide-react"
import type { Prompt, ABTest, PromptVersion } from "@/app/dashboard/page"

interface AnalyticsDashboardProps {
  prompts: Prompt[]
  abTests: ABTest[]
  promptVersions: PromptVersion[]
}

export function AnalyticsDashboard({ prompts, abTests, promptVersions }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d")

  // Calculate analytics data
  const totalPrompts = prompts.length
  const totalTests = prompts.reduce((acc, p) => acc + (p.testResults?.length || 0), 0)
  const completedABTests = abTests.filter((t) => t.status === "completed").length
  const totalVersions = promptVersions.length

  // Category distribution
  const categoryStats = prompts.reduce(
    (acc, prompt) => {
      acc[prompt.category] = (acc[prompt.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Performance metrics
  const avgPerformance = prompts.reduce(
    (acc, prompt) => {
      if (prompt.testResults && prompt.testResults.length > 0) {
        const avgMetrics = prompt.testResults.reduce(
          (metricAcc, result) => ({
            relevance: metricAcc.relevance + result.metrics.relevance,
            coherence: metricAcc.coherence + result.metrics.coherence,
            accuracy: metricAcc.accuracy + result.metrics.accuracy,
            creativity: metricAcc.creativity + result.metrics.creativity,
          }),
          { relevance: 0, coherence: 0, accuracy: 0, creativity: 0 },
        )

        const count = prompt.testResults.length
        return {
          relevance: acc.relevance + avgMetrics.relevance / count,
          coherence: acc.coherence + avgMetrics.coherence / count,
          accuracy: acc.accuracy + avgMetrics.accuracy / count,
          creativity: acc.creativity + avgMetrics.creativity / count,
          count: acc.count + 1,
        }
      }
      return acc
    },
    { relevance: 0, coherence: 0, accuracy: 0, creativity: 0, count: 0 },
  )

  const overallPerformance =
    avgPerformance.count > 0
      ? {
          relevance: avgPerformance.relevance / avgPerformance.count,
          coherence: avgPerformance.coherence / avgPerformance.count,
          accuracy: avgPerformance.accuracy / avgPerformance.count,
          creativity: avgPerformance.creativity / avgPerformance.count,
        }
      : { relevance: 0, coherence: 0, accuracy: 0, creativity: 0 }

  // Top performing prompts
  const topPrompts = prompts
    .filter((p) => p.testResults && p.testResults.length > 0)
    .map((prompt) => {
      const avgScore =
        prompt.testResults!.reduce((acc, result) => {
          const score =
            (result.metrics.relevance +
              result.metrics.coherence +
              result.metrics.accuracy +
              result.metrics.creativity) /
            4
          return acc + score
        }, 0) / prompt.testResults!.length

      return { ...prompt, avgScore }
    })
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 5)

  // A/B Test insights
  const abTestInsights = abTests
    .filter((test) => test.status === "completed")
    .map((test) => {
      const winsA = test.results.filter((r) => r.winner === "A").length
      const winsB = test.results.filter((r) => r.winner === "B").length
      const ties = test.results.filter((r) => r.winner === "tie").length
      const total = test.results.length

      return {
        ...test,
        winRateA: total > 0 ? (winsA / total) * 100 : 0,
        winRateB: total > 0 ? (winsB / total) * 100 : 0,
        tieRate: total > 0 ? (ties / total) * 100 : 0,
      }
    })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics Dashboard
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Insights and performance metrics for your prompts</p>
        </div>
        <Select value={timeRange} onValueChange={(value: "7d" | "30d" | "90d" | "all") => setTimeRange(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Prompts</p>
                <p className="text-2xl font-bold">{totalPrompts}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tests Run</p>
                <p className="text-2xl font-bold">{totalTests}</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">A/B Tests</p>
                <p className="text-2xl font-bold">{completedABTests}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Versions</p>
                <p className="text-2xl font-bold">{totalVersions}</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="top-prompts">Top Prompts</TabsTrigger>
          <TabsTrigger value="ab-tests">A/B Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overall Performance Metrics</CardTitle>
              <CardDescription>Average performance across all tested prompts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(overallPerformance).map(([metric, score]) => (
                <div key={metric} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">{metric}</span>
                    <span className="text-sm text-gray-600">{score.toFixed(1)}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Categories</CardTitle>
              <CardDescription>Distribution of prompts by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(categoryStats)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{category}</Badge>
                        <span className="text-sm text-gray-600">{count} prompts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24">
                          <Progress value={(count / totalPrompts) * 100} className="h-2" />
                        </div>
                        <span className="text-xs text-gray-500 w-12">{((count / totalPrompts) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-prompts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Prompts</CardTitle>
              <CardDescription>Prompts with the highest average performance scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPrompts.length > 0 ? (
                  topPrompts.map((prompt, index) => (
                    <div key={prompt.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{prompt.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {prompt.testResults?.length} tests • {prompt.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold text-lg">{prompt.avgScore.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No performance data available yet.</p>
                    <p className="text-sm">Run some tests to see top performing prompts.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ab-tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>A/B Test Results</CardTitle>
              <CardDescription>Performance comparison from completed A/B tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {abTestInsights.length > 0 ? (
                  abTestInsights.map((test) => (
                    <div key={test.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{test.name}</h4>
                        <Badge variant="outline">{test.results.length} tests</Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Prompt A Wins</div>
                          <div className="text-lg font-bold text-blue-600">{test.winRateA.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Ties</div>
                          <div className="text-lg font-bold text-gray-600">{test.tieRate.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Prompt B Wins</div>
                          <div className="text-lg font-bold text-red-600">{test.winRateB.toFixed(1)}%</div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-500" style={{ width: `${test.winRateA}%` }} />
                          <div className="bg-gray-300" style={{ width: `${test.tieRate}%` }} />
                          <div className="bg-red-500" style={{ width: `${test.winRateB}%` }} />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No A/B test results available yet.</p>
                    <p className="text-sm">Complete some A/B tests to see insights.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
