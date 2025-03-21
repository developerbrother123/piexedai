"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Check, Cloud, HardDrive, RefreshCw, Save, Server } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function StorageSettingsPage() {
  const [activeTab, setActiveTab] = useState("local")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // Local storage settings
  const [localStorageEnabled, setLocalStorageEnabled] = useState(true)
  const [localStoragePath, setLocalStoragePath] = useState("/var/www/storage")
  const [localStorageQuota, setLocalStorageQuota] = useState(10) // GB
  const [localStorageUsed, setLocalStorageUsed] = useState(2.7) // GB
  const [localStorageAutoCleanup, setLocalStorageAutoCleanup] = useState(true)
  const [localStorageCleanupThreshold, setLocalStorageCleanupThreshold] = useState(80) // %

  // Cloud storage settings
  const [primaryStorageProvider, setPrimaryStorageProvider] = useState("local")
  const [cloudStorageEnabled, setCloudStorageEnabled] = useState(false)

  // Wasabi settings
  const [wasabiEnabled, setWasabiEnabled] = useState(false)
  const [wasabiAccessKey, setWasabiAccessKey] = useState("")
  const [wasabiSecretKey, setWasabiSecretKey] = useState("")
  const [wasabiBucket, setWasabiBucket] = useState("")
  const [wasabiRegion, setWasabiRegion] = useState("us-east-1")

  // AWS S3 settings
  const [s3Enabled, setS3Enabled] = useState(false)
  const [s3AccessKey, setS3AccessKey] = useState("")
  const [s3SecretKey, setS3SecretKey] = useState("")
  const [s3Bucket, setS3Bucket] = useState("")
  const [s3Region, setS3Region] = useState("us-east-1")

  // Google Cloud Storage settings
  const [gcsEnabled, setGcsEnabled] = useState(false)
  const [gcsProjectId, setGcsProjectId] = useState("")
  const [gcsBucket, setGcsBucket] = useState("")
  const [gcsKeyFile, setGcsKeyFile] = useState("")

  // Vultr Object Storage settings
  const [vultrEnabled, setVultrEnabled] = useState(false)
  const [vultrAccessKey, setVultrAccessKey] = useState("")
  const [vultrSecretKey, setVultrSecretKey] = useState("")
  const [vultrBucket, setVultrBucket] = useState("")
  const [vultrRegion, setVultrRegion] = useState("")

  // User local storage settings
  const [userLocalStorageEnabled, setUserLocalStorageEnabled] = useState(false)
  const [userLocalStorageMaxSize, setUserLocalStorageMaxSize] = useState(5) // GB
  const [userLocalStorageAllowedTypes, setUserLocalStorageAllowedTypes] = useState("images,audio,video,documents")
  const [userLocalStorageRequireApproval, setUserLocalStorageRequireApproval] = useState(true)

  // Simulate loading data
  useEffect(() => {
    // In a real implementation, this would fetch settings from the API
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSaveSettings = () => {
    setIsSaving(true)
    setSuccess("")
    setError("")

    // Simulate API call to save settings
    setTimeout(() => {
      setIsSaving(false)
      setSuccess("Storage settings saved successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    }, 1500)
  }

  const handleTestConnection = (provider) => {
    setIsLoading(true)
    setSuccess("")
    setError("")

    // Simulate API call to test connection
    setTimeout(() => {
      setIsLoading(false)
      if (Math.random() > 0.2) {
        // 80% chance of success for demo
        setSuccess(`Successfully connected to ${provider}`)
      } else {
        setError(`Failed to connect to ${provider}. Please check your credentials.`)
      }

      // Clear messages after 3 seconds
      setTimeout(() => {
        setSuccess("")
        setError("")
      }, 3000)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Storage Settings</h1>
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
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

      <Card>
        <CardHeader>
          <CardTitle>Primary Storage Provider</CardTitle>
          <CardDescription>Select the primary storage provider for your application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary-storage">Primary Storage</Label>
              <Select value={primaryStorageProvider} onValueChange={setPrimaryStorageProvider}>
                <SelectTrigger id="primary-storage">
                  <SelectValue placeholder="Select primary storage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local Storage</SelectItem>
                  {wasabiEnabled && <SelectItem value="wasabi">Wasabi</SelectItem>}
                  {s3Enabled && <SelectItem value="s3">AWS S3</SelectItem>}
                  {gcsEnabled && <SelectItem value="gcs">Google Cloud Storage</SelectItem>}
                  {vultrEnabled && <SelectItem value="vultr">Vultr Object Storage</SelectItem>}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-2">
                This provider will be used as the primary storage for all files
              </p>
            </div>

            <div>
              <Label htmlFor="cloud-storage-enabled">Enable Cloud Storage</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Switch
                  id="cloud-storage-enabled"
                  checked={cloudStorageEnabled}
                  onCheckedChange={setCloudStorageEnabled}
                />
                <Label htmlFor="cloud-storage-enabled">{cloudStorageEnabled ? "Enabled" : "Disabled"}</Label>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Enable cloud storage for better scalability and reliability
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="local">Local Storage</TabsTrigger>
          <TabsTrigger value="wasabi">Wasabi</TabsTrigger>
          <TabsTrigger value="s3">AWS S3</TabsTrigger>
          <TabsTrigger value="gcs">Google Cloud</TabsTrigger>
          <TabsTrigger value="vultr">Vultr</TabsTrigger>
          <TabsTrigger value="user-storage">User Storage</TabsTrigger>
        </TabsList>

        <TabsContent value="local" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Local Storage Settings</CardTitle>
                  <CardDescription>Configure your server's local storage</CardDescription>
                </div>
                <Badge variant={localStorageEnabled ? "default" : "outline"}>
                  {localStorageEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="local-storage-enabled"
                  checked={localStorageEnabled}
                  onCheckedChange={setLocalStorageEnabled}
                />
                <Label htmlFor="local-storage-enabled">Enable Local Storage</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="local-storage-path">Storage Path</Label>
                <Input
                  id="local-storage-path"
                  value={localStoragePath}
                  onChange={(e) => setLocalStoragePath(e.target.value)}
                  placeholder="/path/to/storage"
                  disabled={!localStorageEnabled}
                />
                <p className="text-sm text-muted-foreground">
                  The absolute path to the directory where files will be stored
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="local-storage-quota">Storage Quota (GB)</Label>
                  <span className="text-sm font-medium">{localStorageQuota} GB</span>
                </div>
                <Slider
                  id="local-storage-quota"
                  min={1}
                  max={100}
                  step={1}
                  value={[localStorageQuota]}
                  onValueChange={(value) => setLocalStorageQuota(value[0])}
                  disabled={!localStorageEnabled}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Storage Usage</Label>
                  <span className="text-sm font-medium">
                    {localStorageUsed} GB / {localStorageQuota} GB (
                    {Math.round((localStorageUsed / localStorageQuota) * 100)}%)
                  </span>
                </div>
                <Progress value={(localStorageUsed / localStorageQuota) * 100} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="local-storage-auto-cleanup"
                    checked={localStorageAutoCleanup}
                    onCheckedChange={setLocalStorageAutoCleanup}
                    disabled={!localStorageEnabled}
                  />
                  <Label htmlFor="local-storage-auto-cleanup">Enable Auto Cleanup</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatically clean up old files when storage usage exceeds the threshold
                </p>
              </div>

              {localStorageAutoCleanup && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="local-storage-cleanup-threshold">Cleanup Threshold (%)</Label>
                    <span className="text-sm font-medium">{localStorageCleanupThreshold}%</span>
                  </div>
                  <Slider
                    id="local-storage-cleanup-threshold"
                    min={50}
                    max={95}
                    step={5}
                    value={[localStorageCleanupThreshold]}
                    onValueChange={(value) => setLocalStorageCleanupThreshold(value[0])}
                    disabled={!localStorageEnabled || !localStorageAutoCleanup}
                  />
                  <p className="text-sm text-muted-foreground">
                    Cleanup will be triggered when storage usage exceeds this percentage
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleTestConnection("local storage")}>
                <HardDrive className="mr-2 h-4 w-4" />
                Test Path
              </Button>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="wasabi" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Wasabi Cloud Storage</CardTitle>
                  <CardDescription>Configure Wasabi cloud storage integration</CardDescription>
                </div>
                <Badge variant={wasabiEnabled ? "default" : "outline"}>{wasabiEnabled ? "Enabled" : "Disabled"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch id="wasabi-enabled" checked={wasabiEnabled} onCheckedChange={setWasabiEnabled} />
                <Label htmlFor="wasabi-enabled">Enable Wasabi Storage</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wasabi-access-key">Access Key</Label>
                <Input
                  id="wasabi-access-key"
                  value={wasabiAccessKey}
                  onChange={(e) => setWasabiAccessKey(e.target.value)}
                  placeholder="Your Wasabi access key"
                  disabled={!wasabiEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wasabi-secret-key">Secret Key</Label>
                <Input
                  id="wasabi-secret-key"
                  type="password"
                  value={wasabiSecretKey}
                  onChange={(e) => setWasabiSecretKey(e.target.value)}
                  placeholder="Your Wasabi secret key"
                  disabled={!wasabiEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wasabi-bucket">Bucket Name</Label>
                <Input
                  id="wasabi-bucket"
                  value={wasabiBucket}
                  onChange={(e) => setWasabiBucket(e.target.value)}
                  placeholder="your-bucket-name"
                  disabled={!wasabiEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wasabi-region">Region</Label>
                <Select value={wasabiRegion} onValueChange={setWasabiRegion} disabled={!wasabiEnabled}>
                  <SelectTrigger id="wasabi-region">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us-east-1">US East 1 (N. Virginia)</SelectItem>
                    <SelectItem value="us-east-2">US East 2 (N. Virginia)</SelectItem>
                    <SelectItem value="us-central-1">US Central 1 (Texas)</SelectItem>
                    <SelectItem value="us-west-1">US West 1 (Oregon)</SelectItem>
                    <SelectItem value="eu-central-1">EU Central 1 (Amsterdam)</SelectItem>
                    <SelectItem value="eu-west-1">EU West 1 (London)</SelectItem>
                    <SelectItem value="ap-northeast-1">AP Northeast 1 (Tokyo)</SelectItem>
                    <SelectItem value="ap-northeast-2">AP Northeast 2 (Osaka)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => handleTestConnection("Wasabi")}
                disabled={!wasabiEnabled || !wasabiAccessKey || !wasabiSecretKey || !wasabiBucket}
              >
                <Cloud className="mr-2 h-4 w-4" />
                Test Connection
              </Button>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="s3" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>AWS S3 Storage</CardTitle>
                  <CardDescription>Configure Amazon S3 cloud storage integration</CardDescription>
                </div>
                <Badge variant={s3Enabled ? "default" : "outline"}>{s3Enabled ? "Enabled" : "Disabled"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch id="s3-enabled" checked={s3Enabled} onCheckedChange={setS3Enabled} />
                <Label htmlFor="s3-enabled">Enable AWS S3 Storage</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="s3-access-key">Access Key</Label>
                <Input
                  id="s3-access-key"
                  value={s3AccessKey}
                  onChange={(e) => setS3AccessKey(e.target.value)}
                  placeholder="Your AWS access key"
                  disabled={!s3Enabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="s3-secret-key">Secret Key</Label>
                <Input
                  id="s3-secret-key"
                  type="password"
                  value={s3SecretKey}
                  onChange={(e) => setS3SecretKey(e.target.value)}
                  placeholder="Your AWS secret key"
                  disabled={!s3Enabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="s3-bucket">Bucket Name</Label>
                <Input
                  id="s3-bucket"
                  value={s3Bucket}
                  onChange={(e) => setS3Bucket(e.target.value)}
                  placeholder="your-bucket-name"
                  disabled={!s3Enabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="s3-region">Region</Label>
                <Select value={s3Region} onValueChange={setS3Region} disabled={!s3Enabled}>
                  <SelectTrigger id="s3-region">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                    <SelectItem value="us-east-2">US East (Ohio)</SelectItem>
                    <SelectItem value="us-west-1">US West (N. California)</SelectItem>
                    <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                    <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                    <SelectItem value="eu-central-1">EU (Frankfurt)</SelectItem>
                    <SelectItem value="ap-south-1">Asia Pacific (Mumbai)</SelectItem>
                    <SelectItem value="ap-northeast-1">Asia Pacific (Tokyo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => handleTestConnection("AWS S3")}
                disabled={!s3Enabled || !s3AccessKey || !s3SecretKey || !s3Bucket}
              >
                <Cloud className="mr-2 h-4 w-4" />
                Test Connection
              </Button>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="gcs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Google Cloud Storage</CardTitle>
                  <CardDescription>Configure Google Cloud Storage integration</CardDescription>
                </div>
                <Badge variant={gcsEnabled ? "default" : "outline"}>{gcsEnabled ? "Enabled" : "Disabled"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch id="gcs-enabled" checked={gcsEnabled} onCheckedChange={setGcsEnabled} />
                <Label htmlFor="gcs-enabled">Enable Google Cloud Storage</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gcs-project-id">Project ID</Label>
                <Input
                  id="gcs-project-id"
                  value={gcsProjectId}
                  onChange={(e) => setGcsProjectId(e.target.value)}
                  placeholder="Your GCP project ID"
                  disabled={!gcsEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gcs-bucket">Bucket Name</Label>
                <Input
                  id="gcs-bucket"
                  value={gcsBucket}
                  onChange={(e) => setGcsBucket(e.target.value)}
                  placeholder="your-bucket-name"
                  disabled={!gcsEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gcs-key-file">Service Account Key File</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="gcs-key-file"
                    value={gcsKeyFile}
                    onChange={(e) => setGcsKeyFile(e.target.value)}
                    placeholder="Path to service account key file"
                    disabled={!gcsEnabled}
                  />
                  <Button variant="outline" disabled={!gcsEnabled}>
                    Browse
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Path to the JSON key file for your service account</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => handleTestConnection("Google Cloud Storage")}
                disabled={!gcsEnabled || !gcsProjectId || !gcsBucket || !gcsKeyFile}
              >
                <Cloud className="mr-2 h-4 w-4" />
                Test Connection
              </Button>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="vultr" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Vultr Object Storage</CardTitle>
                  <CardDescription>Configure Vultr Object Storage integration</CardDescription>
                </div>
                <Badge variant={vultrEnabled ? "default" : "outline"}>{vultrEnabled ? "Enabled" : "Disabled"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch id="vultr-enabled" checked={vultrEnabled} onCheckedChange={setVultrEnabled} />
                <Label htmlFor="vultr-enabled">Enable Vultr Object Storage</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vultr-access-key">Access Key</Label>
                <Input
                  id="vultr-access-key"
                  value={vultrAccessKey}
                  onChange={(e) => setVultrAccessKey(e.target.value)}
                  placeholder="Your Vultr access key"
                  disabled={!vultrEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vultr-secret-key">Secret Key</Label>
                <Input
                  id="vultr-secret-key"
                  type="password"
                  value={vultrSecretKey}
                  onChange={(e) => setVultrSecretKey(e.target.value)}
                  placeholder="Your Vultr secret key"
                  disabled={!vultrEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vultr-bucket">Bucket Name</Label>
                <Input
                  id="vultr-bucket"
                  value={vultrBucket}
                  onChange={(e) => setVultrBucket(e.target.value)}
                  placeholder="your-bucket-name"
                  disabled={!vultrEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vultr-region">Region</Label>
                <Select value={vultrRegion} onValueChange={setVultrRegion} disabled={!vultrEnabled}>
                  <SelectTrigger id="vultr-region">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ewr">New Jersey (EWR)</SelectItem>
                    <SelectItem value="ord">Chicago (ORD)</SelectItem>
                    <SelectItem value="dfw">Dallas (DFW)</SelectItem>
                    <SelectItem value="sea">Seattle (SEA)</SelectItem>
                    <SelectItem value="lax">Los Angeles (LAX)</SelectItem>
                    <SelectItem value="atl">Atlanta (ATL)</SelectItem>
                    <SelectItem value="ams">Amsterdam (AMS)</SelectItem>
                    <SelectItem value="lhr">London (LHR)</SelectItem>
                    <SelectItem value="fra">Frankfurt (FRA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => handleTestConnection("Vultr Object Storage")}
                disabled={!vultrEnabled || !vultrAccessKey || !vultrSecretKey || !vultrBucket || !vultrRegion}
              >
                <Cloud className="mr-2 h-4 w-4" />
                Test Connection
              </Button>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="user-storage" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Local Storage</CardTitle>
                  <CardDescription>Allow users to use their own local storage</CardDescription>
                </div>
                <Badge variant={userLocalStorageEnabled ? "default" : "outline"}>
                  {userLocalStorageEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="user-local-storage-enabled"
                  checked={userLocalStorageEnabled}
                  onCheckedChange={setUserLocalStorageEnabled}
                />
                <Label htmlFor="user-local-storage-enabled">Enable User Local Storage</Label>
              </div>

              <Alert className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30">
                <Server className="h-4 w-4" />
                <AlertTitle>About User Local Storage</AlertTitle>
                <AlertDescription>
                  This feature allows users to store files on their own devices or servers instead of using your cloud
                  storage. Users will need to provide a valid storage path that is accessible via HTTP/HTTPS or a local
                  file system path.
                </Alert>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="user-local-storage-max-size">Maximum Storage Size per User (GB)</Label>
                  <span className="text-sm font-medium">{userLocalStorageMaxSize} GB</span>
                </div>
                <Slider
                  id="user-local-storage-max-size"
                  min={1}
                  max={50}
                  step={1}
                  value={[userLocalStorageMaxSize]}
                  onValueChange={(value) => setUserLocalStorageMaxSize(value[0])}
                  disabled={!userLocalStorageEnabled}
                />
                <p className="text-sm text-muted-foreground">
                  Maximum amount of storage space each user can use for their local storage
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-local-storage-allowed-types">Allowed File Types</Label>
                <Input
                  id="user-local-storage-allowed-types"
                  value={userLocalStorageAllowedTypes}
                  onChange={(e) => setUserLocalStorageAllowedTypes(e.target.value)}
                  placeholder="images,audio,video,documents"
                  disabled={!userLocalStorageEnabled}
                />
                <p className="text-sm text-muted-foreground">
                  Comma-separated list of allowed file types (e.g., images,audio,video,documents)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="user-local-storage-require-approval"
                  checked={userLocalStorageRequireApproval}
                  onCheckedChange={setUserLocalStorageRequireApproval}
                  disabled={!userLocalStorageEnabled}
                />
                <Label htmlFor="user-local-storage-require-approval">Require Admin Approval</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                If enabled, administrators must approve user storage locations before they can be used
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving} className="ml-auto">
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Storage Requests</CardTitle>
              <CardDescription>Manage user storage location requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Storage Path</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Requested</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 text-sm">john.doe@example.com</td>
                      <td className="px-4 py-3 text-sm">/home/john/piexed-storage</td>
                      <td className="px-4 py-3 text-sm">2023-06-15</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200"
                        >
                          Pending
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 px-2 text-xs text-destructive">
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm">jane.smith@example.com</td>
                      <td className="px-4 py-3 text-sm">https://storage.janesmith.com/piexed</td>
                      <td className="px-4 py-3 text-sm">2023-06-14</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                          Approved
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button variant="outline" size="sm" className="h-8 px-2 text-xs text-destructive">
                          Revoke
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm">bob.johnson@example.com</td>
                      <td className="px-4 py-3 text-sm">/var/www/storage</td>
                      <td className="px-4 py-3 text-sm">2023-06-10</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="destructive">Rejected</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                          Review
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

