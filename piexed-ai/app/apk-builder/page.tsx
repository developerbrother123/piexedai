"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Upload,
  Download,
  Code,
  Settings,
  Package,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileCode,
  Cpu,
  Sparkles,
  Zap,
  Braces,
  Github,
} from "lucide-react"

export default function ApkBuilderPage() {
  const [activeTab, setActiveTab] = useState("builder")
  const [isBuilding, setIsBuilding] = useState(false)
  const [buildProgress, setBuildProgress] = useState(0)
  const [buildStatus, setBuildStatus] = useState<"idle" | "building" | "success" | "error">("idle")
  const [projectName, setProjectName] = useState("")
  const [packageName, setPackageName] = useState("")
  const [versionCode, setVersionCode] = useState("1")
  const [versionName, setVersionName] = useState("1.0.0")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [selectedAndroidVersion, setSelectedAndroidVersion] = useState("33")
  const [enableAab, setEnableAab] = useState(false)
  const [enableSigning, setEnableSigning] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleBuild = () => {
    if (!projectName || !packageName) return

    setIsBuilding(true)
    setBuildStatus("building")
    setBuildProgress(0)

    // Simulate build process
    const interval = setInterval(() => {
      setBuildProgress((prev) => {
        const newProgress = prev + Math.random() * 5

        if (newProgress >= 100) {
          clearInterval(interval)
          setIsBuilding(false)
          setBuildStatus("success")
          return 100
        }

        return newProgress
      })
    }, 300)
  }

  const templates = [
    { id: "empty", name: "Empty Project", description: "Start with a blank Android project" },
    { id: "basic-app", name: "Basic App", description: "Simple app with navigation and basic UI" },
    { id: "ecommerce", name: "E-Commerce", description: "Full e-commerce app template with product listings and cart" },
    { id: "social", name: "Social Network", description: "Social media app template with feeds and profiles" },
    { id: "game", name: "Game Template", description: "Basic game structure with Unity integration" },
  ]

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Android APK Builder</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="builder">
            <Package className="mr-2 h-4 w-4" />
            Builder
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code className="mr-2 h-4 w-4" />
            Code
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="downloads">
            <Download className="mr-2 h-4 w-4" />
            Downloads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Configuration</CardTitle>
                  <CardDescription>Configure your Android app project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        placeholder="My Android App"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="package-name">Package Name</Label>
                      <Input
                        id="package-name"
                        placeholder="com.example.myapp"
                        value={packageName}
                        onChange={(e) => setPackageName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="version-code">Version Code</Label>
                      <Input
                        id="version-code"
                        placeholder="1"
                        value={versionCode}
                        onChange={(e) => setVersionCode(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="version-name">Version Name</Label>
                      <Input
                        id="version-name"
                        placeholder="1.0.0"
                        value={versionName}
                        onChange={(e) => setVersionName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="android-version">Target Android Version</Label>
                    <Select value={selectedAndroidVersion} onValueChange={setSelectedAndroidVersion}>
                      <SelectTrigger id="android-version">
                        <SelectValue placeholder="Select Android version" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="33">Android 13 (API 33)</SelectItem>
                        <SelectItem value="32">Android 12L (API 32)</SelectItem>
                        <SelectItem value="31">Android 12 (API 31)</SelectItem>
                        <SelectItem value="30">Android 11 (API 30)</SelectItem>
                        <SelectItem value="29">Android 10 (API 29)</SelectItem>
                        <SelectItem value="28">Android 9 (API 28)</SelectItem>
                        <SelectItem value="27">Android 8.1 (API 27)</SelectItem>
                        <SelectItem value="26">Android 8.0 (API 26)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Build Options</Label>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="enable-aab" checked={enableAab} onCheckedChange={setEnableAab} />
                        <Label htmlFor="enable-aab">Generate Android App Bundle (AAB)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="enable-signing" checked={enableSigning} onCheckedChange={setEnableSigning} />
                        <Label htmlFor="enable-signing">Sign APK/AAB</Label>
                      </div>
                    </div>
                  </div>

                  {enableSigning && (
                    <div className="space-y-4 p-4 border rounded-md bg-muted/30">
                      <h3 className="font-medium">Signing Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="keystore-path">Keystore Path</Label>
                          <div className="flex space-x-2">
                            <Input id="keystore-path" placeholder="/path/to/keystore.jks" />
                            <Button variant="outline" size="icon">
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="keystore-password">Keystore Password</Label>
                          <Input id="keystore-password" type="password" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="key-alias">Key Alias</Label>
                          <Input id="key-alias" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="key-password">Key Password</Label>
                          <Input id="key-password" type="password" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={handleBuild}
                    disabled={isBuilding || !projectName || !packageName}
                  >
                    {isBuilding ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Building...
                      </>
                    ) : (
                      <>
                        <Package className="mr-2 h-4 w-4" />
                        Build APK
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Templates</CardTitle>
                  <CardDescription>Start with a pre-configured template</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-4 border rounded-md cursor-pointer transition-colors ${
                          selectedTemplate === template.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{template.name}</h3>
                          {selectedTemplate === template.id && <CheckCircle2 className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <Button variant="outline">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Custom Template with AI
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Build Status</CardTitle>
                  <CardDescription>Current build progress and status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {buildStatus === "idle" ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Package className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="font-medium">No Build in Progress</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure your project and click Build APK to start
                      </p>
                    </div>
                  ) : buildStatus === "building" ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Building APK...</span>
                        <span className="text-sm">{Math.round(buildProgress)}%</span>
                      </div>
                      <Progress value={buildProgress} />

                      <div className="space-y-2 mt-4">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">Initializing project</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">Compiling resources</span>
                        </div>
                        <div className="flex items-center">
                          {buildProgress > 50 ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          )}
                          <span className="text-sm">Compiling Java/Kotlin</span>
                        </div>
                        <div className="flex items-center">
                          {buildProgress > 75 ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <div className="h-4 w-4 mr-2" />
                          )}
                          <span className="text-sm">Packaging APK</span>
                        </div>
                        <div className="flex items-center">
                          {buildProgress === 100 ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <div className="h-4 w-4 mr-2" />
                          )}
                          <span className="text-sm">Finalizing build</span>
                        </div>
                      </div>
                    </div>
                  ) : buildStatus === "success" ? (
                    <div className="space-y-4">
                      <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertTitle>Build Successful</AlertTitle>
                        <AlertDescription>
                          Your APK has been built successfully and is ready for download.
                        </AlertDescription>
                      </Alert>

                      <div className="flex flex-col space-y-2">
                        <Button>
                          <Download className="mr-2 h-4 w-4" />
                          Download APK
                        </Button>
                        {enableAab && (
                          <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download AAB
                          </Button>
                        )}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <p>
                          File: {projectName || "app"}-{versionName}.apk
                        </p>
                        <p>Size: 24.3 MB</p>
                        <p>Built on: {new Date().toLocaleString()}</p>
                      </div>
                    </div>
                  ) : (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Build Failed</AlertTitle>
                      <AlertDescription>
                        There was an error during the build process. Please check the logs for details.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                  <CardDescription>Helpful resources and tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Documentation</h3>
                    <ul className="text-sm space-y-1">
                      <li className="text-primary hover:underline cursor-pointer">Android Developer Guide</li>
                      <li className="text-primary hover:underline cursor-pointer">APK Signing Guide</li>
                      <li className="text-primary hover:underline cursor-pointer">App Bundle Documentation</li>
                    </ul>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Tools</h3>
                    <ul className="text-sm space-y-1">
                      <li className="text-primary hover:underline cursor-pointer">APK Analyzer</li>
                      <li className="text-primary hover:underline cursor-pointer">Icon Generator</li>
                      <li className="text-primary hover:underline cursor-pointer">Performance Profiler</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Editor</CardTitle>
              <CardDescription>Edit your project's source code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 border rounded-md bg-muted p-4 overflow-auto">
                <pre className="text-sm">
                  <code>
                    {`// MainActivity.java
package ${packageName || "com.example.myapp"};

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        // Initialize your app here
    }
}`}
                  </code>
                </pre>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                <Button variant="outline">
                  <FileCode className="mr-2 h-4 w-4" />
                  Open File
                </Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Structure</CardTitle>
                <CardDescription>Browse your project files</CardDescription>
              </CardHeader>
              <CardContent className="h-80 overflow-auto">
                <div className="space-y-1">
                  <div className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer">
                    <Folder className="h-4 w-4 mr-2 text-primary" />
                    <span>app</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    <div className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer">
                      <Folder className="h-4 w-4 mr-2 text-primary" />
                      <span>src</span>
                    </div>
                    <div className="pl-6 space-y-1">
                      <div className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer">
                        <Folder className="h-4 w-4 mr-2 text-primary" />
                        <span>main</span>
                      </div>
                      <div className="pl-6 space-y-1">
                        <div className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer">
                          <Folder className="h-4 w-4 mr-2 text-primary" />
                          <span>java</span>
                        </div>
                        <div className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer">
                          <Folder className="h-4 w-4 mr-2 text-primary" />
                          <span>res</span>
                        </div>
                        <div className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer">
                          <FileCode className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>AndroidManifest.xml</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer">
                    <FileCode className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>build.gradle</span>
                  </div>
                  <div className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer">
                    <FileCode className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>settings.gradle</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Code Assistant</CardTitle>
                <CardDescription>Get help with your code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea placeholder="Ask a question or describe what you want to do..." rows={4} />
                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Code
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Zap className="mr-2 h-4 w-4" />
                    Fix Issues
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Suggestions</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                      Add RecyclerView
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                      Implement login screen
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                      Setup Firebase
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                      Add permissions
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Build Settings</CardTitle>
              <CardDescription>Configure advanced build settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-sdk">Minimum SDK Version</Label>
                  <Select defaultValue="21">
                    <SelectTrigger id="min-sdk">
                      <SelectValue placeholder="Select minimum SDK" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="21">Android 5.0 (API 21)</SelectItem>
                      <SelectItem value="23">Android 6.0 (API 23)</SelectItem>
                      <SelectItem value="26">Android 8.0 (API 26)</SelectItem>
                      <SelectItem value="29">Android 10 (API 29)</SelectItem>
                      <SelectItem value="31">Android 12 (API 31)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="build-tools">Build Tools Version</Label>
                  <Select defaultValue="33.0.0">
                    <SelectTrigger id="build-tools">
                      <SelectValue placeholder="Select build tools" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="33.0.0">33.0.0</SelectItem>
                      <SelectItem value="32.0.0">32.0.0</SelectItem>
                      <SelectItem value="31.0.0">31.0.0</SelectItem>
                      <SelectItem value="30.0.3">30.0.3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="java-version">Java Version</Label>
                <Select defaultValue="11">
                  <SelectTrigger id="java-version">
                    <SelectValue placeholder="Select Java version" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">Java 8</SelectItem>
                    <SelectItem value="11">Java 11</SelectItem>
                    <SelectItem value="17">Java 17</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Build Features</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="view-binding" defaultChecked />
                    <Label htmlFor="view-binding">Enable View Binding</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="data-binding" />
                    <Label htmlFor="data-binding">Enable Data Binding</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="compose" defaultChecked />
                    <Label htmlFor="compose">Enable Jetpack Compose</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Optimization</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="r8" defaultChecked />
                    <Label htmlFor="r8">Enable R8 Optimization</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="minify" defaultChecked />
                    <Label htmlFor="minify">Minify Enabled</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="shrink-resources" defaultChecked />
                    <Label htmlFor="shrink-resources">Shrink Resources</Label>
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
              <CardTitle>Dependencies</CardTitle>
              <CardDescription>Manage project dependencies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Common Libraries</Label>
                  <Button variant="outline" size="sm">
                    Add Library
                  </Button>
                </div>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-2 text-left text-sm font-medium">Library</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Version</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="px-4 py-2 text-sm">androidx.core:core-ktx</td>
                        <td className="px-4 py-2 text-sm">1.9.0</td>
                        <td className="px-4 py-2 text-sm">
                          <Button variant="ghost" size="sm">
                            Remove
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">androidx.appcompat:appcompat</td>
                        <td className="px-4 py-2 text-sm">1.6.1</td>
                        <td className="px-4 py-2 text-sm">
                          <Button variant="ghost" size="sm">
                            Remove
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">com.google.android.material:material</td>
                        <td className="px-4 py-2 text-sm">1.8.0</td>
                        <td className="px-4 py-2 text-sm">
                          <Button variant="ghost" size="sm">
                            Remove
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">androidx.constraintlayout:constraintlayout</td>
                        <td className="px-4 py-2 text-sm">2.1.4</td>
                        <td className="px-4 py-2 text-sm">
                          <Button variant="ghost" size="sm">
                            Remove
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downloads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Build History</CardTitle>
              <CardDescription>Your recent builds and downloads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">Build</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Version</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Size</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 text-sm">MyApp-release</td>
                      <td className="px-4 py-3 text-sm">1.0.0 (1)</td>
                      <td className="px-4 py-3 text-sm">2023-06-15</td>
                      <td className="px-4 py-3 text-sm">24.3 MB</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                          Success
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm">MyApp-debug</td>
                      <td className="px-4 py-3 text-sm">0.9.0 (1)</td>
                      <td className="px-4 py-3 text-sm">2023-06-10</td>
                      <td className="px-4 py-3 text-sm">26.7 MB</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                          Success
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm">TestApp-release</td>
                      <td className="px-4 py-3 text-sm">1.2.0 (3)</td>
                      <td className="px-4 py-3 text-sm">2023-06-05</td>
                      <td className="px-4 py-3 text-sm">18.5 MB</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="destructive">Failed</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button variant="ghost" size="sm">
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Export your project for other platforms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex flex-col">
                  <Github className="h-8 w-8 mb-2" />
                  <span>Export to GitHub</span>
                </Button>

                <Button variant="outline" className="h-24 flex flex-col">
                  <Cpu className="h-8 w-8 mb-2" />
                  <span>Export for Android Studio</span>
                </Button>

                <Button variant="outline" className="h-24 flex flex-col">
                  <Braces className="h-8 w-8 mb-2" />
                  <span>Export as Source Code</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Folder(props) {
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
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  )
}

function Save(props) {
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
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  )
}

