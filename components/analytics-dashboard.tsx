"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Clock, Target, Zap, Award, Activity } from "lucide-react"

interface AnalyticsData {
  overview: {
    totalPrompts: number
    totalTests: number
    avgRating: number
    totalUsage: number
  }
  performance: {
    topPerformers: Array<{
      name: string
      rating: number
      usage: number
      category: string
    }>
    categoryPerformance: Array<{
      category: string
      avgRating: number
      totalPrompts: number
      usage: number
    }>
  }
  trends: {
    weeklyUsage: number[]
    popularCategories: Array<{
      category: string
      percentage: number
    }>
  }
  testing: {
    activeTests: number
    completedTests: number
    avgImprovement: number
  }
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d")

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    overview: {
      totalPrompts: 47,
      totalTests: 8,
      avgRating: 4.3,
      totalUsage: 1247,
    },
    performance: {
      topPerformers: [
        { name: "Creative Story Generator", rating: 4.8, usage: 156, category: "Creative Writing" },
        { name: "Code Review Assistant", rating: 4.6, usage: 89, category: "Programming" },
        { name: "Email Composer", rating: 4.4, usage: 203, category: "Business" },
        { name: "Data Analysis Helper", rating: 4.7, usage: 67, category: "Analytics" },
        { name: "Meeting Summarizer", rating: 4.2, usage: 134, category: "Business" },
      ],
      categoryPerformance: [
        { category: "Creative Writing", avgRating: 4.5, totalPrompts: 12, usage: 456 },
        { category: "Programming", avgRating: 4.4, totalPrompts: 8, usage: 234 },
        { category: "Business", avgRating: 4.2, totalPrompts: 15, usage: 387 },
        { category: "Analytics", avgRating: 4.6, totalPrompts: 6, usage: 123 },
        { category: "Education", avgRating: 4.1, totalPrompts: 6, usage: 47 },
      ],
    },
    trends: {
      weeklyUsage: [45, 52, 48, 61, 55, 67, 73],
      popularCategories: [
        { category: "Creative Writing", percentage: 35 },
        { category: "Business", percentage: 28 },
        { category: "Programming", percentage: 22 },
        { category: "Analytics", percentage: 10 },
        { category: "Education", percentage: 5 },
      ],
    },
    testing: {
      activeTests: 3,
      completedTests: 5,
      avgImprovement: 12.5,
    },
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 4.0) return "text-yellow-600"
    return "text-red-600"
  }

  const getUsageGrowth = (current: number, previous: number) => {
    return (((current - previous) / previous) * 100).toFixed(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics Dashboard
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Track performance and insights across your prompts</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalPrompts}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalUsage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.2</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tests</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.testing.activeTests}</div>
            <p className="text-xs text-muted-foreground">{analyticsData.testing.completedTests} completed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="testing">A/B Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Prompts</CardTitle>
                <CardDescription>Highest rated prompts by usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.performance.topPerformers.map((prompt, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{prompt.name}</div>
                        <div className="text-xs text-gray-500">{prompt.category}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${getRatingColor(prompt.rating)}`}>
                          ⭐ {prompt.rating.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500">{prompt.usage} uses</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Distribution</CardTitle>
                <CardDescription>How your prompts are being used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.trends.popularCategories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{category.category}</span>
                        <span className="text-sm text-gray-500">{category.percentage}%</span>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>Performance metrics by prompt category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.performance.categoryPerformance.map((category, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{category.category}</h4>
                      <Badge variant="outline">{category.totalPrompts} prompts</Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Avg Rating</div>
                        <div className={`font-medium ${getRatingColor(category.avgRating)}`}>
                          {category.avgRating.toFixed(1)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Total Usage</div>
                        <div className="font-medium">{category.usage}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Avg per Prompt</div>
                        <div className="font-medium">{Math.round(category.usage / category.totalPrompts)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Usage Trend</CardTitle>
                <CardDescription>Usage over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.trends.weeklyUsage.map((usage, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-16 text-sm text-gray-500">Day {index + 1}</div>
                      <div className="flex-1">
                        <Progress
                          value={(usage / Math.max(...analyticsData.trends.weeklyUsage)) * 100}
                          className="h-2"
                        />
                      </div>
                      <div className="w-12 text-sm font-medium text-right">{usage}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    📈 {getUsageGrowth(analyticsData.trends.weeklyUsage[6], analyticsData.trends.weeklyUsage[0])}%
                    growth this week
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>Key metrics and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800 dark:text-green-200">Top Category</span>
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      Creative Writing prompts have the highest engagement with 35% of total usage
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800 dark:text-yellow-200">Opportunity</span>
                    </div>
                    <div className="text-sm text-yellow-600 dark:text-yellow-400">
                      Education category has low usage - consider creating more educational prompts
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800 dark:text-blue-200">Quality</span>
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      Analytics prompts have the highest average rating at 4.6/5
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>A/B Testing Overview</CardTitle>
                <CardDescription>Current testing performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="text-2xl font-bold text-green-600">{analyticsData.testing.activeTests}</div>
                      <div className="text-sm text-gray-600">Active Tests</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="text-2xl font-bold text-blue-600">{analyticsData.testing.completedTests}</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <div className="font-medium text-purple-800 dark:text-purple-200 mb-1">Average Improvement</div>
                    <div className="text-2xl font-bold text-purple-600">+{analyticsData.testing.avgImprovement}%</div>
                    <div className="text-sm text-purple-600 dark:text-purple-400">Across all completed tests</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Testing Recommendations</CardTitle>
                <CardDescription>Suggested areas for optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm mb-1">Test Prompt Length</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Compare shorter vs longer prompts for better engagement
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm mb-1">Parameter Optimization</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Test different parameter combinations for higher ratings
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm mb-1">Tone Variations</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Experiment with formal vs casual tone in business prompts
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm mb-1">Category Expansion</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Create variations of high-performing creative writing prompts
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
