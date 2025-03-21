"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertCircle,
  Brain,
  Check,
  Download,
  Image,
  Info,
  Loader2,
  MessageSquare,
  RefreshCw,
  Save,
  Trash2,
  Upload,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

export default function LocalModelsPage() {
  const [activeTab, setActiveTab] = useState("installed")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [systemResources, setSystemResources] = useState({
    cpuCores: 4,
    gpuAvailable: true,
    gpuName: "NVIDIA RTX 3080",
    gpuMemory: "10GB",
    ramTotal: "16GB",
    ramAvailable: "8.5GB",
    diskTotal: "500GB",
    diskAvailable: "320GB",
  })

  // Installed models
  const [installedModels, setInstalledModels] = useState([
    {
      id: "mistral-7b",
      name: "Mistral AI 7B",
      type: "text",
      size: "4.1GB",
      status: "active",
      version: "v0.1",
      lastUsed: "2023-06-15",
      parameters: {
        temperature: 0.7,
        topP: 0.9,
        maxTokens: 2048,
        contextWindow: 8192,
      },
      capabilities: ["chat", "completion", "embedding"],
      quantization: "4-bit",
      performance: {
        tokensPerSecond: 32,
        memoryUsage: "3.2GB",
      },
    },
    {
      id: "stable-diffusion-xl",
      name: "Stable Diffusion XL",
      type: "image",
      size: "6.8GB",
      status: "active",
      version: "v1.0",
      lastUsed: "2023-06-14",
      parameters: {
        guidanceScale: 7.5,
        steps: 30,
        width: 1024,
        height: 1024,
      },
      capabilities: ["image-generation", "image-editing"],
      quantization: "8-bit",
      performance: {
        generationTime: "5.2s",
        memoryUsage: "5.5GB",
      },
    },
    {
      id: "llama-3-8b",
      name: "Meta Llama 3 8B",
      type: "text",
      size: "5.2GB",
      status: "inactive",
      version: "v1.0",
      lastUsed: "2023-06-10",
      parameters: {
        temperature: 0.8,
        topP: 0.95,
        maxTokens: 4096,
        contextWindow: 8192,
      },
      capabilities: ["chat", "completion", "embedding", "function-calling"],
      quantization: "4-bit",
      performance: {
        tokensPerSecond: 28,
        memoryUsage: "4.1GB",
      },
    },
  ])

  // Available models for download
  const [availableModels, setAvailableModels] = useState([
    {
      id: "gemma-7b",
      name: "Gemma 7B",
      type: "text",
      size: "4.8GB",
      description: "Google's lightweight and efficient text model",
      version: "v1.0",
      requirements: {
        disk: "10GB",
        ram: "8GB",
        gpu: "4GB VRAM (recommended)",
      },
      capabilities: ["chat", "completion", "embedding"],
      repository: "huggingface",
      repoPath: "google/gemma-7b",
    },
    {
      id: "qwen-7b",
      name: "Qwen 7B",
      type: "text",
      size: "4.6GB",
      description: "Alibaba's multilingual language model",
      version: "v1.5",
      requirements: {
        disk: "10GB",
        ram: "8GB",
        gpu: "4GB VRAM (recommended)",
      },
      capabilities: ["chat", "completion", "embedding"],
      repository: "huggingface",
      repoPath: "Qwen/Qwen-7B",
    },
    {
      id: "stable-diffusion-3",
      name: "Stable Diffusion 3",
      type: "image",
      size: "7.2GB",
      description: "Latest version of Stable Diffusion with improved image quality",
      version: "v3.0",
      requirements: {
        disk: "15GB",
        ram: "16GB",
        gpu: "8GB VRAM (required)",
      },
      capabilities: ["image-generation", "image-editing", "inpainting"],
      repository: "huggingface",
      repoPath: "stabilityai/stable-diffusion-3",
    },
    {
      id: "falcon-7b",
      name: "Falcon 7B",
      type: "text",
      size: "4.9GB",
      description: "TII's efficient language model",
      version: "v1.0",
      requirements: {
        disk: "10GB",
        ram: "8GB",
        gpu: "4GB VRAM (recommended)",
      },
      capabilities: ["chat", "completion"],
      repository: "huggingface",
      repoPath: "tiiuae/falcon-7b",
    },
    {
      id: "vicuna-13b",
      name: "Vicuna 13B",
      type: "text",
      size: "8.2GB",
      description: "Fine-tuned LLaMA model with improved instruction following",
      version: "v1.5",
      requirements: {
        disk: "20GB",
        ram: "16GB",
        gpu: "8GB VRAM (required)",
      },
      capabilities: ["chat", "completion", "embedding"],
      repository: "huggingface",
      repoPath: "lmsys/vicuna-13b-v1.5",
    },
    {
      id: "bloom-7b1",
      name: "BLOOM 7B1",
      type: "text",
      size: "5.0GB",
      description: "Multilingual language model supporting 46+ languages",
      version: "v1.0",
      requirements: {
        disk: "12GB",
        ram: "8GB",
        gpu: "4GB VRAM (recommended)",
      },
      capabilities: ["chat", "completion", "embedding"],
      repository: "huggingface",
      repoPath: "bigscience/bloom-7b1",
    },
  ])

  // Custom model form
  const [customModel, setCustomModel] = useState({
    name: "",
    type: "text",
    huggingfaceRepo: "",
    localPath: "",
    quantization: "4-bit",
    systemPrompt: "",
  })

  // Model configuration
  const [selectedModel, setSelectedModel] = useState(null)
  const [modelConfig, setModelConfig] = useState({
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2048,
    contextWindow: 8192,
    systemPrompt: "You are a helpful AI assistant.",
  })

  // Simulate loading data
  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleModelStatusToggle = (modelId, newStatus) => {
    setInstalledModels(
      installedModels.map((model) =>
        model.id === modelId ? { ...model, status: newStatus ? "active" : "inactive" } : model,
      ),
    )
  }

  const handleModelConfigChange = (field, value) => {
    setModelConfig({
      ...modelConfig,
      [field]: value,
    })
  }

  const handleCustomModelChange = (field, value) => {
    setCustomModel({
      ...customModel,
      [field]: value,
    })
  }

  const handleSaveModelConfig = () => {
    setIsSaving(true)
    setSuccess("")
    setError("")

    // Simulate API call to save model configuration
    setTimeout(() => {
      setIsSaving(false)
      setSuccess("Model configuration saved successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    }, 1500)
  }

  const handleDownloadModel = (modelId) => {
    const model = availableModels.find((m) => m.id === modelId)
    if (!model) return

    setIsDownloading(true)
    setDownloadProgress(0)
    setSuccess("")
    setError("")

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsDownloading(false)
          setSuccess(`${model.name} downloaded and installed successfully`)

          // Add to installed models
          setInstalledModels([
            ...installedModels,
            {
              id: model.id,
              name: model.name,
              type: model.type,
              size: model.size,
              status: "active",
              version: model.version,
              lastUsed: new Date().toISOString().split("T")[0],
              parameters:
                model.type === "text"
                  ? {
                      temperature: 0.7,
                      topP: 0.9,
                      maxTokens: 2048,
                      contextWindow: 8192,
                    }
                  : {
                      guidanceScale: 7.5,
                      steps: 30,
                      width: 1024,
                      height: 1024,
                    },
              capabilities: model.capabilities,
              quantization: "4-bit",
              performance:
                model.type === "text"
                  ? {
                      tokensPerSecond: Math.floor(Math.random() * 20) + 20,
                      memoryUsage: `${(Number.parseFloat(model.size) * 0.7).toFixed(1)}GB`,
                    }
                  : {
                      generationTime: `${(Math.random() * 5 + 3).toFixed(1)}s`,
                      memoryUsage: `${(Number.parseFloat(model.size) * 0.8).toFixed(1)}GB`,
                    },
            },
          ])

          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccess("")
          }, 3000)

          return 100
        }
        return prev + (Math.random() * 5 + 1)
      })
    }, 300)
  }

  const handleDeleteModel = (modelId) => {
    setInstalledModels(installedModels.filter((model) => model.id !== modelId))
    setSuccess(`Model deleted successfully`)

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  const handleAddCustomModel = () => {
    if (!customModel.name || (!customModel.huggingfaceRepo && !customModel.localPath)) {
      setError("Please provide a name and either a Hugging Face repository or local path")
      return
    }

    setIsSaving(true)
    setSuccess("")
    setError("")

    // Simulate API call to add custom model
    setTimeout(() => {
      setIsSaving(false)
      setSuccess("Custom model added successfully")

      // Add to installed models
      setInstalledModels([
        ...installedModels,
        {
          id: customModel.name.toLowerCase().replace(/\s+/g, "-"),
          name: customModel.name,
          type: customModel.type,
          size: "Unknown",
          status: "active",
          version: "custom",
          lastUsed: new Date().toISOString().split("T")[0],
          parameters:
            customModel.type === "text"
              ? {
                  temperature: 0.7,
                  topP: 0.9,
                  maxTokens: 2048,
                  contextWindow: 8192,
                }
              : {
                  guidanceScale: 7.5,
                  steps: 30,
                  width: 1024,
                  height: 1024,
                },
          capabilities: customModel.type === "text" ? ["chat", "completion"] : ["image-generation"],
          quantization: customModel.quantization,
          performance: {
            tokensPerSecond: "Unknown",
            memoryUsage: "Unknown",
          },
        },
      ])

      // Reset form
      setCustomModel({
        name: "",
        type: "text",
        huggingfaceRepo: "",
        localPath: "",
        quantization: "4-bit",
        systemPrompt: "",
      })

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Local AI Models</h1>
        <Button onClick={() => setActiveTab("add-custom")}>
          <Upload className="mr-2 h-4 w-4" />
          Add Custom Model
        </Button>
      </div>

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30">
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>System Resources</CardTitle>
          <CardDescription>Available hardware resources for running local AI models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">CPU</span>
                <span className="text-sm text-muted-foreground">{systemResources.cpuCores} cores</span>
              </div>
              <Progress value={75} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">GPU</span>
                <span className="text-sm text-muted-foreground">
                  {systemResources.gpuAvailable ? systemResources.gpuName : "Not available"}
                </span>
              </div>
              <Progress value={systemResources.gpuAvailable ? 60 : 0} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">RAM</span>
                <span className="text-sm text-muted-foreground">
                  {systemResources.ramAvailable} / {systemResources.ramTotal}
                </span>
              </div>
              <Progress value={53} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Disk</span>
                <span className="text-sm text-muted-foreground">
                  {systemResources.diskAvailable} / {systemResources.diskTotal}
                </span>
              </div>
              <Progress value={36} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="installed">Installed Models</TabsTrigger>
          <TabsTrigger value="available">Available Models</TabsTrigger>
          <TabsTrigger value="add-custom">Add Custom Model</TabsTrigger>
        </TabsList>

        <TabsContent value="installed" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : installedModels.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Info className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No models installed</p>
                <p className="text-muted-foreground mb-4">Download models from the Available Models tab</p>
                <Button onClick={() => setActiveTab("available")}>Browse Available Models</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {installedModels.map((model) => (
                <Card key={model.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {model.type === "text" ? (
                          <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                        ) : (
                          <Image className="h-5 w-5 mr-2 text-primary" />
                        )}
                        <CardTitle>{model.name}</CardTitle>
                      </div>
                      <Badge variant={model.status === "active" ? "default" : "outline"}>
                        {model.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>
                      {model.type === "text" ? "Text Generation Model" : "Image Generation Model"} • {model.size} •{" "}
                      {model.version}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Capabilities</h4>
                        <div className="flex flex-wrap gap-2">
                          {model.capabilities.map((capability) => (
                            <Badge key={capability} variant="secondary">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Performance</h4>
                        <div className="space-y-1 text-sm">
                          {model.type === "text" ? (
                            <>
                              <div className="flex justify-between">
                                <span>Speed:</span>
                                <span>{model.performance.tokensPerSecond} tokens/sec</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Memory Usage:</span>
                                <span>{model.performance.memoryUsage}</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between">
                                <span>Generation Time:</span>
                                <span>{model.performance.generationTime}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Memory Usage:</span>
                                <span>{model.performance.memoryUsage}</span>
                              </div>
                            </>
                          )}
                          <div className="flex justify-between">
                            <span>Quantization:</span>
                            <span>{model.quantization}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`model-status-${model.id}`}>Enable Model</Label>
                        <Switch
                          id={`model-status-${model.id}`}
                          checked={model.status === "active"}
                          onCheckedChange={(checked) => handleModelStatusToggle(model.id, checked)}
                        />
                      </div>

                      {model.type === "text" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`temperature-${model.id}`}>
                              Temperature: {model.parameters.temperature}
                            </Label>
                            <span className="text-sm text-muted-foreground">
                              {model.parameters.temperature === 0
                                ? "Deterministic"
                                : model.parameters.temperature < 0.5
                                  ? "Conservative"
                                  : model.parameters.temperature < 0.8
                                    ? "Balanced"
                                    : "Creative"}
                            </span>
                          </div>
                          <Slider
                            id={`temperature-${model.id}`}
                            min={0}
                            max={1}
                            step={0.1}
                            value={[model.parameters.temperature]}
                            disabled={model.status !== "active"}
                          />
                        </div>
                      )}

                      {model.type === "image" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`guidance-scale-${model.id}`}>
                              Guidance Scale: {model.parameters.guidanceScale}
                            </Label>
                            <span className="text-sm text-muted-foreground">
                              {model.parameters.guidanceScale < 5
                                ? "More creative"
                                : model.parameters.guidanceScale < 10
                                  ? "Balanced"
                                  : "More precise"}
                            </span>
                          </div>
                          <Slider
                            id={`guidance-scale-${model.id}`}
                            min={1}
                            max={15}
                            step={0.5}
                            value={[model.parameters.guidanceScale]}
                            disabled={model.status !== "active"}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setSelectedModel(model)}>
                      Configure
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteModel(model.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableModels.map((model) => (
                <Card key={model.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      {model.type === "text" ? (
                        <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                      ) : (
                        <Image className="h-5 w-5 mr-2 text-primary" />
                      )}
                      <CardTitle>{model.name}</CardTitle>
                    </div>
                    <CardDescription>
                      {model.type === "text" ? "Text Generation Model" : "Image Generation Model"} • {model.size} •{" "}
                      {model.version}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{model.description}</p>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Capabilities</h4>
                        <div className="flex flex-wrap gap-2">
                          {model.capabilities.map((capability) => (
                            <Badge key={capability} variant="secondary">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">System Requirements</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Disk Space:</span>
                            <span>{model.requirements.disk}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>RAM:</span>
                            <span>{model.requirements.ram}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>GPU:</span>
                            <span>{model.requirements.gpu}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Source</h4>
                        <div className="text-sm">
                          <span className="font-medium">Repository:</span> {model.repository}
                          <br />
                          <span className="font-medium">Path:</span> {model.repoPath}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {isDownloading && downloadProgress > 0 && downloadProgress < 100 ? (
                      <div className="w-full space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Downloading...</span>
                          <span>{Math.round(downloadProgress)}%</span>
                        </div>
                        <Progress value={downloadProgress} />
                      </div>
                    ) : installedModels.some((m) => m.id === model.id) ? (
                      <Button variant="outline" className="w-full" disabled>
                        Already Installed
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={() => handleDownloadModel(model.id)} disabled={isDownloading}>
                        {isDownloading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Download & Install
                          </>
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="add-custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Custom Model</CardTitle>
              <CardDescription>Add your own model from Hugging Face, local storage, or other sources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model-name">Model Name</Label>
                <Input
                  id="model-name"
                  value={customModel.name}
                  onChange={(e) => handleCustomModelChange("name", e.target.value)}
                  placeholder="My Custom Model"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model-type">Model Type</Label>
                <Select value={customModel.type} onValueChange={(value) => handleCustomModelChange("type", value)}>
                  <SelectTrigger id="model-type">
                    <SelectValue placeholder="Select model type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Generation</SelectItem>
                    <SelectItem value="image">Image Generation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="huggingface-repo">Hugging Face Repository (Optional)</Label>
                <Input
                  id="huggingface-repo"
                  value={customModel.huggingfaceRepo}
                  onChange={(e) => handleCustomModelChange("huggingfaceRepo", e.target.value)}
                  placeholder="organization/model-name"
                />
                <p className="text-sm text-muted-foreground">Example: mistralai/Mistral-7B-v0.1</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="local-path">Local Path (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="local-path"
                    value={customModel.localPath}
                    onChange={(e) => handleCustomModelChange("localPath", e.target.value)}
                    placeholder="/path/to/model"
                  />
                  <Button variant="outline">Browse</Button>
                </div>
                <p className="text-sm text-muted-foreground">Path to model files on your server</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantization">Quantization</Label>
                <Select
                  value={customModel.quantization}
                  onValueChange={(value) => handleCustomModelChange("quantization", value)}
                >
                  <SelectTrigger id="quantization">
                    <SelectValue placeholder="Select quantization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4-bit">4-bit (Fastest, smallest)</SelectItem>
                    <SelectItem value="8-bit">8-bit (Balanced)</SelectItem>
                    <SelectItem value="16-bit">16-bit (High quality)</SelectItem>
                    <SelectItem value="32-bit">32-bit (Full precision)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Lower precision reduces memory usage but may affect quality
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="system-prompt">Default System Prompt (for text models)</Label>
                <Textarea
                  id="system-prompt"
                  value={customModel.systemPrompt}
                  onChange={(e) => handleCustomModelChange("systemPrompt", e.target.value)}
                  placeholder="You are a helpful AI assistant..."
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddCustomModel} disabled={isSaving} className="ml-auto">
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Add Model
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedModel && (
        <Card>
          <CardHeader>
            <CardTitle>Configure {selectedModel.name}</CardTitle>
            <CardDescription>Adjust model parameters and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedModel.type === "text" && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="temperature">Temperature: {modelConfig.temperature}</Label>
                    <span className="text-sm text-muted-foreground">
                      {modelConfig.temperature === 0
                        ? "Deterministic"
                        : modelConfig.temperature < 0.5
                          ? "Conservative"
                          : modelConfig.temperature < 0.8
                            ? "Balanced"
                            : "Creative"}
                    </span>
                  </div>
                  <Slider
                    id="temperature"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[modelConfig.temperature]}
                    onValueChange={(value) => handleModelConfigChange("temperature", value[0])}
                  />
                  <p className="text-sm text-muted-foreground">
                    Controls randomness: lower values are more deterministic, higher values more creative
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="top-p">Top P: {modelConfig.topP}</Label>
                  </div>
                  <Slider
                    id="top-p"
                    min={0.1}
                    max={1}
                    step={0.05}
                    value={[modelConfig.topP]}
                    onValueChange={(value) => handleModelConfigChange("topP", value[0])}
                  />
                  <p className="text-sm text-muted-foreground">
                    Controls diversity via nucleus sampling: 0.9 considers the top 90% of probability mass
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="max-tokens">Max Tokens: {modelConfig.maxTokens}</Label>
                  </div>
                  <Slider
                    id="max-tokens"
                    min={256}
                    max={8192}
                    step={256}
                    value={[modelConfig.maxTokens]}
                    onValueChange={(value) => handleModelConfigChange("maxTokens", value[0])}
                  />
                  <p className="text-sm text-muted-foreground">Maximum number of tokens to generate in the response</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Textarea
                    id="system-prompt"
                    value={modelConfig.systemPrompt}
                    onChange={(e) => handleModelConfigChange("systemPrompt", e.target.value)}
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">Instructions that define how the model behaves</p>
                </div>
              </>
            )}

            {selectedModel.type === "image" && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="guidance-scale">Guidance Scale: {selectedModel.parameters.guidanceScale}</Label>
                  </div>
                  <Slider
                    id="guidance-scale"
                    min={1}
                    max={15}
                    step={0.5}
                    value={[selectedModel.parameters.guidanceScale]}
                  />
                  <p className="text-sm text-muted-foreground">
                    How closely the image should follow the prompt (higher = more precise)
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="steps">Steps: {selectedModel.parameters.steps}</Label>
                  </div>
                  <Slider id="steps" min={10} max={100} step={5} value={[selectedModel.parameters.steps]} />
                  <p className="text-sm text-muted-foreground">
                    Number of denoising steps (higher = better quality but slower)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width</Label>
                    <Select defaultValue={selectedModel.parameters.width.toString()}>
                      <SelectTrigger id="width">
                        <SelectValue placeholder="Select width" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="512">512px</SelectItem>
                        <SelectItem value="768">768px</SelectItem>
                        <SelectItem value="1024">1024px</SelectItem>
                        <SelectItem value="1280">1280px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Select defaultValue={selectedModel.parameters.height.toString()}>
                      <SelectTrigger id="height">
                        <SelectValue placeholder="Select height" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="512">512px</SelectItem>
                        <SelectItem value="768">768px</SelectItem>
                        <SelectItem value="1024">1024px</SelectItem>
                        <SelectItem value="1280">1280px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setSelectedModel(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveModelConfig} disabled={isSaving}>
              {isSaving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Configuration
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

