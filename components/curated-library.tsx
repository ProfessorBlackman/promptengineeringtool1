"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Award, TrendingUp, Star, Download, Eye, Copy } from "lucide-react"

interface CuratedPrompt {
  id: string
  title: string
  content: string
  description: string
  category: string
  useCase: string
  compatibleModels: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
  rating: number
  downloads: number
  author: string
  tags: string[]
  createdAt: Date
}

interface CuratedLibraryProps {
  onImportPrompt?: (prompt: any) => void
}

export default function CuratedLibrary({ onImportPrompt }: CuratedLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedModel, setSelectedModel] = useState("all")
  const [sortBy, setSortBy] = useState<"rating" | "downloads" | "recent">("rating")
  const [selectedPrompt, setSelectedPrompt] = useState<CuratedPrompt | null>(null)

  // Mock curated prompts data
  const mockPrompts: CuratedPrompt[] = [
    {
      id: "1",
      title: "Advanced Creative Writing Assistant",
      content: `You are a professional creative writing assistant. Help me write a {type} story with the following requirements:

Genre: {genre}
Setting: {setting}
Main Character: {character}
Conflict: {conflict}
Tone: {tone}
Length: {length}

Please provide:
1. A compelling opening paragraph
2. Character development suggestions
3. Plot structure outline
4. Dialogue examples
5. Descriptive scene suggestions

Make the story engaging and ensure it follows proper narrative structure.`,
      description: "Comprehensive creative writing assistant for various story types and genres.",
      category: "Creative Writing",
      useCase: "Content Creation",
      compatibleModels: ["GPT-4", "Claude", "Gemini"],
      difficulty: "intermediate",
      rating: 4.8,
      downloads: 1250,
      author: "WritingPro",
      tags: ["storytelling", "creative", "narrative", "fiction"],
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      title: "Code Review Expert",
      content: `Act as a senior software engineer conducting a thorough code review. Analyze the following {language} code:

\`\`\`{language}
{code}
\`\`\`

Please provide a comprehensive review covering:

1. **Code Quality & Best Practices**
   - Adherence to coding standards
   - Code readability and maintainability
   - Proper naming conventions

2. **Performance & Optimization**
   - Potential performance bottlenecks
   - Memory usage considerations
   - Algorithm efficiency

3. **Security Analysis**
   - Potential security vulnerabilities
   - Input validation issues
   - Authentication/authorization concerns

4. **Testing & Error Handling**
   - Error handling completeness
   - Edge case considerations
   - Testability improvements

5. **Specific Improvements**
   - Refactoring suggestions
   - Alternative approaches
   - Modern language features to utilize

Provide specific suggestions with examples.`,
      description: "Comprehensive code review prompt for multiple programming languages.",
      category: "Code Generation",
      useCase: "Development",
      compatibleModels: ["GPT-4", "Claude", "Codex"],
      difficulty: "intermediate",
      rating: 4.9,
      downloads: 2100,
      author: "DevTools Pro",
      tags: ["code-review", "programming", "quality"],
      createdAt: new Date("2024-01-20"),
    },
    {
      id: "3",
      title: "Data Analysis Interpreter",
      content: `Analyze the following dataset and provide insights:

Dataset: {dataset_description}
Data: {data}

Please provide:
1. Summary statistics
2. Key patterns and trends
3. Anomalies or outliers
4. Actionable recommendations
5. Visualizations suggestions

Format your response with clear headings and bullet points.`,
      description: "Professional data analysis prompt for extracting insights from datasets.",
      category: "Data Analysis",
      useCase: "Business Intelligence",
      compatibleModels: ["GPT-4", "Claude", "Gemini"],
      difficulty: "advanced",
      rating: 4.7,
      downloads: 890,
      author: "DataScience Hub",
      tags: ["data-analysis", "statistics", "insights"],
      createdAt: new Date("2024-01-25"),
    },
    {
      id: "4",
      title: "Meeting Summary Generator",
      content: `Summarize the following meeting transcript:

{transcript}

Provide:
1. Key decisions made
2. Action items with assigned owners
3. Important discussion points
4. Next steps and deadlines
5. Unresolved issues

Format as a professional meeting summary.`,
      description: "Transform meeting transcripts into structured, actionable summaries.",
      category: "Summarization",
      useCase: "Business Operations",
      compatibleModels: ["GPT-4", "GPT-3.5", "Claude"],
      difficulty: "beginner",
      rating: 4.6,
      downloads: 1680,
      author: "ProductivityPro",
      tags: ["meetings", "summary", "business"],
      createdAt: new Date("2024-02-01"),
    },
    {
      id: "5",
      title: "Academic Research Assistant",
      content: `Help me research {topic} for an academic paper. Please:

1. Provide an overview of the current state of research
2. Identify key theories and frameworks
3. Suggest 10-15 relevant academic sources
4. Outline potential research questions
5. Highlight gaps in current literature
6. Recommend methodology approaches

Focus on peer-reviewed sources from the last {years} years.`,
      description: "Comprehensive academic research assistance for scholarly work.",
      category: "Question Answering",
      useCase: "Academic Research",
      compatibleModels: ["GPT-4", "Claude", "Gemini"],
      difficulty: "advanced",
      rating: 4.9,
      downloads: 750,
      author: "AcademicAI",
      tags: ["research", "academic", "literature-review"],
      createdAt: new Date("2024-02-05"),
    },
  ]

  const categories = ["all", ...new Set(mockPrompts.map((p) => p.category))]
  const difficulties = ["all", "beginner", "intermediate", "advanced"]
  const models = ["all", ...new Set(mockPrompts.flatMap((p) => p.compatibleModels))]

  const filteredPrompts = mockPrompts
    .filter((prompt) => {
      const matchesSearch =
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === "all" || prompt.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === "all" || prompt.difficulty === selectedDifficulty
      const matchesModel = selectedModel === "all" || prompt.compatibleModels.includes(selectedModel)

      return matchesSearch && matchesCategory && matchesDifficulty && matchesModel
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "downloads":
          return b.downloads - a.downloads
        case "recent":
          return b.createdAt.getTime() - a.createdAt.getTime()
        default:
          return 0
      }
    })

  const importPrompt = (curatedPrompt: CuratedPrompt) => {
    onImportPrompt?.({
      title: curatedPrompt.title,
      content: curatedPrompt.content,
      category: curatedPrompt.category,
      tags: [...curatedPrompt.tags, "curated", "imported"],
      constraints: [],
      parameters: {},
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Curated Prompt Library
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            High-quality, community-vetted prompts for various use cases
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {mockPrompts.length} Prompts
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger>
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map((difficulty) => (
              <SelectItem key={difficulty} value={difficulty}>
                {difficulty === "all" ? "All Levels" : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger>
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model} value={model}>
                {model === "all" ? "All Models" : model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value: "rating" | "downloads" | "recent") => setSortBy(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="downloads">Most Downloaded</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredPrompts.length} of {mockPrompts.length} prompts
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrompts.map((prompt) => (
          <Card key={prompt.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{prompt.title}</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPrompt(prompt)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => importPrompt(prompt)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline">{prompt.category}</Badge>
                <Badge className={getDifficultyColor(prompt.difficulty)}>{prompt.difficulty}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{prompt.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {prompt.rating}
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {prompt.downloads.toLocaleString()}
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {prompt.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {prompt.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{prompt.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="text-xs text-gray-500">
                by {prompt.author} • {prompt.createdAt.toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400">No prompts found matching your criteria.</p>
        </div>
      )}

      {/* Prompt Details Dialog */}
      <Dialog open={!!selectedPrompt} onOpenChange={() => setSelectedPrompt(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedPrompt?.title}
              <Badge className={getDifficultyColor(selectedPrompt?.difficulty || "")}>
                {selectedPrompt?.difficulty}
              </Badge>
            </DialogTitle>
            <DialogDescription>{selectedPrompt?.description}</DialogDescription>
          </DialogHeader>

          {selectedPrompt && (
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Prompt Content</h4>
                  <ScrollArea className="h-60 w-full border rounded-md p-3">
                    <pre className="text-sm whitespace-pre-wrap">{selectedPrompt.content}</pre>
                  </ScrollArea>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => navigator.clipboard.writeText(selectedPrompt.content)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button onClick={() => importPrompt(selectedPrompt)}>
                    <Download className="h-4 w-4 mr-2" />
                    Import to Library
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Metadata</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Author:</strong> {selectedPrompt.author}
                      </div>
                      <div>
                        <strong>Category:</strong> {selectedPrompt.category}
                      </div>
                      <div>
                        <strong>Use Case:</strong> {selectedPrompt.useCase}
                      </div>
                      <div>
                        <strong>Created:</strong> {selectedPrompt.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <strong>Rating:</strong> {selectedPrompt.rating}/5
                      </div>
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        <strong>Downloads:</strong> {selectedPrompt.downloads.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPrompt.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="compatibility" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Compatible Models</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedPrompt.compatibleModels.map((model) => (
                      <div key={model} className="flex items-center gap-2 p-2 border rounded">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">{model}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Recommended Parameters</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>• Temperature: 0.7-0.9 for creative tasks</p>
                    <p>• Max tokens: 1000-2000 depending on use case</p>
                    <p>• Top-p: 0.9 for balanced creativity</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
