import { NextRequest, NextResponse } from "next/server"

// Utility to inject input into prompt
function injectInput(prompt: any, input: string) {
  let content = prompt.content
  if (prompt.parameters) {
    Object.entries(prompt.parameters).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{${key}}`, "g"), value)
    })
  }
  // Replace a generic {input} if present
  content = content.replace(/{input}/g, input)
  return content
}

export async function POST(req: NextRequest) {
  const { prompt, input, goldenAnswer, llm } = await req.json()

  // Step 1: Prepare the message for the selected LLM
  let aiPrompt: string
  let systemPrompt: string | undefined
  if (prompt.is_system_prompt) {
    systemPrompt = prompt.content
    aiPrompt = input
  } else {
    systemPrompt = undefined
    aiPrompt = injectInput(prompt, input)
  }

  // Step 2: Call the selected LLM (mocked for now)
  // Replace this with actual API call to the selected LLM
  const aiOutput = `Simulated output for prompt: ${aiPrompt}`

  // Step 3: Feed output and golden answer to Gemini for scoring
  // Replace this with actual Gemini API call
  // Example prompt for Gemini:
  const geminiPrompt = `Compare the following AI output to the golden answer. Assign a score from 0-100 based on similarity and provide justification.\n\nAI Output:\n${aiOutput}\n\nGolden Answer:\n${goldenAnswer}`

  // Simulate Gemini response
  const score = Math.floor(Math.random() * 40 + 60) // 60-100
  const justification = `The AI output matches the golden answer in key aspects. Score: ${score}. (Simulated)`

  return NextResponse.json({
    output: aiOutput,
    score,
    justification,
  })
}

