"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Check, Globe, RefreshCw, Save, Settings } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function ModelSelectionPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("text")

  // Model selection configuration
  const [modelSelection, setModelSelection] = useState({
    text: {
      mode: "local", // local, api, hybrid
      localModel: "mistral-7b",
      apiModel: "together-ai-mistral",
      hybridStrategy: "fallback", // fallback, cost-based, performance-based
      apiKey: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    },
    image: {
      mode: "local",
      localModel: "stable-diffusion-xl",
      apiModel: "together-ai-stable-diffusion",
      hybridStrategy: "fallback",
      apiKey: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    },
  })

  // Available models
  const [availableModels, setAvailableModels] = useState({
    local: {
      text: [
        { id: "mistral-7b", name: "Mistral AI 7B", status: "active" },
        { id: "llama-3-8b", name: "Meta Llama 3 8B", status: "inactive" },
        { id: "gemma-7b", name: "Gemma 7B", status: "active" },
      ],
      image: [
        { id: "stable-diffusion-xl", name: "Stable Diffusion XL", status: "active" },
        { id: "stable-diffusion-3", name: "Stable Diffusion 3", status: "inactive" },
      ],
    },
    api: {
      text: [
        { id: "together-ai-mistral", name: "Together AI - Mistral", provider: "Together AI" },
        { id: "together-ai-llama", name: "Together AI - Llama 3", provider: "Together AI" },
        { id: "mistral-ai-mistral-large", name: "Mistral Large", provider: "Mistral AI" },
        { id: "mistral-ai-mistral-small", name: "Mistral Small", provider: "Mistral AI" },
        { id: "huggingface-falcon", name: "Falcon 40B", provider: "Hugging Face" },
      ],
      image: [
        { id: "together-ai-stable-diffusion", name: "Stable Diffusion XL", provider: "Together AI" },
        { id: "together-ai-dalle", name: "DALL-E 3", provider: "Together AI" },
        { id: "stability-ai-sdxl", name: "SDXL", provider: "Stability AI" },
      ],
    },
  })

  // API providers configuration
  const [apiProviders, setApiProviders] = useState([
    {
      id: "together-ai",
      name: "Together AI",
      enabled: true,
      apiKey: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      models: ["mistral", "llama", "stable-diffusion"],
    },
    {
      id: "mistral-ai",
      name: "Mistral AI",
      enabled: true,
      apiKey: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      models: ["mistral-large", "mistral-small"],
    },
    {
      id: "huggingface",
      name: "Hugging Face",
      enabled: false,
      apiKey: "",
      models: ["falcon", "bloom"],
    },
    {
      id: "stability-ai",
      name: "Stability AI",
      enabled: false,
      apiKey: "",
      models: ["sdxl", "sd3"],
    },
  ])

  // Simulate loading data
  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleModelSelectionChange = (type, field, value) => {
    setModelSelection({
      ...modelSelection,
      [type]: {
        ...modelSelection[type],
        [field]: value,
      },
    })
  }

  const handleApiProviderChange = (providerId, field, value) => {
    setApiProviders(
      apiProviders.map((provider) => (provider.id === providerId ? { ...provider, [field]: value } : provider)),
    )
  }

  const handleSaveConfig = () => {
    setIsSaving(true)
    setSuccess("")
    setError("")

    // Simulate API call to save configuration
    setTimeout(() => {
      setIsSaving(false)
      setSuccess("Model selection configuration saved successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Model Selection</h1>
        <Button onClick={handleSaveConfig} disabled={isSaving}>
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="text">Text Models</TabsTrigger>
          <TabsTrigger value="image">Image Models</TabsTrigger>
          <TabsTrigger value="api-providers">API Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Text Generation Model Selection</CardTitle>
              <CardDescription>Configure which models to use for text generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30">
                <Settings className="h-4 w-4" />
                <AlertTitle>Model Selection Mode</AlertTitle>
                <AlertDescription>
                  Choose between local models running on your server, API-based models from providers like Together AI
                  or Mistral AI, or a hybrid approach that combines both.
                </AlertDescription>
              </Alert>

              <RadioGroup
                value={modelSelection.text.mode}
                onValueChange={(value) => handleModelSelectionChange("text", "mode", value)}
                className="space-y-4"
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="local" id="text-local" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="text-local" className="font-medium">
                      Local Models Only
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Use only models installed on your server. Requires more hardware resources but offers complete
                      privacy and no usage costs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="api" id="text-api" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="text-api" className="font-medium">
                      API Models Only
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Use only models from external API providers. Requires less hardware resources but incurs usage
                      costs and sends data to third parties.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="hybrid" id="text-hybrid" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="text-hybrid" className="font-medium">
                      Hybrid Approach
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Use a combination of local and API models based on your configured strategy. Offers flexibility
                      and optimizes for different scenarios.
                    </p>
                  </div>
                </div>
              </RadioGroup>

              <Separator />

              {modelSelection.text.mode === "local" || modelSelection.text.mode === "hybrid" ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Local Model Configuration</h3>
                  <div className="space-y-2">
                    <Label htmlFor="text-local-model">Primary Local Model</Label>
                    <Select
                      value={modelSelection.text.localModel}
                      onValueChange={(value) => handleModelSelectionChange("text", "localModel", value)}
                    >
                      <SelectTrigger id="text-local-model">
                        <SelectValue placeholder="Select local model" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModels.local.text.map((model) => (
                          <SelectItem key={model.id} value={model.id} disabled={model.status !== "active"}>
                            {model.name} {model.status !== "active" && "(Inactive)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-muted-foreground">
                        Selected model will be used for all text generation requests
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <a href="/admin/models/local">Manage Local Models</a>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}

              {modelSelection.text.mode === "api" || modelSelection.text.mode === "hybrid" ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">API Model Configuration</h3>
                  <div className="space-y-2">
                    <Label htmlFor="text-api-model">Primary API Model</Label>
                    <Select
                      value={modelSelection.text.apiModel}
                      onValueChange={(value) => handleModelSelectionChange("text", "apiModel", value)}
                    >
                      <SelectTrigger id="text-api-model">
                        <SelectValue placeholder="Select API model" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModels.api.text.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name} ({model.provider})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-muted-foreground">
                        Selected model will be used for all API-based text generation requests
                      </p>
                      <Button variant="outline" size="sm" onClick={() => setActiveTab("api-providers")}>
                        Manage API Providers
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}

              {modelSelection.text.mode === "hybrid" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Hybrid Strategy</h3>
                  <div className="space-y-2">
                    <Label htmlFor="text-hybrid-strategy">Strategy</Label>
                    <Select
                      value={modelSelection.text.hybridStrategy}
                      onValueChange={(value) => handleModelSelectionChange("text", "hybridStrategy", value)}
                    >
                      <SelectTrigger id="text-hybrid-strategy">
                        <SelectValue placeholder="Select strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fallback">Fallback (Local → API)</SelectItem>
                        <SelectItem value="cost-based">Cost-Based Optimization</SelectItem>
                        <SelectItem value="performance-based">Performance-Based Optimization</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      {modelSelection.text.hybridStrategy === "fallback"
                        ? "Use local model first, fall back to API if local model fails or is unavailable"
                        : modelSelection.text.hybridStrategy === "cost-based"
                          ? "Optimize for cost by using local models for most requests and API models for specific cases"
                          : "Optimize for performance by routing requests to the most appropriate model based on complexity"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Image Generation Model Selection</CardTitle>
              <CardDescription>Configure which models to use for image generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30">
                <Settings className="h-4 w-4" />
                <AlertTitle>Model Selection Mode</AlertTitle>
                <AlertDescription>
                  Choose between local models running on your server, API-based models from providers like Stability AI,
                  or a hybrid approach that combines both.
                </AlertDescription>
              </Alert>

              <RadioGroup
                value={modelSelection.image.mode}
                onValueChange={(value) => handleModelSelectionChange("image", "mode", value)}
                className="space-y-4"
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="local" id="image-local" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="image-local" className="font-medium">
                      Local Models Only
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Use only models installed on your server. Requires more hardware resources but offers complete
                      privacy and no usage costs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="api" id="image-api" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="image-api" className="font-medium">
                      API Models Only
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Use only models from external API providers. Requires less hardware resources but incurs usage
                      costs and sends data to third parties.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="hybrid" id="image-hybrid" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="image-hybrid" className="font-medium">
                      Hybrid Approach
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Use a combination of local and API models based on your configured strategy. Offers flexibility
                      and optimizes for different scenarios.
                    </p>
                  </div>
                </div>
              </RadioGroup>

              <Separator />

              {modelSelection.image.mode === "local" || modelSelection.image.mode === "hybrid" ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Local Model Configuration</h3>
                  <div className="space-y-2">
                    <Label htmlFor="image-local-model">Primary Local Model</Label>
                    <Select
                      value={modelSelection.image.localModel}
                      onValueChange={(value) => handleModelSelectionChange("image", "localModel", value)}
                    >
                      <SelectTrigger id="image-local-model">
                        <SelectValue placeholder="Select local model" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModels.local.image.map((model) => (
                          <SelectItem key={model.id} value={model.id} disabled={model.status !== "active"}>
                            {model.name} {model.status !== "active" && "(Inactive)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-muted-foreground">
                        Selected model will be used for all image generation requests
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <a href="/admin/models/local">Manage Local Models</a>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}

              {modelSelection.image.mode === "api" || modelSelection.image.mode === "hybrid" ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">API Model Configuration</h3>
                  <div className="space-y-2">
                    <Label htmlFor="image-api-model">Primary API Model</Label>
                    <Select
                      value={modelSelection.image.apiModel}
                      onValueChange={(value) => handleModelSelectionChange("image", "apiModel", value)}
                    >
                      <SelectTrigger id="image-api-model">
                        <SelectValue placeholder="Select API model" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModels.api.image.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name} ({model.provider})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-muted-foreground">
                        Selected model will be used for all API-based image generation requests
                      </p>
                      <Button variant="outline" size="sm" onClick={() => setActiveTab("api-providers")}>
                        Manage API Providers
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}

              {modelSelection.image.mode === "hybrid" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Hybrid Strategy</h3>
                  <div className="space-y-2">
                    <Label htmlFor="image-hybrid-strategy">Strategy</Label>
                    <Select
                      value={modelSelection.image.hybridStrategy}
                      onValueChange={(value) => handleModelSelectionChange("image", "hybridStrategy", value)}
                    >
                      <SelectTrigger id="image-hybrid-strategy">
                        <SelectValue placeholder="Select strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fallback">Fallback (Local → API)</SelectItem>
                        <SelectItem value="cost-based">Cost-Based Optimization</SelectItem>
                        <SelectItem value="performance-based">Performance-Based Optimization</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      {modelSelection.image.hybridStrategy === "fallback"
                        ? "Use local model first, fall back to API if local model fails or is unavailable"
                        : modelSelection.image.hybridStrategy === "cost-based"
                          ? "Optimize for cost by using local models for most requests and API models for specific cases"
                          : "Optimize for performance by routing requests to the most appropriate model based on complexity"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-providers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Providers Configuration</CardTitle>
              <CardDescription>Configure external AI model providers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30">
                <Globe className="h-4 w-4" />
                <AlertTitle>API Providers</AlertTitle>
                <AlertDescription>
                  Configure API keys and settings for external AI model providers. These providers offer additional
                  models that can be used alongside or instead of local models.
                </AlertDescription>
              </Alert>

              {apiProviders.map((provider) => (
                <div key={provider.id} className="space-y-4 border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium">{provider.name}</h3>
                      <Badge variant={provider.enabled ? "default" : "outline"}>
                        {provider.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <Switch
                      checked={provider.enabled}
                      onCheckedChange={(checked) => handleApiProviderChange(provider.id, "enabled", checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${provider.id}-api-key`}>API Key</Label>
                    <Input
                      id={`${provider.id}-api-key`}
                      type="password"
                      value={provider.apiKey}
                      onChange={(e) => handleApiProviderChange(provider.id, "apiKey", e.target.value)}
                      placeholder="Enter API key"
                      disabled={!provider.enabled}
                    />
                    <p className="text-sm text-muted-foreground">
                      API key for authenticating with {provider.name}. Keep this secret!
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Available Models</Label>
                    <div className="flex flex-wrap gap-2">
                      {provider.models.map((model) => (
                        <Badge key={model} variant="secondary">
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

