"use client"

import { Textarea } from "@/components/ui/textarea"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Check, CreditCard, RefreshCw, Save, Settings, Users } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

export default function UserLimitsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("subscription-plans")

  // Subscription plans
  const [subscriptionPlans, setSubscriptionPlans] = useState([
    {
      id: "basic",
      name: "Basic",
      price: 9.99,
      interval: "month",
      limits: {
        messagesPerDay: 100,
        tokensPerMessage: 2000,
        imagesPerDay: 10,
        modelsAccess: ["Pi-o"],
      },
      features: ["Text generation", "Question answering", "Basic chat"],
    },
    {
      id: "pro",
      name: "Pro",
      price: 19.99,
      interval: "month",
      limits: {
        messagesPerDay: 500,
        tokensPerMessage: 4000,
        imagesPerDay: 50,
        modelsAccess: ["Pi-o", "Pi-Transformer"],
      },
      features: ["Text generation", "Question answering", "Advanced chat", "Code generation", "Creative writing"],
    },
    {
      id: "super-pi",
      name: "Super Pi",
      price: 49.99,
      interval: "month",
      limits: {
        messagesPerDay: 2000,
        tokensPerMessage: 8000,
        imagesPerDay: 200,
        modelsAccess: ["Pi-o", "Pi-Transformer", "Pi-Alpha"],
      },
      features: [
        "Text generation",
        "Question answering",
        "Premium chat",
        "Code generation",
        "Creative writing",
        "Image generation",
        "Music generation",
        "Video generation",
        "Emotional intelligence",
      ],
    },
  ])

  // Global limits
  const [globalLimits, setGlobalLimits] = useState({
    enabled: true,
    freeUserLimits: {
      messagesPerDay: 20,
      tokensPerMessage: 1000,
      imagesPerDay: 2,
      modelsAccess: ["Pi-o"],
    },
    rateLimiting: {
      enabled: true,
      requestsPerMinute: 10,
      burstRequests: 20,
    },
    contentFiltering: {
      enabled: true,
      moderatePrompts: true,
      moderateResponses: true,
      blockListedTopics: ["violence", "explicit", "illegal"],
    },
  })

  // User overrides
  const [userOverrides, setUserOverrides] = useState([
    {
      id: "user-1",
      email: "john.doe@example.com",
      name: "John Doe",
      overrides: {
        messagesPerDay: 200,
        tokensPerMessage: 4000,
        imagesPerDay: 20,
        modelsAccess: ["Pi-o", "Pi-Transformer"],
      },
      reason: "Beta tester",
    },
    {
      id: "user-2",
      email: "jane.smith@example.com",
      name: "Jane Smith",
      overrides: {
        messagesPerDay: 50,
        tokensPerMessage: 2000,
        imagesPerDay: 5,
        modelsAccess: ["Pi-o"],
      },
      reason: "Special case",
    },
  ])

  // Selected plan for editing
  const [selectedPlan, setSelectedPlan] = useState(null)

  // New user override form
  const [newUserOverride, setNewUserOverride] = useState({
    email: "",
    messagesPerDay: 100,
    tokensPerMessage: 2000,
    imagesPerDay: 10,
    modelsAccess: ["Pi-o"],
    reason: "",
  })

  // Simulate loading data
  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSubscriptionPlanChange = (planId, field, value) => {
    setSubscriptionPlans(
      subscriptionPlans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              [field]: value,
            }
          : plan,
      ),
    )
  }

  const handleSubscriptionPlanLimitChange = (planId, field, value) => {
    setSubscriptionPlans(
      subscriptionPlans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              limits: {
                ...plan.limits,
                [field]: value,
              },
            }
          : plan,
      ),
    )
  }

  const handleGlobalLimitsChange = (field, value) => {
    setGlobalLimits({
      ...globalLimits,
      [field]: value,
    })
  }

  const handleFreeUserLimitsChange = (field, value) => {
    setGlobalLimits({
      ...globalLimits,
      freeUserLimits: {
        ...globalLimits.freeUserLimits,
        [field]: value,
      },
    })
  }

  const handleRateLimitingChange = (field, value) => {
    setGlobalLimits({
      ...globalLimits,
      rateLimiting: {
        ...globalLimits.rateLimiting,
        [field]: value,
      },
    })
  }

  const handleContentFilteringChange = (field, value) => {
    setGlobalLimits({
      ...globalLimits,
      contentFiltering: {
        ...globalLimits.contentFiltering,
        [field]: value,
      },
    })
  }

  const handleBlockListedTopicToggle = (topic) => {
    const currentTopics = globalLimits.contentFiltering.blockListedTopics
    const updatedTopics = currentTopics.includes(topic)
      ? currentTopics.filter((t) => t !== topic)
      : [...currentTopics, topic]

    setGlobalLimits({
      ...globalLimits,
      contentFiltering: {
        ...globalLimits.contentFiltering,
        blockListedTopics: updatedTopics,
      },
    })
  }

  const handleNewUserOverrideChange = (field, value) => {
    setNewUserOverride({
      ...newUserOverride,
      [field]: value,
    })
  }

  const handleModelAccessToggle = (planId, model) => {
    setSubscriptionPlans(
      subscriptionPlans.map((plan) => {
        if (plan.id === planId) {
          const currentModels = plan.limits.modelsAccess
          const updatedModels = currentModels.includes(model)
            ? currentModels.filter((m) => m !== model)
            : [...currentModels, model]

          return {
            ...plan,
            limits: {
              ...plan.limits,
              modelsAccess: updatedModels,
            },
          }
        }
        return plan
      }),
    )
  }

  const handleUserOverrideModelAccessToggle = (userId, model) => {
    setUserOverrides(
      userOverrides.map((user) => {
        if (user.id === userId) {
          const currentModels = user.overrides.modelsAccess
          const updatedModels = currentModels.includes(model)
            ? currentModels.filter((m) => m !== model)
            : [...currentModels, model]

          return {
            ...user,
            overrides: {
              ...user.overrides,
              modelsAccess: updatedModels,
            },
          }
        }
        return user
      }),
    )
  }

  const handleNewUserOverrideModelAccessToggle = (model) => {
    const currentModels = newUserOverride.modelsAccess
    const updatedModels = currentModels.includes(model)
      ? currentModels.filter((m) => m !== model)
      : [...currentModels, model]

    setNewUserOverride({
      ...newUserOverride,
      modelsAccess: updatedModels,
    })
  }

  const handleAddUserOverride = () => {
    if (!newUserOverride.email) {
      setError("Please provide a user email")
      return
    }

    setIsSaving(true)
    setSuccess("")
    setError("")

    // Simulate API call to add user override
    setTimeout(() => {
      setIsSaving(false)
      setSuccess("User override added successfully")

      // Add to user overrides
      setUserOverrides([
        ...userOverrides,
        {
          id: `user-${userOverrides.length + 1}`,
          email: newUserOverride.email,
          name: newUserOverride.email.split("@")[0],
          overrides: {
            messagesPerDay: newUserOverride.messagesPerDay,
            tokensPerMessage: newUserOverride.tokensPerMessage,
            imagesPerDay: newUserOverride.imagesPerDay,
            modelsAccess: newUserOverride.modelsAccess,
          },
          reason: newUserOverride.reason,
        },
      ])

      // Reset form
      setNewUserOverride({
        email: "",
        messagesPerDay: 100,
        tokensPerMessage: 2000,
        imagesPerDay: 10,
        modelsAccess: ["Pi-o"],
        reason: "",
      })

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    }, 1500)
  }

  const handleDeleteUserOverride = (userId) => {
    setUserOverrides(userOverrides.filter((user) => user.id !== userId))
    setSuccess("User override deleted successfully")

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  const handleSaveConfig = () => {
    setIsSaving(true)
    setSuccess("")
    setError("")

    // Simulate API call to save configuration
    setTimeout(() => {
      setIsSaving(false)
      setSuccess("User limits configuration saved successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Limits</h1>
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
          <TabsTrigger value="subscription-plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="global-limits">Global Limits</TabsTrigger>
          <TabsTrigger value="user-overrides">User Overrides</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription-plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>Configure limits for each subscription plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30">
                <CreditCard className="h-4 w-4" />
                <AlertTitle>Subscription Plans</AlertTitle>
                <AlertDescription>
                  Define usage limits for each subscription plan. These limits determine how many messages, tokens, and
                  images users can generate, as well as which models they can access.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subscriptionPlans.map((plan) => (
                  <Card key={plan.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50">
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>
                        ${plan.price}/{plan.interval}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Usage Limits</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="flex justify-between">
                            <span>Messages per day:</span>
                            <span>{plan.limits.messagesPerDay}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Tokens per message:</span>
                            <span>{plan.limits.tokensPerMessage}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Images per day:</span>
                            <span>{plan.limits.imagesPerDay}</span>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Model Access</h4>
                        <div className="flex flex-wrap gap-2">
                          {plan.limits.modelsAccess.map((model) => (
                            <Badge key={model} variant="secondary">
                              {model}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Features</h4>
                        <ul className="space-y-1 text-sm">
                          {plan.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <Check className="h-3 w-3 mr-2 text-green-500" />
                              {feature}
                            </li>
                          ))}
                          {plan.features.length > 3 && (
                            <li className="text-muted-foreground">+{plan.features.length - 3} more features</li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/20 p-4">
                      <Button variant="outline" className="w-full" onClick={() => setSelectedPlan(plan)}>
                        Edit Limits
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {selectedPlan && (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit {selectedPlan.name} Plan Limits</CardTitle>
                    <CardDescription>Adjust usage limits for this subscription plan</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="messages-per-day">
                              Messages per day: {selectedPlan.limits.messagesPerDay}
                            </Label>
                          </div>
                          <Slider
                            id="messages-per-day"
                            min={10}
                            max={5000}
                            step={10}
                            value={[selectedPlan.limits.messagesPerDay]}
                            onValueChange={(value) =>
                              handleSubscriptionPlanLimitChange(selectedPlan.id, "messagesPerDay", value[0])
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="tokens-per-message">
                              Tokens per message: {selectedPlan.limits.tokensPerMessage}
                            </Label>
                          </div>
                          <Slider
                            id="tokens-per-message"
                            min={500}
                            max={16000}
                            step={500}
                            value={[selectedPlan.limits.tokensPerMessage]}
                            onValueChange={(value) =>
                              handleSubscriptionPlanLimitChange(selectedPlan.id, "tokensPerMessage", value[0])
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="images-per-day">Images per day: {selectedPlan.limits.imagesPerDay}</Label>
                          </div>
                          <Slider
                            id="images-per-day"
                            min={0}
                            max={500}
                            step={5}
                            value={[selectedPlan.limits.imagesPerDay]}
                            onValueChange={(value) =>
                              handleSubscriptionPlanLimitChange(selectedPlan.id, "imagesPerDay", value[0])
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label>Model Access</Label>
                        <div className="space-y-2">
                          {["Pi-o", "Pi-Transformer", "Pi-Alpha"].map((model) => (
                            <div key={model} className="flex items-center space-x-2">
                              <Checkbox
                                id={`model-access-${model}`}
                                checked={selectedPlan.limits.modelsAccess.includes(model)}
                                onCheckedChange={() => handleModelAccessToggle(selectedPlan.id, model)}
                              />
                              <Label htmlFor={`model-access-${model}`}>{model}</Label>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2 mt-6">
                          <Label htmlFor="plan-price">Price (USD)</Label>
                          <div className="flex items-center space-x-2">
                            <span>$</span>
                            <Input
                              id="plan-price"
                              type="number"
                              value={selectedPlan.price}
                              onChange={(e) =>
                                handleSubscriptionPlanChange(
                                  selectedPlan.id,
                                  "price",
                                  Number.parseFloat(e.target.value),
                                )
                              }
                              step={0.01}
                              min={0}
                            />
                          </div>
                        </div>

                        <div className="space-y-2 mt-4">
                          <Label htmlFor="plan-interval">Billing Interval</Label>
                          <Select
                            value={selectedPlan.interval}
                            onValueChange={(value) => handleSubscriptionPlanChange(selectedPlan.id, "interval", value)}
                          >
                            <SelectTrigger id="plan-interval">
                              <SelectValue placeholder="Select interval" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="month">Monthly</SelectItem>
                              <SelectItem value="year">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setSelectedPlan(null)}>Save Changes</Button>
                  </CardFooter>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="global-limits" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Global Limits</CardTitle>
                  <CardDescription>Configure system-wide usage limits</CardDescription>
                </div>
                <Switch
                  checked={globalLimits.enabled}
                  onCheckedChange={(checked) => handleGlobalLimitsChange("enabled", checked)}
                  aria-label="Toggle global limits"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30">
                <Settings className="h-4 w-4" />
                <AlertTitle>Global Limits</AlertTitle>
                <AlertDescription>
                  Configure system-wide limits that apply to all users. These settings include free user limits, rate
                  limiting, and content filtering.
                </AlertDescription>
              </Alert>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Free User Limits</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="free-messages-per-day">
                          Messages per day: {globalLimits.freeUserLimits.messagesPerDay}
                        </Label>
                      </div>
                      <Slider
                        id="free-messages-per-day"
                        min={0}
                        max={100}
                        step={5}
                        value={[globalLimits.freeUserLimits.messagesPerDay]}
                        onValueChange={(value) => handleFreeUserLimitsChange("messagesPerDay", value[0])}
                        disabled={!globalLimits.enabled}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="free-tokens-per-message">
                          Tokens per message: {globalLimits.freeUserLimits.tokensPerMessage}
                        </Label>
                      </div>
                      <Slider
                        id="free-tokens-per-message"
                        min={100}
                        max={4000}
                        step={100}
                        value={[globalLimits.freeUserLimits.tokensPerMessage]}
                        onValueChange={(value) => handleFreeUserLimitsChange("tokensPerMessage", value[0])}
                        disabled={!globalLimits.enabled}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="free-images-per-day">
                          Images per day: {globalLimits.freeUserLimits.imagesPerDay}
                        </Label>
                      </div>
                      <Slider
                        id="free-images-per-day"
                        min={0}
                        max={20}
                        step={1}
                        value={[globalLimits.freeUserLimits.imagesPerDay]}
                        onValueChange={(value) => handleFreeUserLimitsChange("imagesPerDay", value[0])}
                        disabled={!globalLimits.enabled}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Model Access</Label>
                      <div className="space-y-2">
                        {["Pi-o", "Pi-Transformer", "Pi-Alpha"].map((model) => (
                          <div key={model} className="flex items-center space-x-2">
                            <Checkbox
                              id={`free-model-access-${model}`}
                              checked={globalLimits.freeUserLimits.modelsAccess.includes(model)}
                              onCheckedChange={() => {
                                const currentModels = globalLimits.freeUserLimits.modelsAccess
                                const updatedModels = currentModels.includes(model)
                                  ? currentModels.filter((m) => m !== model)
                                  : [...currentModels, model]
                                handleFreeUserLimitsChange("modelsAccess", updatedModels)
                              }}
                              disabled={!globalLimits.enabled}
                            />
                            <Label htmlFor={`free-model-access-${model}`}>{model}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Rate Limiting</h3>
                    <Switch
                      checked={globalLimits.rateLimiting.enabled}
                      onCheckedChange={(checked) => handleRateLimitingChange("enabled", checked)}
                      disabled={!globalLimits.enabled}
                      aria-label="Toggle rate limiting"
                    />
                  </div>
                  <div className="space-y-4 pl-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="requests-per-minute">
                          Requests per minute: {globalLimits.rateLimiting.requestsPerMinute}
                        </Label>
                      </div>
                      <Slider
                        id="requests-per-minute"
                        min={1}
                        max={60}
                        step={1}
                        value={[globalLimits.rateLimiting.requestsPerMinute]}
                        onValueChange={(value) => handleRateLimitingChange("requestsPerMinute", value[0])}
                        disabled={!globalLimits.enabled || !globalLimits.rateLimiting.enabled}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="burst-requests">
                          Burst requests: {globalLimits.rateLimiting.burstRequests}
                        </Label>
                      </div>
                      <Slider
                        id="burst-requests"
                        min={1}
                        max={100}
                        step={1}
                        value={[globalLimits.rateLimiting.burstRequests]}
                        onValueChange={(value) => handleRateLimitingChange("burstRequests", value[0])}
                        disabled={!globalLimits.enabled || !globalLimits.rateLimiting.enabled}
                      />
                      <p className="text-sm text-muted-foreground">
                        Maximum number of requests allowed in a short burst
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Content Filtering</h3>
                    <Switch
                      checked={globalLimits.contentFiltering.enabled}
                      onCheckedChange={(checked) => handleContentFilteringChange("enabled", checked)}
                      disabled={!globalLimits.enabled}
                      aria-label="Toggle content filtering"
                    />
                  </div>
                  <div className="space-y-4 pl-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="moderate-prompts"
                        checked={globalLimits.contentFiltering.moderatePrompts}
                        onCheckedChange={(checked) => handleContentFilteringChange("moderatePrompts", checked)}
                        disabled={!globalLimits.enabled || !globalLimits.contentFiltering.enabled}
                      />
                      <Label htmlFor="moderate-prompts">Moderate user prompts</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="moderate-responses"
                        checked={globalLimits.contentFiltering.moderateResponses}
                        onCheckedChange={(checked) => handleContentFilteringChange("moderateResponses", checked)}
                        disabled={!globalLimits.enabled || !globalLimits.contentFiltering.enabled}
                      />
                      <Label htmlFor="moderate-responses">Moderate AI responses</Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Block-listed Topics</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {["violence", "explicit", "illegal", "hate", "harassment", "self-harm", "misinformation"].map(
                          (topic) => (
                            <div key={topic} className="flex items-center space-x-2">
                              <Checkbox
                                id={`block-topic-${topic}`}
                                checked={globalLimits.contentFiltering.blockListedTopics.includes(topic)}
                                onCheckedChange={() => handleBlockListedTopicToggle(topic)}
                                disabled={!globalLimits.enabled || !globalLimits.contentFiltering.enabled}
                              />
                              <Label htmlFor={`block-topic-${topic}`} className="capitalize">
                                {topic}
                              </Label>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-overrides" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add User Override</CardTitle>
              <CardDescription>Create custom limits for specific users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-email">User Email</Label>
                <Input
                  id="user-email"
                  value={newUserOverride.email}
                  onChange={(e) => handleNewUserOverrideChange("email", e.target.value)}
                  placeholder="user@example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="override-messages-per-day">
                      Messages per day: {newUserOverride.messagesPerDay}
                    </Label>
                  </div>
                  <Slider
                    id="override-messages-per-day"
                    min={10}
                    max={5000}
                    step={10}
                    value={[newUserOverride.messagesPerDay]}
                    onValueChange={(value) => handleNewUserOverrideChange("messagesPerDay", value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="override-tokens-per-message">
                      Tokens per message: {newUserOverride.tokensPerMessage}
                    </Label>
                  </div>
                  <Slider
                    id="override-tokens-per-message"
                    min={500}
                    max={16000}
                    step={500}
                    value={[newUserOverride.tokensPerMessage]}
                    onValueChange={(value) => handleNewUserOverrideChange("tokensPerMessage", value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="override-images-per-day">Images per day: {newUserOverride.imagesPerDay}</Label>
                  </div>
                  <Slider
                    id="override-images-per-day"
                    min={0}
                    max={500}
                    step={5}
                    value={[newUserOverride.imagesPerDay]}
                    onValueChange={(value) => handleNewUserOverrideChange("imagesPerDay", value[0])}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Model Access</Label>
                <div className="flex flex-wrap gap-4">
                  {["Pi-o", "Pi-Transformer", "Pi-Alpha"].map((model) => (
                    <div key={model} className="flex items-center space-x-2">
                      <Checkbox
                        id={`override-model-access-${model}`}
                        checked={newUserOverride.modelsAccess.includes(model)}
                        onCheckedChange={() => handleNewUserOverrideModelAccessToggle(model)}
                      />
                      <Label htmlFor={`override-model-access-${model}`}>{model}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="override-reason">Reason for Override (Optional)</Label>
                <Textarea
                  id="override-reason"
                  value={newUserOverride.reason}
                  onChange={(e) => handleNewUserOverrideChange("reason", e.target.value)}
                  placeholder="Explain why this user needs custom limits"
                  rows={2}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddUserOverride} disabled={isSaving} className="ml-auto">
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    Add User Override
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Overrides</CardTitle>
              <CardDescription>Custom limits for specific users</CardDescription>
            </CardHeader>
            <CardContent>
              {userOverrides.length > 0 ? (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Messages/Day</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Tokens/Message</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Images/Day</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Models</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Reason</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {userOverrides.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-3 text-sm">
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-muted-foreground">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{user.overrides.messagesPerDay}</td>
                          <td className="px-4 py-3 text-sm">{user.overrides.tokensPerMessage}</td>
                          <td className="px-4 py-3 text-sm">{user.overrides.imagesPerDay}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex flex-wrap gap-1">
                              {user.overrides.modelsAccess.map((model) => (
                                <Badge key={model} variant="outline" className="text-xs">
                                  {model}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{user.reason || "-"}</td>
                          <td className="px-4 py-3 text-sm">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUserOverride(user.id)}
                              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No user overrides</p>
                  <p className="text-muted-foreground mb-4 text-center">Add custom limits for specific users above</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

