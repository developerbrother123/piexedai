"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Database, Server, Settings, User, HardDrive, Cloud } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function InstallerPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [progress, setProgress] = useState(0)
  const [installationComplete, setInstallationComplete] = useState(false)
  const [dbConfig, setDbConfig] = useState({
    type: "postgresql",
    host: "localhost",
    port: "5432",
    user: "postgres",
    password: "",
    database: "piexed_ai",
  })
  const [adminUser, setAdminUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [siteConfig, setSiteConfig] = useState({
    siteName: "Piexed AI",
    siteDescription: "Self-Evolving Generative AI Platform",
    siteUrl: "",
    defaultModel: "Pi-o",
  })
  const [storageConfig, setStorageConfig] = useState({
    type: "local",
    path: "/uploads",
    cloudProvider: "",
    apiKey: "",
    bucket: "",
    region: "",
  })

  const totalSteps = 5

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      setProgress((currentStep / totalSteps) * 100)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setProgress(((currentStep - 2) / totalSteps) * 100)
    }
  }

  const handleInstall = async () => {
    // Simulate installation process
    setProgress(0)

    // Database setup
    await simulateProgress(20)

    // File system setup
    await simulateProgress(40)

    // Admin user creation
    await simulateProgress(60)

    // Configuration
    await simulateProgress(80)

    // Finalization
    await simulateProgress(100)

    setInstallationComplete(true)
  }

  const simulateProgress = async (targetProgress) => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= targetProgress) {
            clearInterval(interval)
            resolve()
            return targetProgress
          }
          return prev + 1
        })
      }, 50)
    })
  }

  const handleDbConfigChange = (field, value) => {
    setDbConfig({
      ...dbConfig,
      [field]: value,
    })
  }

  const handleAdminUserChange = (field, value) => {
    setAdminUser({
      ...adminUser,
      [field]: value,
    })
  }

  const handleSiteConfigChange = (field, value) => {
    setSiteConfig({
      ...siteConfig,
      [field]: value,
    })
  }

  const handleStorageConfigChange = (field, value) => {
    setStorageConfig({
      ...storageConfig,
      [field]: value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Piexed AI Installer</h1>
          <p className="text-gray-600">Set up your Self-Evolving Generative AI Platform</p>
        </div>

        <Progress value={progress} className="h-2 mb-8" />

        {!installationComplete ? (
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "Welcome to Piexed AI"}
                {currentStep === 2 && "Database Configuration"}
                {currentStep === 3 && "Admin User Setup"}
                {currentStep === 4 && "Site Configuration"}
                {currentStep === 5 && "Storage Configuration"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Let's get your AI platform up and running"}
                {currentStep === 2 && "Configure your database connection"}
                {currentStep === 3 && "Create your superadmin account"}
                {currentStep === 4 && "Configure your site settings"}
                {currentStep === 5 && "Set up your storage preferences"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {currentStep === 1 && (
                <div className="space-y-6">
                  <Alert>
                    <Server className="h-4 w-4" />
                    <AlertTitle>System Requirements</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Node.js 18.0 or higher</li>
                        <li>PostgreSQL 13.0 or higher</li>
                        <li>At least 2GB of RAM</li>
                        <li>At least 1GB of storage space</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Easy Setup</h3>
                        <p className="text-sm text-gray-500">Complete installation in minutes</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Full Control</h3>
                        <p className="text-sm text-gray-500">Manage all aspects from admin panel</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">AI Models</h3>
                        <p className="text-sm text-gray-500">Pre-configured AI models ready to use</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Flexible Storage</h3>
                        <p className="text-sm text-gray-500">Local or cloud storage options</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="db-type">Database Type</Label>
                      <Select value={dbConfig.type} onValueChange={(value) => handleDbConfigChange("type", value)}>
                        <SelectTrigger id="db-type">
                          <SelectValue placeholder="Select database type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="postgresql">PostgreSQL</SelectItem>
                          <SelectItem value="mysql">MySQL</SelectItem>
                          <SelectItem value="sqlite">SQLite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="db-host">Host</Label>
                      <Input
                        id="db-host"
                        value={dbConfig.host}
                        onChange={(e) => handleDbConfigChange("host", e.target.value)}
                        placeholder="localhost"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="db-port">Port</Label>
                      <Input
                        id="db-port"
                        value={dbConfig.port}
                        onChange={(e) => handleDbConfigChange("port", e.target.value)}
                        placeholder="5432"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="db-user">Username</Label>
                      <Input
                        id="db-user"
                        value={dbConfig.user}
                        onChange={(e) => handleDbConfigChange("user", e.target.value)}
                        placeholder="postgres"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="db-password">Password</Label>
                      <Input
                        id="db-password"
                        type="password"
                        value={dbConfig.password}
                        onChange={(e) => handleDbConfigChange("password", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="db-name">Database Name</Label>
                      <Input
                        id="db-name"
                        value={dbConfig.database}
                        onChange={(e) => handleDbConfigChange("database", e.target.value)}
                        placeholder="piexed_ai"
                      />
                    </div>
                  </div>

                  <Alert className="mt-4">
                    <Database className="h-4 w-4" />
                    <AlertTitle>Database Connection</AlertTitle>
                    <AlertDescription>
                      The installer will create all necessary tables and initial data.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-username">Username</Label>
                      <Input
                        id="admin-username"
                        value={adminUser.username}
                        onChange={(e) => handleAdminUserChange("username", e.target.value)}
                        placeholder="admin"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        value={adminUser.email}
                        onChange={(e) => handleAdminUserChange("email", e.target.value)}
                        placeholder="admin@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        value={adminUser.password}
                        onChange={(e) => handleAdminUserChange("password", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-confirm-password">Confirm Password</Label>
                      <Input
                        id="admin-confirm-password"
                        type="password"
                        value={adminUser.confirmPassword}
                        onChange={(e) => handleAdminUserChange("confirmPassword", e.target.value)}
                      />
                    </div>
                  </div>

                  <Alert className="mt-4">
                    <User className="h-4 w-4" />
                    <AlertTitle>Superadmin Account</AlertTitle>
                    <AlertDescription>
                      This account will have full control over all aspects of the platform, including content, users,
                      models, and settings.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="site-name">Site Name</Label>
                      <Input
                        id="site-name"
                        value={siteConfig.siteName}
                        onChange={(e) => handleSiteConfigChange("siteName", e.target.value)}
                        placeholder="Piexed AI"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="site-description">Site Description</Label>
                      <Input
                        id="site-description"
                        value={siteConfig.siteDescription}
                        onChange={(e) => handleSiteConfigChange("siteDescription", e.target.value)}
                        placeholder="Self-Evolving Generative AI Platform"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="site-url">Site URL</Label>
                      <Input
                        id="site-url"
                        value={siteConfig.siteUrl}
                        onChange={(e) => handleSiteConfigChange("siteUrl", e.target.value)}
                        placeholder="https://your-domain.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="default-model">Default AI Model</Label>
                      <Select
                        value={siteConfig.defaultModel}
                        onValueChange={(value) => handleSiteConfigChange("defaultModel", value)}
                      >
                        <SelectTrigger id="default-model">
                          <SelectValue placeholder="Select default model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pi-o">Pi-o (Basic)</SelectItem>
                          <SelectItem value="Pi-Transformer">Pi-Transformer (Advanced)</SelectItem>
                          <SelectItem value="Pi-Alpha">Pi-Alpha (Premium)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Alert className="mt-4">
                    <Settings className="h-4 w-4" />
                    <AlertTitle>Site Configuration</AlertTitle>
                    <AlertDescription>These settings can be changed later from the admin panel.</AlertDescription>
                  </Alert>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="storage-type">Storage Type</Label>
                      <Select
                        value={storageConfig.type}
                        onValueChange={(value) => handleStorageConfigChange("type", value)}
                      >
                        <SelectTrigger id="storage-type">
                          <SelectValue placeholder="Select storage type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">Local Storage</SelectItem>
                          <SelectItem value="cloud">Cloud Storage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {storageConfig.type === "local" && (
                      <div className="space-y-2">
                        <Label htmlFor="storage-path">Storage Path</Label>
                        <Input
                          id="storage-path"
                          value={storageConfig.path}
                          onChange={(e) => handleStorageConfigChange("path", e.target.value)}
                          placeholder="/uploads"
                        />
                      </div>
                    )}

                    {storageConfig.type === "cloud" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="cloud-provider">Cloud Provider</Label>
                          <Select
                            value={storageConfig.cloudProvider}
                            onValueChange={(value) => handleStorageConfigChange("cloudProvider", value)}
                          >
                            <SelectTrigger id="cloud-provider">
                              <SelectValue placeholder="Select cloud provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="aws">AWS S3</SelectItem>
                              <SelectItem value="gcp">Google Cloud Storage</SelectItem>
                              <SelectItem value="wasabi">Wasabi</SelectItem>
                              <SelectItem value="vultr">Vultr Object Storage</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="api-key">API Key/Access Key</Label>
                          <Input
                            id="api-key"
                            value={storageConfig.apiKey}
                            onChange={(e) => handleStorageConfigChange("apiKey", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bucket">Bucket Name</Label>
                          <Input
                            id="bucket"
                            value={storageConfig.bucket}
                            onChange={(e) => handleStorageConfigChange("bucket", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="region">Region</Label>
                          <Input
                            id="region"
                            value={storageConfig.region}
                            onChange={(e) => handleStorageConfigChange("region", e.target.value)}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <Alert className="mt-4">
                    {storageConfig.type === "local" ? <HardDrive className="h-4 w-4" /> : <Cloud className="h-4 w-4" />}
                    <AlertTitle>{storageConfig.type === "local" ? "Local Storage" : "Cloud Storage"}</AlertTitle>
                    <AlertDescription>
                      {storageConfig.type === "local"
                        ? "Files will be stored on your server. Make sure the path is writable."
                        : "Files will be stored in the cloud. Make sure your credentials are correct."}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button onClick={handleInstall}>Install Now</Button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-green-600">Installation Complete!</CardTitle>
              <CardDescription className="text-center">Your Piexed AI platform is now ready to use</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>

              <div className="text-center space-y-2">
                <p className="font-medium">Admin Dashboard Access</p>
                <p className="text-sm text-gray-500">
                  URL: {siteConfig.siteUrl}/admin
                  <br />
                  Username: {adminUser.username}
                  <br />
                  Email: {adminUser.email}
                </p>
              </div>

              <Alert>
                <AlertTitle>Next Steps</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Log in to your admin dashboard</li>
                    <li>Configure your AI models</li>
                    <li>Set up subscription plans</li>
                    <li>Customize your landing page</li>
                    <li>Invite users to your platform</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>

            <CardFooter className="flex justify-center">
              <Button onClick={() => (window.location.href = `${siteConfig.siteUrl}/admin`)}>
                Go to Admin Dashboard
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

