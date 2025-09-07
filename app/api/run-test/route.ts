import {NextRequest, NextResponse} from "next/server"
import {GeminiAnalysisResponse} from "@/lib/types";
import {APIKeyDoc, LLMDoc} from "@/lib/db";

// Utility to inject input into prompt
function injectInput(prompt: any, input: string) {
    let content = prompt.content
    if (prompt.parameters && Array.isArray(prompt.parameters)) {
        prompt.parameters.forEach((param: any) => {
            content = content.replace(new RegExp(`{${param.name}}`, "g"), param.defaultValue)
        })
    }
    // Replace a generic {input} if present
    content = content.replace(/{input}/g, input)
    return content
}

async function makeRequestToLLM(llm: LLMDoc, apiKey: APIKeyDoc, systemPrompt: string, userInput: string) {
    const {apiUrl, provider, modelId} = llm
    let headers: Record<string, string> = {
        'Content-Type': 'application/json'
    }
    let body
    console.log("Making request to LLM:", {apiUrl, provider, modelId, systemPrompt, userInput, apiKey})
    if (!apiUrl) throw new Error('LLM API URL is missing')
    if (!modelId) throw new Error('LLM model ID is missing')
    if (!provider) throw new Error('LLM provider is missing')
    switch (provider.toLowerCase()) {
        case 'openai':
            headers['Authorization'] = `Bearer ${apiKey.keyValue}`
            body = {
                model: modelId,
                messages: [
                    systemPrompt ? {role: 'system', content: systemPrompt} : null,
                    {role: 'user', content: userInput}
                ].filter(Boolean),
                temperature: 0.7,
                max_tokens: 2000
            }
            break
        case 'anthropic':
            headers['x-api-key'] = apiKey.keyValue
            headers['anthropic-version'] = '2023-06-01'
            body = {
                model: modelId,
                max_tokens: 2000,
                messages: [
                    {role: 'user', content: `${systemPrompt ? systemPrompt + '\n\n' : ''}${userInput}`}
                ]
            }
            break
        case 'google':
        case 'gemini':
            headers['x-goog-api-key'] = apiKey.keyValue
            body = {
                system_instruction: systemPrompt ? {parts: [{text: systemPrompt}]} : undefined,
                contents: [{parts: [{text: userInput}]}],
                generationConfig: {
                    responseMimeType: "text/plain"
                }
            }
            break
        default:
            body = {
                prompt: `${systemPrompt ? systemPrompt + '\n\n' : ''}${userInput}`,
                max_tokens: 2000,
                temperature: 0.7
            }
            if (apiKey?.keyValue) headers['Authorization'] = `Bearer ${apiKey.keyValue}`
    }
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    })
    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`LLM API request failed: ${response.status} ${errorText}`)
    }
    const responseData = await response.json()
    let content
    switch (provider.toLowerCase()) {
        case 'openai':
            content = responseData.choices?.[0]?.message?.content || ''
            break
        case 'anthropic':
            content = responseData.content?.[0]?.text || ''
            break
        case 'google':
        case 'gemini':
            content = responseData.candidates?.[0]?.content?.parts?.[0]?.text || ''
            break
        default:
            content = responseData.content || responseData.text || responseData.response || ''
    }
    return content
}

async function makeRequestToGemini(goldenAnswer: string, aiOutput: string, prompt: any) {
    const geminiApiUrl = process.env.GEMINI_API_URL
    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiUrl || !geminiApiKey) throw new Error('Gemini API config missing')
    const responseSchema = {
        type: "OBJECT",
        properties: {
            score: {type: "NUMBER"},
            justification: {type: "STRING"}
        },
        propertyOrdering: ["score", "justification"]
    }
    const analysisPrompt = `Compare the following AI output to the golden answer.
Original Prompt: ${prompt.content}
Prompt Description: ${prompt.description || 'No description provided'}
AI Output: ${aiOutput}
Golden Answer: ${goldenAnswer}
Please provide your evaluation with a score (0-100) and detailed justification.`

    const body = {
        system_instruction: {
            parts: [{
                text: "You are an expert AI evaluator specializing in assessing AI-generated responses against golden standards.\n" +
                    "You will be provided with:\n" +
                    "\n" +
                    "The original prompt used to generate the AI response\n" +
                    "A description of that prompt's intent and purpose\n" +
                    "The AI-generated output to be evaluated\n" +
                    "The golden answer representing the ideal response\n" +
                    "\n" +
                    "Your evaluation process follows these steps:\n" +
                    "\n" +
                    "Assign a score from 0-100 based on how similar the AI output is to the golden answer\n" +
                    "Assess if the user's intention in the prompt description has been met\n" +
                    "Provide a comprehensive justification for the score, referencing both similarity and intent fulfillment\n" +
                    "\n" +
                    "Your justification should clearly explain:\n" +
                    "\n" +
                    "Why the score was assigned\n" +
                    "What aspects matched or did not match between the AI output and golden answer\n" +
                    "Whether the output fulfills the user's intent described in the prompt\n" +
                    "Specific examples from both outputs to support your assessment\n" +
                    "\n" +
                    "Be objective, thorough, and constructive in your evaluation."
            }]
        },
        contents: [{parts: [{text: analysisPrompt}]}],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema
        }
    }
    const headers = {
        'Content-Type': 'application/json',
        'x-goog-api-key': geminiApiKey
    }
    const response = await fetch(geminiApiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    })
    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Gemini API request failed: ${response.status} ${errorText}`)
    }
    const responseData = await response.json()
    let content = responseData.candidates?.[0]?.content?.parts?.[0]?.text || ''
    try {
        return JSON.parse(content)
    } catch {
        return {
            score: 70,
            justification: content || 'Could not parse Gemini response.'
        }
    }
}

export async function POST(req: NextRequest) {
    console.log("Received request to /api/run-test")
    try {
        const {prompt, input, goldenAnswer, llm, apiKey} = await req.json()
        if (!prompt || !input || !goldenAnswer || !llm) {
            return NextResponse.json({error: 'Missing required parameters'}, {status: 400})
        }
        let systemPrompt: string
        let userInput: string
        if (prompt.is_system_prompt) {
            systemPrompt = prompt.content || ""
            userInput = input
        } else {
            systemPrompt = ""
            userInput = injectInput(prompt, input)
        }
        // Step 1: Get AI output from the selected LLM
        const aiOutput = await makeRequestToLLM(llm, apiKey, systemPrompt, userInput)
        // Step 2: Get Gemini analysis
        const geminiResult: GeminiAnalysisResponse = await makeRequestToGemini(goldenAnswer, aiOutput, prompt)
        return NextResponse.json({
            output: aiOutput,
            score: geminiResult.score,
            justification: geminiResult.justification
        })
    } catch (error: any) {
        console.error("Error in /api/run-test:", error)
        return NextResponse.json({error: error.message || 'Internal server error'}, {status: 500})
    }
}