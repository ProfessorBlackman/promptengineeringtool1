import {NextRequest, NextResponse} from 'next/server'
import {firestore} from '@/lib/firebase'
import {doc, getDoc} from 'firebase/firestore'

interface RefinePromptRequest {
    userId: string
    llmId: string
    apiKeyId?: string
    prompt: string
    extraInstructions?: string
}

interface LLMDoc {
    name: string
    provider: string
    description: string
    modelId: string
    endpoint?: string
    apiUrl: string
    capabilities: string[]
    strengths: string[]
    isPublic: boolean
}

interface APIKeyDoc {
    name: string
    provider: string
    keyValue: string
    description?: string
    isActive: boolean
}

interface RefinePromptResponse {
    score: number
    refinedPrompt: string
    suggestions: Array<{
        type: 'clarity' | 'specificity' | 'effectiveness' | 'structure'
        title: string
        description: string
        before: string
        after: string
        impact: 'high' | 'medium' | 'low'
    }>
    strengths: string[]
    weaknesses: string[]
}

export async function POST(request: NextRequest) {
    try {
        const body: RefinePromptRequest = await request.json()
        const {userId, llmId, apiKeyId, prompt, extraInstructions} = body

        // Validate required fields
        if (!userId || !llmId || !prompt) {
            return NextResponse.json(
                {error: 'Missing required fields: userId, llmId, and prompt are required'},
                {status: 400}
            )
        }

        // Fetch LLM details from database
        const llmRef = doc(firestore, 'users', userId, 'llms', llmId)
        const llmSnap = await getDoc(llmRef)

        if (!llmSnap.exists()) {
            // Try to fetch from public LLMs
            const publicLlmRef = doc(firestore, 'public_llms', llmId)
            const publicLlmSnap = await getDoc(publicLlmRef)

            if (!publicLlmSnap.exists()) {
                return NextResponse.json(
                    {error: 'LLM not found'},
                    {status: 404}
                )
            }
        }

        const llmData = llmSnap.exists() ? llmSnap.data() as LLMDoc : (await getDoc(doc(firestore, 'public_llms', llmId))).data() as LLMDoc

        // Fetch API key if provided
        let apiKeyData: APIKeyDoc | null = null
        if (apiKeyId) {
            const apiKeyRef = doc(firestore, 'users', userId, 'api_keys', apiKeyId)
            const apiKeySnap = await getDoc(apiKeyRef)

            if (apiKeySnap.exists()) {
                apiKeyData = apiKeySnap.data() as APIKeyDoc

                if (!apiKeyData.isActive) {
                    return NextResponse.json(
                        {error: 'API key is not active'},
                        {status: 400}
                    )
                }
            }
        }

        // Construct the refining prompt
        const systemPrompt = `You are an expert prompt engineer with deep knowledge of AI interaction patterns, cognitive psychology, and effective communication strategies. Your task is to analyze and refine user-provided prompts to maximize their effectiveness, clarity, and reliability.

## Analysis Framework
Evaluate each prompt across these dimensions:
- **Clarity**: How clear and unambiguous are the instructions?
- **Specificity**: Are the requirements and desired outputs well-defined?
- **Structure**: Is the prompt logically organized and easy to follow?
- **Completeness**: Does it include all necessary context and constraints?
- **Effectiveness**: Will it reliably produce the intended outcomes?
- **Scalability**: How well will it work across different scenarios?

## Your Response Requirements
Provide a comprehensive analysis in valid JSON format with the following structure:

{
  "score": number, // 1-100 based on overall prompt quality
  "refinedPrompt": "string", // Your improved version
  "suggestions": [
    {
      "category": "clarity" | "specificity" | "structure" | "completeness" | "effectiveness" | "scalability",
      "title": "string", // Brief, actionable title
      "description": "string", // Detailed explanation of the issue and solution
      "before": "string", // Specific problematic text from original
      "after": "string", // Your improved version
      "impact": "high" | "medium" | "low", // Expected improvement impact
      "rationale": "string" // Why this change improves the prompt
    }
  ],
  "strengths": ["string"], // What the original prompt does well
  "areas_for_improvement": ["string"], // Key weaknesses identified
  "implementation_tips": ["string"] // Practical advice for using the refined prompt
}

## Scoring Criteria
- 90-100: Exceptional - Clear, specific, well-structured, comprehensive
- 80-89: Strong - Minor improvements needed
- 70-79: Good - Several areas for enhancement
- 60-69: Fair - Significant improvements required
- 50-59: Poor - Major restructuring needed
- Below 50: Very poor - Fundamental issues present

## Guidelines
- Focus on actionable, specific improvements
- Explain the reasoning behind each suggestion
- Maintain the original intent while enhancing effectiveness
- Consider edge cases and potential failure modes
- Prioritize changes by impact potential

${extraInstructions ? `\n## Additional Context\n${extraInstructions}` : ''}`

        const userMessage = `Please analyze and refine the following prompt to enhance its clarity, specificity, structure,completeness, effectiveness, and scalability. Provide a detailed critique along with a refined version of the prompt.' +
            '{"intent": ${llmData.description},"prompt": ${prompt}}`

        // Make request to LLM API
        const refinedResult = await makeRequestToLLM(llmData, apiKeyData, systemPrompt, userMessage)

        return NextResponse.json(refinedResult)

    } catch (error) {
        console.error('Error refining prompt:', error)
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        )
    }
}

