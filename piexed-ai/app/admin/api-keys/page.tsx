"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, Check, Copy, Eye, EyeOff, Key, Plus, RefreshCw, Save, Search, Users } from "lucide-react"

export default function ApiKeysPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("keys")
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // API Keys
  const [apiKeys, setApiKeys] = useState([
    {
      id: "key-1",
      name: "Production API Key",
      key: "pk_live_51HG7d9CjgvF5XdZa9qV4cRWrI3X5XdZa9qV4cRWrI",
      createdAt: "2023-05-10",
      lastUsed: "2023-06-15",
      status: "active",
      allowedModels: ["Pi-o", "Pi-Transformer", "Pi-Alpha"],
      rateLimit: 100,
      owner: "admin@piexed.ai",
    },
    {
      id: "key-2",
      name: "Development API Key",
      key: "pk_test_51HG7d9CjgvF5XdZa9qV4cRWrI3X5XdZa9qV4cRWrI",
      createdAt: "2023-05-15",
      lastUsed: "2023-06-14",
      status: "active",
      allowedModels: ["Pi-o", "Pi-Transformer"],
      rateLimit: 50,
      owner: "dev@piexed.ai",
    },
    {
      id: "key-3",
      name: "Test API Key",
      key: "pk_test_51HG7d9CjgvF5XdZa9qV4cRWrI3X5XdZa9qV4cRWrI",
      createdAt: "2023-06-01",
      lastUsed: "2023-06-10",
      status: "revoked",
      allowedModels: ["Pi-o"],
      rateLimit: 20,
      owner: "test@piexed.ai",
    },
  ])

  // New key form
  const [newKeyForm, setNewKeyForm] = useState({
    name: "",
    allowedModels: ["Pi-o"],
    rateLimit: 50,
    owner: "",
  })

  // API Usage
  const [apiUsage, setApiUsage] = useState([
    {
      date: "2023-06-15",
      requests: 1250,
      successRate: 98.5,
      avgResponseTime: 245, // ms
      models: {
        "Pi-o": 750,
        "Pi-Transformer": 350,
        "Pi-Alpha": 150,
      },
    },
    {
      date: "2023-06-14",
      requests: 980,
      successRate: 99.1,
      avgResponseTime: 230, // ms
      models: {
        "Pi-o": 600,
        "Pi-Transformer": 280,
        "Pi-Alpha": 100,
      },
    },
    {
      date: "2023-06-13",
      requests: 1100,
      successRate: 97.8,
      avgResponseTime: 250, // ms
      models: {
        "Pi-o": 650,
        "Pi-Transformer": 320,
        "Pi-Alpha": 130,
      },
    },
  ])

  // Simulate loading data
  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleCreateKey = () => {
    if (!newKeyForm.name || !newKeyForm.owner) {
      setError("Please provide a name and owner for the API key")
      return
    }

    setIsSaving(true)
    setSuccess("")
    setError("")

    // Simulate API call to create a new key
    setTimeout(() => {
      const generatedKey = `pk_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`

      setNewKey(generatedKey)

      const newApiKey = {
        id: `key-${apiKeys.length + 1}`,
        name: newKeyForm.name,
        key: generatedKey,
        createdAt: new Date().toISOString().split("T")[0],
        lastUsed: "-",
        status: "active",
        allowedModels: newKeyForm.allowedModels,
        rateLimit: newKeyForm.rateLimit,
        owner: newKeyForm.owner,
      }

      setApiKeys([newApiKey, ...apiKeys])

      setIsSaving(false)
      setShowKey(true)

      // Reset form
      setNewKeyForm({
        name: "",
        allowedModels: ["Pi-o"],
        rateLimit: 50,
        owner: "",
      })
    }, 1500)
  }

  const handleRevokeKey = (keyId) => {
    setApiKeys(
      apiKeys.map((key) =>
        key.id === keyId
          ? {
              ...key,
              status: "revoked",
            }
          : key,
      ),
    )

    setSuccess("API key revoked successfully")

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key)
    setSuccess("API key copied to clipboard")

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  const filteredKeys = apiKeys.filter(
    (key) =>
      key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.owner.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">API Keys Management</h1>
        <Button onClick={() => setShowNewKeyDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create New API Key
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
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="usage">API Usage</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage API keys for developers</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search keys..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Key</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Last Used</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Models</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredKeys.map((key) => (
                      <tr key={key.id}>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <div className="font-medium">{key.name}</div>
                            <div className="text-muted-foreground">{key.owner}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono">
                              {key.key.substring(0, 8)}...{key.key.substring(key.key.length - 4)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleCopyKey(key.key)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{key.createdAt}</td>
                        <td className="px-4 py-3 text-sm">{key.lastUsed}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge
                            variant={key.status === "active" ? "default" : "secondary"}
                            className={
                              key.status === "revoked" ? "bg-red-100 text-red-800 hover:bg-red-100 border-red-200" : ""
                            }
                          >
                            {key.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex flex-wrap gap-1">
                            {key.allowedModels.map((model) => (
                              <Badge key={model} variant="outline" className="text-xs">
                                {model}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs"
                              onClick={() => {
                                // View key details
                              }}
                            >
                              View
                            </Button>
                            {key.status === "active" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs text-destructive"
                                onClick={() => handleRevokeKey(key.id)}
                              >
                                Revoke
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Statistics</CardTitle>
              <CardDescription>Monitor API usage and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Requests</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Success Rate</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Avg. Response Time</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Model Usage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {apiUsage.map((usage) => (
                      <tr key={usage.date}>
                        <td className="px-4 py-3 text-sm">{usage.date}</td>
                        <td className="px-4 py-3 text-sm">{usage.requests.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm">{usage.successRate}%</td>
                        <td className="px-4 py-3 text-sm">{usage.avgResponseTime} ms</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>Pi-o:</span>
                              <span>{usage.models["Pi-o"]} requests</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span>Pi-Transformer:</span>
                              <span>{usage.models["Pi-Transformer"]} requests</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span>Pi-Alpha:</span>
                              <span>{usage.models["Pi-Alpha"]} requests</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top API Users</CardTitle>
                <CardDescription>Users with the highest API usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">dev@piexed.ai</span>
                    </div>
                    <span>2,450 requests</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">admin@piexed.ai</span>
                    </div>
                    <span>1,820 requests</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">test@piexed.ai</span>
                    </div>
                    <span>950 requests</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Rates</CardTitle>
                <CardDescription>API error statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Rate Limit Exceeded</span>
                    <Badge variant="outline">0.8%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Authentication Errors</span>
                    <Badge variant="outline">0.5%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Invalid Parameters</span>
                    <Badge variant="outline">0.3%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Server Errors</span>
                    <Badge variant="outline">0.1%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>Configure global API settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="default-rate-limit">Default Rate Limit (requests per minute)</Label>
                <Input id="default-rate-limit" type="number" defaultValue="60" />
                <p className="text-sm text-muted-foreground">Default rate limit for new API keys</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-tokens">Maximum Tokens per Request</Label>
                <Input id="max-tokens" type="number" defaultValue="4096" />
                <p className="text-sm text-muted-foreground">
                  Maximum number of tokens that can be requested in a single API call
                </p>
              </div>

              <div className="space-y-2">
                <Label>Default Allowed Models</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="model-pi-o" defaultChecked />
                    <Label htmlFor="model-pi-o">Pi-o</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="model-pi-transformer" defaultChecked />
                    <Label htmlFor="model-pi-transformer">Pi-Transformer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="model-pi-alpha" />
                    <Label htmlFor="model-pi-alpha">Pi-Alpha</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Security Settings</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="require-https" defaultChecked />
                    <Label htmlFor="require-https">Require HTTPS for API requests</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="ip-restriction" />
                    <Label htmlFor="ip-restriction">Enable IP restrictions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="log-requests" defaultChecked />
                    <Label htmlFor="log-requests">Log all API requests</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>Manage API documentation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="docs-url">Documentation URL</Label>
                <Input id="docs-url" defaultValue="https://docs.piexed.ai/api" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="public-docs" defaultChecked />
                  <Label htmlFor="public-docs">Make documentation publicly accessible</Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="interactive-docs" defaultChecked />
                  <Label htmlFor="interactive-docs">Enable interactive API explorer</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create New API Key Dialog */}
      <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>Generate a new API key for developers to access the Piexed AI API.</DialogDescription>
          </DialogHeader>

          {newKey ? (
            <div className="space-y-4">
              <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  This key will only be displayed once. Please copy it now and store it securely.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Your API Key</Label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 font-mono text-sm p-2 border rounded-md bg-muted">
                    {showKey ? newKey : "•".repeat(newKey.length)}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setShowKey(!showKey)}>
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleCopyKey(newKey)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button
                  onClick={() => {
                    setNewKey(null)
                    setShowNewKeyDialog(false)
                  }}
                >
                  Done
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="key-name">Key Name</Label>
                  <Input
                    id="key-name"
                    placeholder="e.g., Production API Key"
                    value={newKeyForm.name}
                    onChange={(e) => setNewKeyForm({ ...newKeyForm, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="key-owner">Owner Email</Label>
                  <Input
                    id="key-owner"
                    placeholder="e.g., developer@example.com"
                    value={newKeyForm.owner}
                    onChange={(e) => setNewKeyForm({ ...newKeyForm, owner: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rate-limit">Rate Limit (requests per minute)</Label>
                  <Input
                    id="rate-limit"
                    type="number"
                    value={newKeyForm.rateLimit}
                    onChange={(e) => setNewKeyForm({ ...newKeyForm, rateLimit: Number.parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Allowed Models</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="allow-pi-o"
                        checked={newKeyForm.allowedModels.includes("Pi-o")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewKeyForm({
                              ...newKeyForm,
                              allowedModels: [...newKeyForm.allowedModels, "Pi-o"],
                            })
                          } else {
                            setNewKeyForm({
                              ...newKeyForm,
                              allowedModels: newKeyForm.allowedModels.filter((model) => model !== "Pi-o"),
                            })
                          }
                        }}
                      />
                      <Label htmlFor="allow-pi-o">Pi-o</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="allow-pi-transformer"
                        checked={newKeyForm.allowedModels.includes("Pi-Transformer")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewKeyForm({
                              ...newKeyForm,
                              allowedModels: [...newKeyForm.allowedModels, "Pi-Transformer"],
                            })
                          } else {
                            setNewKeyForm({
                              ...newKeyForm,
                              allowedModels: newKeyForm.allowedModels.filter((model) => model !== "Pi-Transformer"),
                            })
                          }
                        }}
                      />
                      <Label htmlFor="allow-pi-transformer">Pi-Transformer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="allow-pi-alpha"
                        checked={newKeyForm.allowedModels.includes("Pi-Alpha")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewKeyForm({
                              ...newKeyForm,
                              allowedModels: [...newKeyForm.allowedModels, "Pi-Alpha"],
                            })
                          } else {
                            setNewKeyForm({
                              ...newKeyForm,
                              allowedModels: newKeyForm.allowedModels.filter((model) => model !== "Pi-Alpha"),
                            })
                          }
                        }}
                      />
                      <Label htmlFor="allow-pi-alpha">Pi-Alpha</Label>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewKeyDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateKey} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Key className="mr-2 h-4 w-4" />
                      Create API Key
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

