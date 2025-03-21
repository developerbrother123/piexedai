import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { together } from "@ai-sdk/together"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const { command, context } = await req.json()

    if (!command) {
      return NextResponse.json({ error: "Command is required" }, { status: 400 })
    }

    // Process the voice command
    const response = await processVoiceCommand(command, context)

    return NextResponse.json({ result: response })
  } catch (error) {
    console.error("Error processing voice command:", error)
    return NextResponse.json({ error: "Failed to process voice command" }, { status: 500 })
  }
}

async function processVoiceCommand(command: string, context: any = {}) {
  // Use Together AI to process the command
  const { text } = await generateText({
    model: together("mistralai/Mixtral-8x7B-Instruct-v0.1"),
    prompt: `You are Jarvis, an AI development assistant that can automate tasks based on voice commands.
    
    Context: ${JSON.stringify(context)}
    
    Voice Command: "${command}"
    
    Analyze this voice command and determine:
    1. The type of development task being requested
    2. The specific actions needed to complete the task
    3. Any code, configurations, or files that need to be created or modified
    4. A step-by-step plan to execute the task
    
    Respond with a JSON object containing:
    {
      "taskType": "string", // e.g., "code-generation", "debugging", "deployment", "file-management"
      "actions": ["string"], // list of specific actions to take
      "resources": ["string"], // list of resources needed
      "code": "string", // any code to be generated (if applicable)
      "plan": ["string"], // step-by-step plan
      "response": "string" // human-readable response to the user
    }`,
    temperature: 0.2,
    maxTokens: 2048,
  })

  try {
    // Parse the response as JSON
    const parsedResponse = JSON.parse(text)
    return parsedResponse
  } catch (error) {
    console.error("Error parsing AI response:", error)
    return {
      taskType: "error",
      actions: [],
      resources: [],
      code: "",
      plan: [],
      response: "I'm sorry, I couldn't process that command. Please try again with more specific instructions.",
    }
  }
}