async function makeRequestToLLM(
    llm: LLMDoc,
    apiKey: APIKeyDoc | null,
    systemPrompt: string,
    userMessage: string
) {
    const {apiUrl, provider} = llm

    // Default request structure for common providers
    let headers: Record<string, string> = {
        'Content-Type': 'application/json'
    }

    let body: any = {}
    // Define response schema for structured output
    const responseSchema = {
        type: "OBJECT",
        properties: {
            score: { type: "NUMBER" },
            refinedPrompt: { type: "STRING" },
            suggestions: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        type: { type: "STRING", enum: ["clarity", "specificity", "effectiveness", "structure"] },
                        title: { type: "STRING" },
                        description: { type: "STRING" },
                        before: { type: "STRING" },
                        after: { type: "STRING" },
                        impact: { type: "STRING", enum: ["high", "medium", "low"] }
                    },
                    propertyOrdering: ["type", "title", "description", "before", "after", "impact"]
                }
            },
            strengths: {
                type: "ARRAY",
                items: { type: "STRING" }
            },
            weaknesses: {
                type: "ARRAY",
                items: { type: "STRING" }
            }
        },
        propertyOrdering: ["score", "refinedPrompt", "suggestions", "strengths", "weaknesses"]
    }
    // Default structures for common providers
    switch (provider.toLowerCase()) {
        case 'openai':
            headers['Authorization'] = `Bearer ${apiKey?.keyValue}`
            body = {
                model: llm.modelId,
                messages: [
                    {role: 'system', content: systemPrompt},
                    {role: 'user', content: userMessage}
                ],
                temperature: 0.7,
                max_tokens: 2000
                // Note: OpenAI does not support responseSchema yet
            }
            break

        case 'anthropic':
            headers['x-api-key'] = apiKey?.keyValue || ''
            headers['anthropic-version'] = '2023-06-01'
            body = {
                model: llm.modelId,
                max_tokens: 2000,
                messages: [
                    {role: 'user', content: `${systemPrompt}\n\n${userMessage}`}
                ]
                // Note: Anthropic does not support responseSchema yet
            }
            break

        case 'google':
            headers['x-goog-api-key'] = apiKey?.keyValue || ''
            body = {
                system_instruction: {
                    parts: [
                        {text: systemPrompt}
                    ]
                },
                contents: [{
                    parts: [{
                        text: userMessage
                    }]
                }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema
                }
            }
            break

        default:
            // Generic structure
            body = {
                prompt: `${systemPrompt}\n\n${userMessage}`,
                max_tokens: 2000,
                temperature: 0.7
                // Note: Add responseSchema here if provider supports it
            }
            if (apiKey?.keyValue) {
                headers['Authorization'] = `Bearer ${apiKey.keyValue}`
            }
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error(`LLM API request failed: ${response.status} ${errorText}`)
            throw new Error(`LLM API request failed: ${response.status} ${response.statusText}`)
        }

        const responseData = await response.json()

        // Extract content based on response mapping or provider defaults
        console.log("responseData")
        console.log(responseData)
        let content = ''
        // Default extraction for common providers
        switch (provider.toLowerCase()) {
            case 'openai':
                content = responseData.choices?.[0]?.message?.content || ''
                break
            case 'anthropic':
                content = responseData.content?.[0]?.text || ''
                break
            case 'google':
                content = responseData.candidates?.[0]?.content?.parts?.[0]?.text || ''
                break
            default:
                content = responseData.content || responseData.text || responseData.response || ''
        }

        // Parse the JSON response from the LLM
        try {
            const res = JSON.parse(content)
            return res as RefinePromptResponse
        } catch (parseError) {
            // If JSON parsing fails, return a fallback structure
            return {
                score: 75,
                refinedPrompt: content,
                suggestions: [
                    {
                        type: 'effectiveness',
                        title: 'AI-generated refinement',
                        description: 'The AI has provided a refined version of your prompt.',
                        before: 'Original prompt',
                        after: 'Refined prompt',
                        impact: 'medium'
                    }
                ],
                strengths: ['Original prompt provided good foundation'],
                weaknesses: ['Could benefit from more specific guidelines']
            }
        }

    } catch (error) {
        console.error('Error making request to LLM:', error)
        throw new Error('Failed to communicate with the selected LLM')
    }
}

// Helper function to get nested object values using dot notation
function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
}
