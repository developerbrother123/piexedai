"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, Play, Square, Loader2, Terminal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

// Declare webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any
  }
}

export function VoiceCommand({ onResult }: { onResult?: (result: any) => void }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Initialize speech recognition
    if ("webkitSpeechRecognition" in window) {
      // @ts-ignore
      recognitionRef.current = new webkitSpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join("")

        setTranscript(transcript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
        setError(`Speech recognition error: ${event.error}`)
      }
    } else {
      setError("Speech recognition is not supported in your browser")
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)

      // Process the command if there's a transcript
      if (transcript) {
        processCommand(transcript)
      }
    } else {
      setTranscript("")
      setResult(null)
      setError(null)
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  const processCommand = async (command: string) => {
    setIsProcessing(true)

    try {
      const response = await fetch("/api/voice-command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command,
          context: {
            currentProject: "Piexed AI",
            currentFile: "voice-command.tsx",
            environment: "development",
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data.result)

      if (onResult) {
        onResult(data.result)
      }
    } catch (err: any) {
      console.error("Error processing command:", err)
      setError(`Error processing command: ${err.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setTranscript("")
    setResult(null)
    setError(null)
  }

  const handleExecute = () => {
    // In a real app, this would execute the generated code or actions
    console.log("Executing:", result)
    // Show a success message
    alert("Command executed successfully!")
  }

  return (
    <Card className={`transition-all duration-300 ${isExpanded ? "w-full" : "w-96"}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Terminal className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Jarvis Voice Commands</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <div className="relative">
                  <div
                    className={`p-3 rounded-md min-h-[100px] text-sm ${
                      isListening ? "bg-red-500/10 border border-red-500/20" : "bg-muted"
                    }`}
                  >
                    {transcript ||
                      (isListening ? "Listening..." : "Click the microphone button and speak a command...")}
                  </div>

                  {isListening && (
                    <div className="absolute top-2 right-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button
                    variant={isListening ? "destructive" : "default"}
                    onClick={toggleListening}
                    disabled={isProcessing}
                  >
                    {isListening ? (
                      <>
                        <Square className="mr-2 h-4 w-4" />
                        Stop Listening
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-4 w-4" />
                        Start Listening
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={isListening || isProcessing || (!transcript && !result)}
                  >
                    Reset
                  </Button>
                </div>

                {isProcessing && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Processing command...</span>
                  </div>
                )}

                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm">{error}</div>
                )}

                {result && (
                  <div className="space-y-4">
                    <div className="p-3 rounded-md bg-muted">
                      <h4 className="font-medium mb-2">Response:</h4>
                      <p className="text-sm">{result.response}</p>
                    </div>

                    {result.taskType && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium mr-2">Task Type:</span>
                        <span>{result.taskType}</span>
                      </div>
                    )}

                    {result.actions && result.actions.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Actions:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {result.actions.map((action: string, index: number) => (
                            <li key={index}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.code && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Generated Code:</h4>
                        <SyntaxHighlighter
                          language="javascript"
                          style={vscDarkPlus}
                          customStyle={{ fontSize: "0.8rem" }}
                        >
                          {result.code}
                        </SyntaxHighlighter>
                      </div>
                    )}

                    <Button onClick={handleExecute} disabled={!result || isProcessing} className="w-full">
                      <Play className="mr-2 h-4 w-4" />
                      Execute Command
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isExpanded && (
          <div className="text-center text-sm text-muted-foreground">
            {isListening ? (
              <span className="flex items-center justify-center">
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Listening...
              </span>
            ) : (
              "Click to expand"
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

