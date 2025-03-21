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
  BookOpen,
  Brain,
  Check,
  Clock,
  Database,
  FileText,
  Loader2,
  RefreshCw,
  Save,
  Sparkles,
  Upload,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export default function ModelTrainingPage() {
  const [activeTab, setActiveTab] = useState("self-learning")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [trainingStatus, setTrainingStatus] = useState("idle") // idle, running, paused
  const [trainingProgress, setTrainingProgress] = useState(0)

  // Self-learning configuration
  const [selfLearningEnabled, setSelfLearningEnabled] = useState(false)
  const [selfLearningConfig, setSelfLearningConfig] = useState({
    baseModel: "mistral-7b",
    learningRate: 0.00002,
    batchSize: 4,
    epochs: 3,
    maxTokens: 2048,
    evaluationFrequency: 1000,
    saveFrequency: 5000,
  })

  // Data sources configuration
  const [dataSources, setDataSources] = useState({
    userInteractions: true,
    userInteractionsConfig: {
      minConfidenceScore: 0.8,
      maxSamples: 10000,
      includeRejected: false,
    },
    internetSources: false,
    internetSourcesConfig: {
      websites: [
        { url: "wikipedia.org", enabled: true },
        { url: "github.com", enabled: true },
        { url: "stackoverflow.com", enabled: true },
        { url: "arxiv.org", enabled: true },
      ],
      maxDocumentsPerDay: 1000,
      contentTypes: ["articles", "documentation", "forums", "research"],
    },
    customDatasets: [],
  })

  // Training history
  const [trainingHistory, setTrainingHistory] = useState([
    {
      id: "train-1",
      model: "mistral-7b",
      startDate: "2023-06-10",
      endDate: "2023-06-11",
      samples: 5000,
      loss: 1.42,
      accuracy: 0.86,
      status: "completed",
    },
    {
      id: "train-2",
      model: "mistral-7b",
      startDate: "2023-06-15",
      endDate: null,
      samples: 2500,
      loss: 1.38,
      accuracy: 0.88,
      status: "interrupted",
    },
  ])

  // Custom dataset form
  const [customDataset, setCustomDataset] = useState({
    name: "",
    description: "",
    file: null,
    format: "jsonl",
  })

  // Simulate loading data
  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  // Simulate training progress
  useEffect(() => {
    let interval
    if (trainingStatus === "running") {
      interval = setInterval(() => {
        setTrainingProgress((prev) => {
          const newProgress = prev + Math.random() * 0.5
          if (newProgress >= 100) {
            clearInterval(interval)
            setTrainingStatus("idle")
            return 100
          }
          return newProgress
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [trainingStatus])

  const handleSelfLearningConfigChange = (field, value) => {
    setSelfLearningConfig({
      ...selfLearningConfig,
      [field]: value,
    })
  }

  const handleDataSourcesChange = (field, value) => {
    setDataSources({
      ...dataSources,
      [field]: value,
    })
  }

  const handleUserInteractionsConfigChange = (field, value) => {
    setDataSources({
      ...dataSources,
      userInteractionsConfig: {
        ...dataSources.userInteractionsConfig,
        [field]: value,
      },
    })
  }

  const handleInternetSourcesConfigChange = (field, value) => {
    setDataSources({
      ...dataSources,
      internetSourcesConfig: {
        ...dataSources.internetSourcesConfig,
        [field]: value,
      },
    })
  }

  const handleWebsiteToggle = (url, enabled) => {
    setDataSources({
      ...dataSources,
      internetSourcesConfig: {
        ...dataSources.internetSourcesConfig,
        websites: dataSources.internetSourcesConfig.websites.map((website) =>
          website.url === url ? { ...website, enabled } : website,
        ),
      },
    })
  }

  const handleContentTypeToggle = (type) => {
    const currentTypes = dataSources.internetSourcesConfig.contentTypes
    const updatedTypes = currentTypes.includes(type) ? currentTypes.filter((t) => t !== type) : [...currentTypes, type]

    setDataSources({
      ...dataSources,
      internetSourcesConfig: {
        ...dataSources.internetSourcesConfig,
        contentTypes: updatedTypes,
      },
    })
  }

  const handleCustomDatasetChange = (field, value) => {
    setCustomDataset({
      ...customDataset,
      [field]: value,
    })
  }

  const handleAddCustomDataset = () => {
    if (!customDataset.name) {
      setError("Please provide a name for the custom dataset")
      return
    }

    setIsSaving(true)
    setSuccess("")
    setError("")

    // Simulate API call to add custom dataset
    setTimeout(() => {
      setIsSaving(false)
      setSuccess("Custom dataset added successfully")

      // Add to custom datasets
      setDataSources({
        ...dataSources,
        customDatasets: [
          ...dataSources.customDatasets,
          {
            id: `dataset-${dataSources.customDatasets.length + 1}`,
            name: customDataset.name,
            description: customDataset.description,
            format: customDataset.format,
            size: "2.3MB",
            samples: 1250,
            dateAdded: new Date().toISOString().split("T")[0],
          },
        ],
      })

      // Reset form
      setCustomDataset({
        name: "",
        description: "",
        file: null,
        format: "jsonl",
      })

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    }, 1500)
  }

  const handleSaveConfig = () => {
    setIsSaving(true)
    setSuccess("")
    setError("")

    // Simulate API call to save configuration
    setTimeout(() => {
      setIsSaving(false)
      setSuccess("Configuration saved successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    }, 1500)
  }

  const handleStartTraining = () => {
    setTrainingStatus("running")
    setTrainingProgress(0)
    setSuccess("Training started")

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  const handlePauseTraining = () => {
    setTrainingStatus("paused")
    setSuccess("Training paused")

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  const handleResumeTraining = () => {
    setTrainingStatus("running")
    setSuccess("Training resumed")

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  const handleStopTraining = () => {
    setTrainingStatus("idle")
    setTrainingProgress(0)
    setSuccess("Training stopped")

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI Model Training</h1>
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

      {trainingStatus !== "idle" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Training in Progress</CardTitle>
            <CardDescription>
              {trainingStatus === "running" ? "Model is currently training" : "Training is paused"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(trainingProgress)}%</span>
              </div>
              <Progress value={trainingProgress} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <Brain className="h-4 w-4 mr-2 text-primary" />
                <span>Model: {selfLearningConfig.baseModel}</span>
              </div>
              <div className="flex items-center">
                <Database className="h-4 w-4 mr-2 text-primary" />
                <span>Samples processed: {Math.round(trainingProgress * 100)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                <span>Estimated time remaining: {Math.round(100 - trainingProgress)} minutes</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            {trainingStatus === "running" ? (
              <>
                <Button variant="outline" onClick={handlePauseTraining}>
                  Pause Training
                </Button>
                <Button variant="destructive" onClick={handleStopTraining}>
                  Stop Training
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleResumeTraining}>
                  Resume Training
                </Button>
                <Button variant="destructive" onClick={handleStopTraining}>
                  Stop Training
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="self-learning">Self-Learning</TabsTrigger>
          <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
          <TabsTrigger value="custom-datasets">Custom Datasets</TabsTrigger>
          <TabsTrigger value="training-history">Training History</TabsTrigger>
        </TabsList>

        <TabsContent value="self-learning" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Self-Learning Configuration</CardTitle>
                  <CardDescription>Configure how the AI model learns and improves over time</CardDescription>
                </div>
                <Switch
                  checked={selfLearningEnabled}
                  onCheckedChange={setSelfLearningEnabled}
                  aria-label="Toggle self-learning"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30">
                <Sparkles className="h-4 w-4" />
                <AlertTitle>About Self-Learning</AlertTitle>
                <AlertDescription>
                  Self-learning allows your AI models to continuously improve by learning from user interactions and
                  external data sources. This process runs in the background and periodically updates your models with
                  new knowledge.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="base-model">Base Model</Label>
                  <Select
                    value={selfLearningConfig.baseModel}
                    onValueChange={(value) => handleSelfLearningConfigChange("baseModel", value)}
                    disabled={!selfLearningEnabled}
                  >
                    <SelectTrigger id="base-model">
                      <SelectValue placeholder="Select base model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mistral-7b">Mistral AI 7B</SelectItem>
                      <SelectItem value="llama-3-8b">Meta Llama 3 8B</SelectItem>
                      <SelectItem value="gemma-7b">Gemma 7B</SelectItem>
                      <SelectItem value="falcon-7b">Falcon 7B</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    The foundation model that will be fine-tuned with new data
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="learning-rate">Learning Rate: {selfLearningConfig.learningRate}</Label>
                    </div>
                    <Slider
                      id="learning-rate"
                      min={0.00001}
                      max={0.0001}
                      step={0.00001}
                      value={[selfLearningConfig.learningRate]}
                      onValueChange={(value) => handleSelfLearningConfigChange("learningRate", value[0])}
                      disabled={!selfLearningEnabled}
                    />
                    <p className="text-sm text-muted-foreground">
                      Controls how quickly the model adapts to new information
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="batch-size">Batch Size: {selfLearningConfig.batchSize}</Label>
                    </div>
                    <Slider
                      id="batch-size"
                      min={1}
                      max={16}
                      step={1}
                      value={[selfLearningConfig.batchSize]}
                      onValueChange={(value) => handleSelfLearningConfigChange("batchSize", value[0])}
                      disabled={!selfLearningEnabled}
                    />
                    <p className="text-sm text-muted-foreground">
                      Number of samples processed together during training
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="epochs">Epochs: {selfLearningConfig.epochs}</Label>
                    </div>
                    <Slider
                      id="epochs"
                      min={1}
                      max={10}
                      step={1}
                      value={[selfLearningConfig.epochs]}
                      onValueChange={(value) => handleSelfLearningConfigChange("epochs", value[0])}
                      disabled={!selfLearningEnabled}
                    />
                    <p className="text-sm text-muted-foreground">
                      Number of complete passes through the training dataset
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="max-tokens">Max Tokens: {selfLearningConfig.maxTokens}</Label>
                    </div>
                    <Slider
                      id="max-tokens"
                      min={512}
                      max={4096}
                      step={512}
                      value={[selfLearningConfig.maxTokens]}
                      onValueChange={(value) => handleSelfLearningConfigChange("maxTokens", value[0])}
                      disabled={!selfLearningEnabled}
                    />
                    <p className="text-sm text-muted-foreground">Maximum sequence length for training examples</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="evaluation-frequency">Evaluation Frequency</Label>
                    <Select
                      value={selfLearningConfig.evaluationFrequency.toString()}
                      onValueChange={(value) =>
                        handleSelfLearningConfigChange("evaluationFrequency", Number.parseInt(value))
                      }
                      disabled={!selfLearningEnabled}
                    >
                      <SelectTrigger id="evaluation-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="500">Every 500 samples</SelectItem>
                        <SelectItem value="1000">Every 1,000 samples</SelectItem>
                        <SelectItem value="2000">Every 2,000 samples</SelectItem>
                        <SelectItem value="5000">Every 5,000 samples</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      How often to evaluate model performance during training
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="save-frequency">Save Frequency</Label>
                    <Select
                      value={selfLearningConfig.saveFrequency.toString()}
                      onValueChange={(value) => handleSelfLearningConfigChange("saveFrequency", Number.parseInt(value))}
                      disabled={!selfLearningEnabled}
                    >
                      <SelectTrigger id="save-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1000">Every 1,000 samples</SelectItem>
                        <SelectItem value="5000">Every 5,000 samples</SelectItem>
                        <SelectItem value="10000">Every 10,000 samples</SelectItem>
                        <SelectItem value="20000">Every 20,000 samples</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">How often to save model checkpoints during training</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>Last trained: Never</span>
              </div>
              <Button onClick={handleStartTraining} disabled={!selfLearningEnabled || trainingStatus !== "idle"}>
                {trainingStatus !== "idle" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="mr-2 h-4 w-4" />
                )}
                Start Training
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="data-sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Interactions</CardTitle>
              <CardDescription>Learn from conversations with users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="user-interactions"
                  checked={dataSources.userInteractions}
                  onCheckedChange={(checked) => handleDataSourcesChange("userInteractions", checked)}
                />
                <Label htmlFor="user-interactions">Enable learning from user interactions</Label>
              </div>

              <div className="space-y-4 pl-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="min-confidence-score">
                      Minimum Confidence Score: {dataSources.userInteractionsConfig.minConfidenceScore}
                    </Label>
                  </div>
                  <Slider
                    id="min-confidence-score"
                    min={0.5}
                    max={1}
                    step={0.05}
                    value={[dataSources.userInteractionsConfig.minConfidenceScore]}
                    onValueChange={(value) => handleUserInteractionsConfigChange("minConfidenceScore", value[0])}
                    disabled={!dataSources.userInteractions}
                  />
                  <p className="text-sm text-muted-foreground">
                    Only learn from responses with confidence above this threshold
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="max-samples">
                      Maximum Samples: {dataSources.userInteractionsConfig.maxSamples.toLocaleString()}
                    </Label>
                  </div>
                  <Slider
                    id="max-samples"
                    min={1000}
                    max={50000}
                    step={1000}
                    value={[dataSources.userInteractionsConfig.maxSamples]}
                    onValueChange={(value) => handleUserInteractionsConfigChange("maxSamples", value[0])}
                    disabled={!dataSources.userInteractions}
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum number of conversation samples to use for training
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-rejected"
                    checked={dataSources.userInteractionsConfig.includeRejected}
                    onCheckedChange={(checked) => handleUserInteractionsConfigChange("includeRejected", checked)}
                    disabled={!dataSources.userInteractions}
                  />
                  <Label htmlFor="include-rejected">Include rejected responses in training data</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Internet Sources</CardTitle>
              <CardDescription>Learn from websites, forums, and other online content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="internet-sources"
                  checked={dataSources.internetSources}
                  onCheckedChange={(checked) => handleDataSourcesChange("internetSources", checked)}
                />
                <Label htmlFor="internet-sources">Enable learning from internet sources</Label>
              </div>

              <div className="space-y-4 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="websites">Websites</Label>
                  <div className="space-y-2">
                    {dataSources.internetSourcesConfig.websites.map((website) => (
                      <div key={website.url} className="flex items-center space-x-2">
                        <Checkbox
                          id={`website-${website.url}`}
                          checked={website.enabled}
                          onCheckedChange={(checked) => handleWebsiteToggle(website.url, checked)}
                          disabled={!dataSources.internetSources}
                        />
                        <Label htmlFor={`website-${website.url}`}>{website.url}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="max-documents">
                      Maximum Documents per Day: {dataSources.internetSourcesConfig.maxDocumentsPerDay.toLocaleString()}
                    </Label>
                  </div>
                  <Slider
                    id="max-documents"
                    min={100}
                    max={5000}
                    step={100}
                    value={[dataSources.internetSourcesConfig.maxDocumentsPerDay]}
                    onValueChange={(value) => handleInternetSourcesConfigChange("maxDocumentsPerDay", value[0])}
                    disabled={!dataSources.internetSources}
                  />
                  <p className="text-sm text-muted-foreground">Maximum number of documents to process per day</p>
                </div>

                <div className="space-y-2">
                  <Label>Content Types</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {["articles", "documentation", "forums", "research", "news", "blogs", "academic", "books"].map(
                      (type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`content-type-${type}`}
                            checked={dataSources.internetSourcesConfig.contentTypes.includes(type)}
                            onCheckedChange={() => handleContentTypeToggle(type)}
                            disabled={!dataSources.internetSources}
                          />
                          <Label htmlFor={`content-type-${type}`} className="capitalize">
                            {type}
                          </Label>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom-datasets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Custom Dataset</CardTitle>
              <CardDescription>Upload your own training data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dataset-name">Dataset Name</Label>
                <Input
                  id="dataset-name"
                  value={customDataset.name}
                  onChange={(e) => handleCustomDatasetChange("name", e.target.value)}
                  placeholder="My Custom Dataset"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataset-description">Description (Optional)</Label>
                <Textarea
                  id="dataset-description"
                  value={customDataset.description}
                  onChange={(e) => handleCustomDatasetChange("description", e.target.value)}
                  placeholder="Description of the dataset and its contents"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataset-file">Upload File</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dataset-file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">JSONL, CSV, or TXT (max. 100MB)</p>
                    </div>
                    <input id="dataset-file" type="file" className="hidden" />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataset-format">File Format</Label>
                <Select
                  value={customDataset.format}
                  onValueChange={(value) => handleCustomDatasetChange("format", value)}
                >
                  <SelectTrigger id="dataset-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jsonl">JSONL (JSON Lines)</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="txt">Plain Text</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {customDataset.format === "jsonl"
                    ? "Each line should be a valid JSON object with 'prompt' and 'completion' fields"
                    : customDataset.format === "csv"
                      ? "CSV file with 'prompt' and 'completion' columns"
                      : "Plain text file with training examples"}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddCustomDataset} disabled={isSaving} className="ml-auto">
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Add Dataset
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {dataSources.customDatasets.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Custom Datasets</CardTitle>
                <CardDescription>Your uploaded training datasets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Format</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Size</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Samples</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Date Added</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {dataSources.customDatasets.map((dataset) => (
                        <tr key={dataset.id}>
                          <td className="px-4 py-3 text-sm">{dataset.name}</td>
                          <td className="px-4 py-3 text-sm">{dataset.format.toUpperCase()}</td>
                          <td className="px-4 py-3 text-sm">{dataset.size}</td>
                          <td className="px-4 py-3 text-sm">{dataset.samples}</td>
                          <td className="px-4 py-3 text-sm">{dataset.dateAdded}</td>
                          <td className="px-4 py-3 text-sm">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No custom datasets</p>
                <p className="text-muted-foreground mb-4 text-center">
                  Upload your own datasets to train the AI with custom data
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="training-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training History</CardTitle>
              <CardDescription>Past training sessions and their results</CardDescription>
            </CardHeader>
            <CardContent>
              {trainingHistory.length > 0 ? (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium">Model</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Start Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">End Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Samples</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Loss</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Accuracy</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {trainingHistory.map((session) => (
                        <tr key={session.id}>
                          <td className="px-4 py-3 text-sm">{session.model}</td>
                          <td className="px-4 py-3 text-sm">{session.startDate}</td>
                          <td className="px-4 py-3 text-sm">{session.endDate || "-"}</td>
                          <td className="px-4 py-3 text-sm">{session.samples.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">{session.loss}</td>
                          <td className="px-4 py-3 text-sm">{session.accuracy}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge
                              variant={
                                session.status === "completed"
                                  ? "default"
                                  : session.status === "interrupted"
                                    ? "destructive"
                                    : "outline"
                              }
                            >
                              {session.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No training history</p>
                  <p className="text-muted-foreground mb-4">
                    Training history will appear here once you start training your models
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

