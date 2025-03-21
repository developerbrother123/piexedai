"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertCircle,
  Check,
  Cloud,
  File,
  FileText,
  HardDrive,
  Image,
  Loader2,
  Music,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  Video,
} from "lucide-react"

export default function UserStoragePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // Storage stats
  const [storageUsed, setStorageUsed] = useState(1.2) // GB
  const [storageLimit, setStorageLimit] = useState(5) // GB
  const [fileCount, setFileCount] = useState(42)

  // Local storage settings
  const [localStoragePath, setLocalStoragePath] = useState("")
  const [localStorageStatus, setLocalStorageStatus] = useState("not_configured") // not_configured, pending, approved, rejected

  // File categories
  const [fileCategories, setFileCategories] = useState([
    { type: "images", count: 15, size: 0.5, icon: <Image className="h-4 w-4" /> },
    { type: "documents", count: 10, size: 0.2, icon: <FileText className="h-4 w-4" /> },
    { type: "audio", count: 8, size: 0.3, icon: <Music className="h-4 w-4" /> },
    { type: "video", count: 5, size: 0.2, icon: <Video className="h-4 w-4" /> },
    { type: "other", count: 4, size: 0.1, icon: <File className="h-4 w-4" /> },
  ])

  // Recent files
  const [recentFiles, setRecentFiles] = useState([
    {
      name: "project-image.png",
      type: "image",
      size: "2.4 MB",
      uploaded: "2023-06-15",
      path: "/images/project-image.png",
    },
    {
      name: "presentation.pdf",
      type: "document",
      size: "4.2 MB",
      uploaded: "2023-06-14",
      path: "/documents/presentation.pdf",
    },
    {
      name: "audio-sample.mp3",
      type: "audio",
      size: "3.8 MB",
      uploaded: "2023-06-12",
      path: "/audio/audio-sample.mp3",
    },
    { name: "demo-video.mp4", type: "video", size: "18.2 MB", uploaded: "2023-06-10", path: "/video/demo-video.mp4" },
    { name: "data.json", type: "other", size: "1.1 MB", uploaded: "2023-06-08", path: "/other/data.json" },
  ])

  // Simulate loading data
  useEffect(() => {
    // In a real implementation, this would fetch settings from the API
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSaveLocalStorage = () => {
    setIsSaving(true)
    setSuccess("")
    setError("")

    // Simulate API call to save settings
    setTimeout(() => {
      setIsSaving(false)
      setLocalStorageStatus("pending")
      setSuccess("Local storage path submitted for approval")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    }, 1500)
  }

  const handleUploadFile = (e) => {
    e.preventDefault()
    setIsUploading(true)
    setSuccess("")
    setError("")

    // Simulate file upload
    setTimeout(() => {
      setIsUploading(false)
      setSuccess("File uploaded successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    }, 2000)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "not_configured":
        return <Badge variant="outline">Not Configured</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
            Pending Approval
          </Badge>
        )
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getFileTypeIcon = (type) => {
    switch (type) {
      case "image":
        return <Image className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      case "audio":
        return <Music className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Storage</h1>
        <Button onClick={() => document.getElementById("file-upload").click()}>
          <Upload className="mr-2 h-4 w-4" />
          Upload File
          <input id="file-upload" type="file" className="hidden" onChange={handleUploadFile} />
        </Button>
      </div>

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30 mb-6">
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="files">My Files</TabsTrigger>
          <TabsTrigger value="local-storage">Local Storage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Storage Usage</CardTitle>
                <CardDescription>
                  {storageUsed.toFixed(1)} GB of {storageLimit} GB used
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={(storageUsed / storageLimit) * 100} />
                  <p className="text-sm text-muted-foreground text-right">
                    {Math.round((storageUsed / storageLimit) * 100)}% used
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>File Count</CardTitle>
                <CardDescription>Total files in your storage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-20">
                  <span className="text-4xl font-bold">{fileCount}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Storage Status</CardTitle>
                <CardDescription>Your storage configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-20 space-y-2">
                  {localStorageStatus === "not_configured" ? (
                    <div className="flex items-center">
                      <Cloud className="h-5 w-5 mr-2 text-primary" />
                      <span>Using Cloud Storage</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <HardDrive className="h-5 w-5 mr-2 text-primary" />
                        <span>Local Storage</span>
                      </div>
                      {getStatusBadge(localStorageStatus)}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Storage Breakdown</CardTitle>
              <CardDescription>Storage usage by file type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fileCategories.map((category) => (
                  <div key={category.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {category.icon}
                        <span className="ml-2 capitalize">{category.type}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {category.size.toFixed(1)} GB ({category.count} files)
                      </span>
                    </div>
                    <Progress value={(category.size / storageUsed) * 100} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Files</CardTitle>
              <CardDescription>Recently uploaded files</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Size</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Uploaded</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentFiles.map((file, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm">{file.name}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            {getFileTypeIcon(file.type)}
                            <span className="ml-2 capitalize">{file.type}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{file.size}</td>
                        <td className="px-4 py-3 text-sm">{file.uploaded}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 px-2 text-xs text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto">
                View All Files
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Files</CardTitle>
                  <CardDescription>Manage your stored files</CardDescription>
                </div>
                <Button onClick={() => document.getElementById("file-upload-all").click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                  <input id="file-upload-all" type="file" className="hidden" onChange={handleUploadFile} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p>Uploading file...</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Size</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Uploaded</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[...recentFiles, ...recentFiles].map((file, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm">{file.name}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center">
                              {getFileTypeIcon(file.type)}
                              <span className="ml-2 capitalize">{file.type}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{file.size}</td>
                          <td className="px-4 py-3 text-sm">{file.uploaded}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                                View
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 px-2 text-xs text-destructive">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="local-storage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Local Storage Configuration</CardTitle>
              <CardDescription>Configure your own storage location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>About Local Storage</AlertTitle>
                <AlertDescription>
                  You can use your own storage location instead of the cloud storage provided by the platform. This can
                  be a local file system path or a URL accessible via HTTP/HTTPS. Your storage location must be approved
                  by an administrator before it can be used.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="local-storage-path">Storage Path</Label>
                <Input
                  id="local-storage-path"
                  value={localStoragePath}
                  onChange={(e) => setLocalStoragePath(e.target.value)}
                  placeholder="/path/to/storage or https://your-storage-url.com"
                  disabled={localStorageStatus === "pending" || localStorageStatus === "approved"}
                />
                <p className="text-sm text-muted-foreground">
                  Enter the path to your storage location. This can be a local file system path or a URL.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Current Status</Label>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(localStorageStatus)}
                  {localStorageStatus === "pending" && (
                    <span className="text-sm text-muted-foreground">
                      Your request is being reviewed by an administrator
                    </span>
                  )}
                  {localStorageStatus === "rejected" && (
                    <span className="text-sm text-destructive">
                      Your request was rejected. Please try a different path.
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {localStorageStatus === "approved" ? (
                <Button variant="destructive" className="ml-auto">
                  Disable Local Storage
                </Button>
              ) : localStorageStatus === "pending" ? (
                <Button variant="outline" className="ml-auto">
                  Cancel Request
                </Button>
              ) : (
                <Button onClick={handleSaveLocalStorage} disabled={isSaving || !localStoragePath} className="ml-auto">
                  {isSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Submit for Approval
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>

          {localStorageStatus === "approved" && (
            <Card>
              <CardHeader>
                <CardTitle>Local Storage Statistics</CardTitle>
                <CardDescription>Usage statistics for your local storage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Storage Usage</Label>
                    <span className="text-sm font-medium">
                      {storageUsed.toFixed(1)} GB / {storageLimit} GB ({Math.round((storageUsed / storageLimit) * 100)}
                      %)
                    </span>
                  </div>
                  <Progress value={(storageUsed / storageLimit) * 100} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Total Files</Label>
                    <div className="flex items-center">
                      <File className="h-4 w-4 mr-2 text-primary" />
                      <span>{fileCount} files</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Storage Path</Label>
                    <div className="flex items-center">
                      <HardDrive className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm truncate">{localStoragePath || "/path/to/storage"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Storage Breakdown</Label>
                  <div className="space-y-4">
                    {fileCategories.map((category) => (
                      <div key={category.type} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            {category.icon}
                            <span className="ml-2 capitalize">{category.type}</span>
                          </div>
                          <span>
                            {category.size.toFixed(1)} GB ({category.count} files)
                          </span>
                        </div>
                        <Progress value={(category.size / storageUsed) * 100} className="h-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

