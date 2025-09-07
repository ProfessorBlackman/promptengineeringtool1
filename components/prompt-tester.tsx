"use client"

import type React from "react"
import {useEffect, useState} from "react"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Badge} from "@/components/ui/badge"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Play, Clock, Settings, Target} from "lucide-react"
import LLMSelectorModal from "@/components/llm-selector-modal"
import {type APIKeyDoc, listPrompts, type LLMDoc} from "@/lib/db"
import {useAuth} from "@/components/auth-provider";
import remarkGfm from "remark-gfm"
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter"
import {materialLight, oneDark} from "react-syntax-highlighter/dist/cjs/styles/prism"
import MarkdownRenderer from "@/components/markdown-renderer";

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
    is_system_prompt: boolean
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
    recommended?: boolean
}

interface TestOutput {
    output: {
        strengths: string[]
        issues: string[]
        suggestions: string[]
    }
    score: any
    justification: string
    timestamp: string
    llmUsed: string
    input: string
    goldenAnswer: string
}

/**
 * Strips Markdown code block markers from a string and returns the JSON content.
 * @param data - The string containing the JSON code block.
 * @returns The parsed JSON object.
 */
function extractJsonFromCodeBlock(data: string): any {
    // Remove leading and trailing code block markers
    const jsonString = data
        .replace(/^```json\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
    return JSON.parse(jsonString);
}


export default function PromptTester() {
    const [selectedPromptId, setSelectedPromptId] = useState<string>("")
    const [testInput, setTestInput] = useState("")
    const [goldenAnswer, setGoldenAnswer] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [currentTest, setCurrentTest] = useState<TestOutput | null>(null)
    const [showLLMModal, setShowLLMModal] = useState(false)
    const [selectedLLM, setSelectedLLM] = useState<LLMOption | null>(null)
    const [prompts, setPrompts] = useState<Prompt[]>([])
    const [apiKey, setApiKey] = useState<(APIKeyDoc & { id: string }) | null>(null)
    const {user} = useAuth()

    // Fetch prompts from Firestore
    useEffect(() => {
        async function fetchPrompts() {
            if (!user) return
            try {
                const result = await listPrompts(user?.uid || "")
                setPrompts(result)
            } catch (err) {
                console.error("Failed to fetch prompts", err)
            }
        }

        fetchPrompts()
    }, [])

    const selectedPrompt = prompts.find((p) => p.id === selectedPromptId)

    const runTest = async () => {
        if (!selectedPrompt || !testInput.trim() || !selectedLLM || !goldenAnswer.trim()) return
        setIsLoading(true)
        try {
            console.log("this is the api key in tester", apiKey)
            const res = await fetch("/api/run-test", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    prompt: selectedPrompt,
                    input: testInput,
                    goldenAnswer,
                    llm: selectedLLM,
                    apiKey: apiKey
                }),
            })
            const data = await res.json()
            console.log("Test result:", data)
            const outputInJson = extractJsonFromCodeBlock(data.output)
            setCurrentTest({
                output: outputInJson,
                score: data.score,
                justification: data.justification,
                timestamp: new Date().toDateString(),
                llmUsed: selectedLLM.name,
                input: testInput,
                goldenAnswer,
            })
        } catch (error) {
            console.error("Test failed:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLLMSelect = (llm: LLMDoc & { id: string }, apiKey?: APIKeyDoc & { id: string }) => {
        console.log("Selected LLM:", llm, "with API")
        console.log(apiKey)
        setSelectedLLM(llm)
        setApiKey(apiKey || null)
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
                                <Settings className="h-4 w-4"/>
                                {selectedLLM ? selectedLLM.name : "Select Model"}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {selectedLLM && (
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{selectedLLM.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                        {selectedLLM.provider}
                                    </Badge>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{selectedLLM.description}</p>
                            </div>
                        )}
                        <div>
                            <Label>Select Prompt</Label>
                            <Select value={selectedPromptId} onValueChange={setSelectedPromptId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a prompt to test"/>
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
                                <div
                                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">{selectedPrompt.content}</div>
                                {selectedPrompt.parameters && selectedPrompt.parameters.length > 0 && (
                                    <div className="mt-2">
                                        <Label className="text-xs">Parameters:</Label>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {selectedPrompt.parameters.map((param: any) => (
                                                <Badge key={param.name} variant="outline" className="text-xs">
                                                    {param.name}: {param.defaultValue}
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
                        <div>
                            <Label htmlFor="goldenAnswer">Golden Answer</Label>
                            <Textarea
                                id="goldenAnswer"
                                value={goldenAnswer}
                                onChange={(e) => setGoldenAnswer(e.target.value)}
                                placeholder="Enter the expected/golden answer for comparison..."
                                className="min-h-[80px]"
                            />
                        </div>
                        <Button
                            onClick={runTest}
                            disabled={!selectedPrompt || !testInput.trim() || !goldenAnswer.trim() || isLoading || !selectedLLM}
                            className="w-full"
                        >
                            {isLoading ? (
                                <>
                                    <Clock className="h-4 w-4 mr-2 animate-spin"/>
                                    Testing with {selectedLLM?.name}...
                                </>
                            ) : (
                                <>
                                    <Play className="h-4 w-4 mr-2"/>
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
                                ? `Score and analysis from Gemini for ${selectedPrompt?.title || currentTest.llmUsed}`
                                : "Performance metrics and output analysis"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {currentTest ? (
                            <Tabs defaultValue="output" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="output">Output</TabsTrigger>
                                    <TabsTrigger value="score">Score</TabsTrigger>
                                </TabsList>
                                <TabsContent value="output" className="space-y-4">
                                    <div>
                                        <Label>Strengths</Label>
                                        <div
                                            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm max-h-80 overflow-y-auto">
                                            {currentTest.output.strengths.map((strength, idx) => (
                                                <Badge key={idx} variant="default" className="mr-1 mb-1 dark:bg-blue-900">
                                                    <MarkdownRenderer content={strength} isHighlighted={false}
                                                                      proseSize="sm" className="text-sm mr-1 mb-1 text-gray-700 dark:text-gray-400"/>
                                                </Badge>
                                            ))}
                                        </div>
                                        <Label>Issues</Label>
                                        <div
                                            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm max-h-80 overflow-y-auto">
                                            {currentTest.output.issues.map((issue, idx) => (
                                                <Badge key={idx} variant="destructive" className="mr-1 mb-1 dark:bg-red-900">
                                                    <MarkdownRenderer content={issue} isHighlighted={false}
                                                                      proseSize="sm" className="text-sm mr-1 mb-1 text-gray-700 dark:text-gray-400"/>
                                                </Badge>
                                            ))}
                                        </div>
                                        <Label>Suggestions</Label>
                                        <div
                                            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm max-h-80 overflow-y-auto">
                                            {currentTest.output.suggestions.map((suggestion, idx) => (
                                                <Badge key={idx} variant="secondary" className="mr-1 mb-1 dark:bg-gray-900">
                                                    <MarkdownRenderer content={suggestion} isHighlighted={false}
                                                                      proseSize="sm" className="text-sm mr-1 mb-1 text-gray-700 dark:text-gray-400"/>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span>Model: {currentTest.llmUsed}</span>
                                        <span>Generated: {currentTest.timestamp.toLocaleString()}</span>
                                    </div>
                                </TabsContent>
                                <TabsContent value="score" className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label>Score</Label>
                                        <Badge
                                            variant={getMetricBadgeVariant(currentTest.score)}>{currentTest.score}%</Badge>
                                    </div>
                                    <div>
                                        <Label>Justification</Label>
                                        <div
                                            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm max-h-max overflow-y-auto">
                                            <MarkdownRenderer content={currentTest.justification}
                                                              proseSize="sm"/>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Target className="h-12 w-12 mx-auto mb-4 opacity-50"/>
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
