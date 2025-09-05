"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Brain,
  Search,
  Book,
  Zap,
  Home,
  Sparkles,
  Library,
  TestTube,
  FileIcon as FileTemplate,
  BarChart3,
  GitBranch,
  FlaskConical,
  Users,
  MessageSquare,
  Settings,
  Code,
  Lightbulb,
  Target,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeSection, setActiveSection] = useState("getting-started")

  const navigation = [
    {
      title: "Getting Started",
      items: [
        { id: "getting-started", title: "Introduction", icon: Home },
        { id: "quick-start", title: "Quick Start Guide", icon: Zap },
        { id: "installation", title: "Installation", icon: Settings },
      ],
    },
    {
      title: "Core Features",
      items: [
        { id: "prompt-builder", title: "Prompt Builder", icon: Brain },
        { id: "prompt-refiner", title: "AI Refinement", icon: Sparkles },
        { id: "prompt-library", title: "Prompt Library", icon: Library },
        { id: "testing", title: "Testing Environment", icon: TestTube },
        { id: "templates", title: "Template System", icon: FileTemplate },
      ],
    },
    {
      title: "Advanced Features",
      items: [
        { id: "version-control", title: "Version Control", icon: GitBranch },
        { id: "ab-testing", title: "A/B Testing", icon: FlaskConical },
        { id: "analytics", title: "Analytics Dashboard", icon: BarChart3 },
        { id: "curated-library", title: "Curated Library", icon: Library },
      ],
    },
    {
      title: "Integration",
      items: [
        { id: "llm-integration", title: "LLM Integration", icon: Code },
        { id: "api-reference", title: "API Reference", icon: Settings },
        { id: "webhooks", title: "Webhooks", icon: MessageSquare },
      ],
    },
    {
      title: "Best Practices",
      items: [
        { id: "optimization", title: "Prompt Optimization", icon: Target },
        { id: "collaboration", title: "Team Collaboration", icon: Users },
        { id: "troubleshooting", title: "Troubleshooting", icon: Lightbulb },
      ],
    },
  ]

  const content = {
    "getting-started": {
      title: "Introduction to PromptStudio",
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Welcome to PromptStudio</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              PromptStudio is a comprehensive platform designed to streamline your prompt engineering workflow. Whether
              you're building AI applications, conducting research, or creating content, our tools help you create,
              test, and optimize prompts for large language models.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Key Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <strong>Faster Development:</strong> Build and iterate on prompts 10x faster with our intuitive tools
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <strong>Better Results:</strong> AI-powered optimization improves prompt effectiveness by up to 40%
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <strong>Team Collaboration:</strong> Version control and sharing features for seamless teamwork
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <strong>Data-Driven Decisions:</strong> Comprehensive analytics and A/B testing capabilities
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-xl font-semibold mb-3">What You Can Do</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-medium mb-2">🎯 Create Prompts</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Build sophisticated prompts with parameters, constraints, and dynamic variables
                </p>
              </Card>
              <Card className="p-4">
                <h4 className="font-medium mb-2">🧪 Test & Optimize</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Run A/B tests and analyze performance metrics to find the best prompts
                </p>
              </Card>
              <Card className="p-4">
                <h4 className="font-medium mb-2">📚 Manage Libraries</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Organize prompts in libraries and access curated, high-quality templates
                </p>
              </Card>
              <Card className="p-4">
                <h4 className="font-medium mb-2">📊 Track Performance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monitor analytics and gain insights into prompt effectiveness over time
                </p>
              </Card>
            </div>
          </div>
        </div>
      ),
    },
    "quick-start": {
      title: "Quick Start Guide",
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Get Started in 5 Minutes</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Follow this step-by-step guide to create your first prompt and run your first test.
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    1
                  </span>
                  Create Your First Prompt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  Navigate to the <strong>Prompt Builder</strong> tab and follow these steps:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Enter a descriptive title for your prompt</li>
                  <li>Select a category (e.g., "Creative Writing", "Code Generation")</li>
                  <li>Write your prompt content in the text area</li>
                  <li>Add parameters using {"{parameter_name}"} syntax if needed</li>
                  <li>Click "Save Prompt" to store it in your library</li>
                </ol>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                  <strong>Example:</strong>
                  <br />
                  Title: "Blog Post Generator"
                  <br />
                  Content: "Write a {"{length}"} blog post about {"{topic}"} for {"{audience}"}. Include an engaging
                  introduction, main points, and conclusion."
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    2
                  </span>
                  Test Your Prompt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  Go to the <strong>Testing Environment</strong> tab:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Select your newly created prompt from the dropdown</li>
                  <li>Enter test input in the text area</li>
                  <li>Click "Run Test" to generate output</li>
                  <li>Review the performance metrics and output quality</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    3
                  </span>
                  Refine with AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  Use the <strong>AI Refiner</strong> to improve your prompt:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Select your prompt in the Refiner tab</li>
                  <li>Click "Analyze Prompt" to get AI suggestions</li>
                  <li>Review the improvement recommendations</li>
                  <li>Apply the refined version to your prompt</li>
                </ol>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <strong className="text-blue-700 dark:text-blue-300">Pro Tip:</strong>
                  <p className="text-blue-600 dark:text-blue-400 mt-1">
                    Start with prompts from our Curated Library to see examples of high-quality prompts, then modify
                    them for your specific use case.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    "prompt-builder": {
      title: "Prompt Builder",
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Building Effective Prompts</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The Prompt Builder is your primary tool for creating structured, parameterized prompts. Learn how to use
              all its features to build powerful prompts.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Core Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Title & Category</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Give your prompt a descriptive title and select an appropriate category for organization.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm">
                  <strong>Categories:</strong> Creative Writing, Code Generation, Data Analysis, Question Answering,
                  Summarization, Translation, Classification, Reasoning, Other
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Parameters</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Add dynamic variables to make your prompts reusable. Use {"{parameter_name}"} syntax in your content.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm">
                  <strong>Example:</strong>
                  <br />
                  Parameter: "tone" with default value "professional"
                  <br />
                  Usage: "Write in a {"{tone}"} tone..."
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Constraints</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Define limitations or requirements for the AI's response.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm">
                  <strong>Examples:</strong>
                  <br />• "Keep response under 200 words"
                  <br />• "Use only factual information"
                  <br />• "Include at least 3 examples"
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Tags</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add tags for better organization and searchability of your prompts.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <strong>Be Specific:</strong> Clear, specific instructions yield better results than vague requests
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <strong>Use Examples:</strong> Include examples of desired output format or style
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <strong>Set Context:</strong> Provide relevant background information for better understanding
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <strong>Define Format:</strong> Specify the desired output structure (bullet points, paragraphs, etc.)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    "ab-testing": {
      title: "A/B Testing",
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">A/B Testing Your Prompts</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Compare different versions of your prompts to determine which performs better. Our A/B testing suite
              provides statistical analysis to help you make data-driven decisions.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Creating an A/B Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-3">
                <li>
                  <strong>Navigate to A/B Test Manager:</strong> Click on the "A/B Test" tab in the main interface
                </li>
                <li>
                  <strong>Create New Test:</strong> Click "New A/B Test" button
                </li>
                <li>
                  <strong>Configure Test:</strong>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Enter a descriptive test name</li>
                    <li>Add a description explaining what you're testing</li>
                    <li>Select Prompt A (your control version)</li>
                    <li>Select Prompt B (your variant version)</li>
                  </ul>
                </li>
                <li>
                  <strong>Add Test Inputs:</strong> Create multiple test scenarios to ensure comprehensive comparison
                </li>
                <li>
                  <strong>Run Test:</strong> Execute the test to generate outputs from both prompts
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Understanding Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Performance Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <strong>Relevance:</strong> How well the output addresses the input
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <strong>Coherence:</strong> Logical flow and consistency of the response
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <strong>Accuracy:</strong> Factual correctness and precision
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <strong>Creativity:</strong> Originality and innovative thinking
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Statistical Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Our system automatically calculates:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Win rates for each prompt version</li>
                  <li>Average performance scores</li>
                  <li>Statistical significance indicators</li>
                  <li>Confidence intervals</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <strong className="text-yellow-700 dark:text-yellow-300">Testing Best Practices:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-yellow-600 dark:text-yellow-400">
                    <li>Test one variable at a time for clear results</li>
                    <li>Use diverse test inputs to avoid bias</li>
                    <li>Run tests with sufficient sample size</li>
                    <li>Consider the context and use case when interpreting results</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    "version-control": {
      title: "Version Control",
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Managing Prompt Versions</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Track changes to your prompts over time with our Git-like version control system. Collaborate with team
              members and maintain a complete history of your prompt evolution.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Version Control Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
                  <GitBranch className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">1. Make Changes</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Edit your prompt content, parameters, or constraints in the Prompt Builder
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold">2. Commit Changes</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add a descriptive commit message explaining what changed and why
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-2">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold">3. Collaborate</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Team members can see changes, add comments, and suggest improvements
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 dark:bg-orange-900 rounded-full p-2">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold">4. Revert if Needed</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Easily revert to any previous version if changes don't work as expected
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <strong>Complete History:</strong> View all changes made to a prompt over time
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <strong>Diff Visualization:</strong> See exactly what changed between versions
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <strong>Branching:</strong> Create experimental versions without affecting the main prompt
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <strong>Rollback:</strong> Instantly revert to any previous version
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Example Commit Messages</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline">feat</Badge>
                <span>Add temperature parameter for creativity control</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">fix</Badge>
                <span>Improve clarity in instruction wording</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">refactor</Badge>
                <span>Restructure prompt for better logical flow</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">test</Badge>
                <span>Add constraints based on A/B test results</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  }

  const filteredNavigation = navigation
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase())),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold">PromptStudio</span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Book className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Documentation</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search docs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Link href="/">
                <Button>Open App</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ScrollArea className="h-[calc(100vh-8rem)]">
                <nav className="space-y-6">
                  {filteredNavigation.map((section, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{section.title}</h3>
                      <ul className="space-y-2">
                        {section.items.map((item) => (
                          <li key={item.id}>
                            <button
                              onClick={() => setActiveSection(item.id)}
                              className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                activeSection === item.id
                                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                              }`}
                            >
                              <item.icon className="h-4 w-4" />
                              {item.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </nav>
              </ScrollArea>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="max-w-4xl">
              {content[activeSection as keyof typeof content] ? (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    {content[activeSection as keyof typeof content].title}
                  </h1>
                  {content[activeSection as keyof typeof content].content}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Book className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Documentation Coming Soon
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    This section is currently being written. Check back soon for detailed documentation.
                  </p>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="flex justify-between items-center mt-12 pt-8 border-t">
                <div>{/* Previous page logic would go here */}</div>
                <div>{/* Next page logic would go here */}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
