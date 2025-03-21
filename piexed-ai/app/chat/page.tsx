"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  ArrowUp,
  Mic,
  Image,
  FileCode,
  Settings,
  Sparkles,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  Video,
  Music,
  Code,
  Braces,
  Cpu,
  Zap,
  PanelRight,
  X,
  Maximize2,
  Minimize2,
  MoreVertical,
  Upload,
  Trash2,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

// Declare webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any
  }
}

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm Piexed AI, your advanced AI assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [selectedModel, setSelectedModel] = useState("pi-alpha")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState(null)
  const [activeTab, setActiveTab] = useState("chat")
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [showSettings, setShowSettings] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Reset copied message ID after 2 seconds
  useEffect(() => {
    if (copiedMessageId) {
      const timeout = setTimeout(() => {
        setCopiedMessageId(null)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [copiedMessageId])

  // Voice recognition setup
  useEffect(() => {
    let recognition: any = null

    if (isListening) {
      if ("webkitSpeechRecognition" in window) {
        // @ts-ignore
        recognition = new window.webkitSpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join("")

          setInput(transcript)
        }

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error)
          setIsListening(false)
        }

        recognition.start()
      } else {
        alert("Speech recognition is not supported in your browser")
        setIsListening(false)
      }
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [isListening])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Simulate API call to AI model
      setTimeout(() => {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: generateResponse(input),
          timestamp: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error sending message:", error)
      setIsLoading(false)

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm sorry, I encountered an error processing your request. Please try again.",
          timestamp: new Date().toISOString(),
          error: true,
        },
      ])
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Handle image upload
    const reader = new FileReader()
    reader.onload = (event) => {
      const userMessage = {
        id: Date.now().toString(),
        role: "user",
        content: `[Uploaded an image: ${file.name}]`,
        timestamp: new Date().toISOString(),
        image: event.target.result,
      }

      setMessages((prev) => [...prev, userMessage])

      // Simulate processing the image
      setIsLoading(true)
      setTimeout(() => {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I've analyzed the image you uploaded. What would you like to know about it?",
          timestamp: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)
      }, 1500)
    }
    reader.readAsDataURL(file)
  }

  const handleVideoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Handle video upload
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: `[Uploaded a video: ${file.name}]`,
      timestamp: new Date().toISOString(),
      video: URL.createObjectURL(file),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate processing the video
    setIsLoading(true)
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I've received your video. What would you like me to do with it? I can analyze its content, edit it, or extract information from it.",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 2000)
  }

  const handleCopyMessage = (content) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopiedMessageId(content)
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
      })
  }

  const handleFeedback = (messageId, type) => {
    // In a real app, you would send this feedback to your API
    console.log(`Feedback for message ${messageId}: ${type}`)

    // Update the UI to show the feedback was received
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, feedback: type } : msg)))
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Chat cleared. How can I help you today?",
        timestamp: new Date().toISOString(),
      },
    ])
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen)
  }

  // Dummy function to generate responses (in a real app, this would be an API call)
  const generateResponse = (prompt) => {
    const responses = [
      "I understand you're asking about ${topic}. Here's what I know...",
      "That's an interesting question about ${topic}. Let me explain...",
      "When it comes to ${topic}, there are several important points to consider...",
      "I'd be happy to help with ${topic}. Here's some information...",
    ]

    const topics = {
      code: "coding and programming",
      image: "image generation and processing",
      video: "video editing and creation",
      music: "music generation and audio processing",
      help: "how to use Piexed AI",
      feature: "Piexed AI's features",
      model: "AI models",
      api: "API usage",
    }

    let topic = "your question"
    for (const [key, value] of Object.entries(topics)) {
      if (prompt.toLowerCase().includes(key)) {
        topic = value
        break
      }
    }

    const responseTemplate = responses[Math.floor(Math.random() * responses.length)]
    return (
      responseTemplate.replace("${topic}", topic) +
      "\n\nPiexed AI is designed to assist with a wide range of tasks, including text generation, code writing, image creation, video editing, and more. Our advanced models are continuously learning and improving to provide you with the best possible assistance."
    )
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className={`flex h-screen bg-background ${fullscreen ? "fixed inset-0 z-50" : ""}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-0"} bg-muted transition-all duration-300 overflow-hidden border-r`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Piexed AI</h2>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Recent Chats</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Image Generation
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Code className="h-4 w-4 mr-2" />
                  Code Assistant
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Video className="h-4 w-4 mr-2" />
                  Video Editing
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">Tools</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Image className="h-4 w-4 mr-2" />
                  Image Creator
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Video className="h-4 w-4 mr-2" />
                  Video Editor
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Music className="h-4 w-4 mr-2" />
                  Music Generator
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <FileCode className="h-4 w-4 mr-2" />
                  Code Generator
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">Settings</h3>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Model Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Cpu className="h-4 w-4 mr-2" />
                  API Access
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={handleClearChat}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="border-b p-4 flex items-center justify-between bg-background">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
              <PanelRight className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Chat</h1>
              <div className="flex items-center text-xs text-muted-foreground">
                <Badge variant="outline" className="mr-2">
                  {selectedModel === "pi-alpha"
                    ? "Pi-Alpha"
                    : selectedModel === "pi-transformer"
                      ? "Pi-Transformer"
                      : "Pi-o"}
                </Badge>
                <span>
                  Using{" "}
                  {selectedModel === "pi-alpha"
                    ? "advanced"
                    : selectedModel === "pi-transformer"
                      ? "intermediate"
                      : "basic"}{" "}
                  capabilities
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                    {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{fullscreen ? "Exit Fullscreen" : "Fullscreen"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-b overflow-hidden"
            >
              <div className="p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Model Settings</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="model-select">AI Model</Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger id="model-select">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pi-o">Pi-o (Basic)</SelectItem>
                        <SelectItem value="pi-transformer">Pi-Transformer (Intermediate)</SelectItem>
                        <SelectItem value="pi-alpha">Pi-Alpha (Advanced)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Select the AI model that best suits your needs</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="temperature-slider">Temperature: {temperature}</Label>
                    </div>
                    <Slider
                      id="temperature-slider"
                      min={0}
                      max={1}
                      step={0.1}
                      value={[temperature]}
                      onValueChange={(value) => setTemperature(value[0])}
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower values make responses more focused, higher values more creative
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="max-tokens-slider">Max Tokens: {maxTokens}</Label>
                    </div>
                    <Slider
                      id="max-tokens-slider"
                      min={256}
                      max={4096}
                      step={256}
                      value={[maxTokens]}
                      onValueChange={(value) => setMaxTokens(value[0])}
                    />
                    <p className="text-xs text-muted-foreground">Maximum length of the generated response</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="streaming" defaultChecked />
                    <Label htmlFor="streaming">Enable streaming responses</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="memory" defaultChecked />
                    <Label htmlFor="memory">Remember conversation context</Label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-4 border-b">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="chat" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center">
                <Image className="h-4 w-4 mr-2" />
                Image
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center">
                <Code className="h-4 w-4 mr-2" />
                Code
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center">
                <Video className="h-4 w-4 mr-2" />
                Video
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center">
                <Mic className="h-4 w-4 mr-2" />
                Voice
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-3xl rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : message.error
                          ? "bg-destructive/10 border border-destructive/20"
                          : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <Avatar className="h-6 w-6 mr-2">
                        {message.role === "user" ? (
                          <div className="bg-primary-foreground text-primary rounded-full h-full w-full flex items-center justify-center text-xs">
                            U
                          </div>
                        ) : (
                          <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center text-xs">
                            AI
                          </div>
                        )}
                      </Avatar>
                      <span className="text-sm font-medium">{message.role === "user" ? "You" : "Piexed AI"}</span>
                      <span className="text-xs ml-2 opacity-70">{formatTimestamp(message.timestamp)}</span>
                    </div>

                    {message.image && (
                      <div className="mb-2">
                        <img src={message.image || "/placeholder.svg"} alt="Uploaded" className="max-h-64 rounded-md" />
                      </div>
                    )}

                    {message.video && (
                      <div className="mb-2">
                        <video src={message.video} controls className="max-h-64 rounded-md" />
                      </div>
                    )}

                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "")
                            return !inline && match ? (
                              <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            )
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>

                    {message.role === "assistant" && (
                      <div className="flex items-center justify-end mt-2 space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyMessage(message.content)}
                          className="h-6 w-6"
                        >
                          {copiedMessageId === message.content ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleFeedback(message.id, "thumbsUp")}
                          className={`h-6 w-6 ${message.feedback === "thumbsUp" ? "text-green-500" : ""}`}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleFeedback(message.id, "thumbsDown")}
                          className={`h-6 w-6 ${message.feedback === "thumbsDown" ? "text-red-500" : ""}`}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>

                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-3xl rounded-lg p-4 bg-muted">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center text-xs">
                          AI
                        </div>
                      </Avatar>
                      <span className="text-sm font-medium">Piexed AI</span>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
              <div className="relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="pr-24 resize-none"
                  rows={3}
                />

                <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="h-8 w-8">
                    <Image className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsListening(!isListening)}
                    className={`h-8 w-8 ${isListening ? "text-red-500" : ""}`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    className="h-8 w-8"
                    disabled={!input.trim() || isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-muted-foreground">
                  {isListening ? (
                    <span className="flex items-center text-red-500">
                      <span className="relative flex h-2 w-2 mr-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      Listening...
                    </span>
                  ) : (
                    <span>Piexed AI may produce inaccurate information about people, places, or facts.</span>
                  )}
                </div>

                <div className="flex items-center">
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="h-7 text-xs border-none">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pi-o">Pi-o</SelectItem>
                      <SelectItem value="pi-transformer">Pi-Transformer</SelectItem>
                      <SelectItem value="pi-alpha">Pi-Alpha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="image" className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              <Card className="border-dashed border-2 p-8">
                <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
                  <Image className="h-16 w-16 text-muted-foreground" />
                  <div className="text-center">
                    <h3 className="text-lg font-medium">Image Generation</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create images from text descriptions or upload an image to edit
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2 w-full max-w-md">
                    <Textarea placeholder="Describe the image you want to create..." rows={4} />
                    <div className="flex space-x-2">
                      <Button className="flex-1">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate
                      </Button>
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="code" className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              <Card className="border-dashed border-2 p-8">
                <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
                  <Braces className="h-16 w-16 text-muted-foreground" />
                  <div className="text-center">
                    <h3 className="text-lg font-medium">Code Assistant</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Generate code, debug issues, or get programming help
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2 w-full max-w-md">
                    <Textarea placeholder="Describe the code you need or paste code to debug..." rows={4} />
                    <div className="flex space-x-2">
                      <Button className="flex-1">
                        <Code className="mr-2 h-4 w-4" />
                        Generate Code
                      </Button>
                      <Button variant="outline">
                        <Zap className="mr-2 h-4 w-4" />
                        Debug
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="video" className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              <Card className="border-dashed border-2 p-8">
                <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
                  <Video className="h-16 w-16 text-muted-foreground" />
                  <div className="text-center">
                    <h3 className="text-lg font-medium">Video Editor</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Edit videos using natural language commands or generate videos from text
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2 w-full max-w-md">
                    <input
                      type="file"
                      ref={videoInputRef}
                      onChange={handleVideoUpload}
                      accept="video/*"
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => videoInputRef.current?.click()}
                      className="h-32 border-dashed"
                    >
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 mb-2" />
                        <span>Upload a video to edit</span>
                        <span className="text-xs text-muted-foreground mt-1">or drag and drop</span>
                      </div>
                    </Button>
                    <Separator className="my-2" />
                    <Textarea placeholder="Describe the video you want to create..." rows={4} />
                    <Button>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Video
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="voice" className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              <Card className="border-dashed border-2 p-8">
                <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
                  <Mic className="h-16 w-16 text-muted-foreground" />
                  <div className="text-center">
                    <h3 className="text-lg font-medium">Voice Assistant</h3>
                    <p className="text-sm text-muted-foreground mt-1">Speak to Piexed AI and get voice responses</p>
                  </div>
                  <div className="flex flex-col space-y-2 w-full max-w-md">
                    <Button
                      className={`h-32 rounded-full ${isListening ? "bg-red-500 hover:bg-red-600" : ""}`}
                      onClick={() => setIsListening(!isListening)}
                    >
                      <div className="flex flex-col items-center">
                        <Mic className="h-8 w-8 mb-2" />
                        <span>{isListening ? "Listening..." : "Tap to Speak"}</span>
                      </div>
                    </Button>
                    <div className="text-center text-sm text-muted-foreground">
                      {isListening ? "Speak now..." : "Tap the microphone and speak to Piexed AI"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function MessageSquare(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

