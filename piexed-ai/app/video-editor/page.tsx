"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Video,
  Upload,
  Scissors,
  Type,
  Image,
  Music,
  Loader2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Download,
  Save,
  Sparkles,
  Wand2,
  Mic,
  Layers,
} from "lucide-react"

export default function VideoEditorPage() {
  const [activeTab, setActiveTab] = useState("edit")
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [progress, setProgress] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle video upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setVideoSrc(url)
  }

  // Handle video playback
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [isPlaying])

  // Update current time and duration
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => {
      setCurrentTime(video.currentTime)
      setDuration(video.duration)
    }

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateTime)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateTime)
    }
  }, [videoSrc])

  // Handle volume changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const handleProcessVideo = () => {
    if (!videoSrc || !prompt.trim()) return

    setIsProcessing(true)
    setProgress(0)

    // Simulate processing with progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 5
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          return 100
        }
        return newProgress
      })
    }, 200)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">AI Video Editor</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              {videoSrc ? (
                <div className="space-y-4">
                  <div className="relative aspect-video bg-black rounded-md overflow-hidden">
                    <video
                      ref={videoRef}
                      src={videoSrc}
                      className="w-full h-full"
                      onEnded={() => setIsPlaying(false)}
                    />

                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <div className="text-white font-medium">Processing Video...</div>
                        <div className="w-64 mt-4">
                          <Progress value={progress} className="h-2" />
                        </div>
                        <div className="text-white/70 text-sm mt-2">{Math.round(progress)}% Complete</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <Slider
                      value={[currentTime]}
                      max={duration || 100}
                      step={0.1}
                      onValueChange={handleSeek}
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.currentTime = 0
                            setCurrentTime(0)
                          }
                        }}
                        disabled={isProcessing}
                      >
                        <SkipBack className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsPlaying(!isPlaying)}
                        disabled={isProcessing}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.currentTime = Math.min(
                              videoRef.current.duration,
                              videoRef.current.currentTime + 10,
                            )
                          }
                        }}
                        disabled={isProcessing}
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} disabled={isProcessing}>
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>

                      <Slider
                        value={[volume]}
                        max={1}
                        step={0.01}
                        onValueChange={(value) => setVolume(value[0])}
                        className="w-24"
                        disabled={isProcessing || isMuted}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6">
                  <Video className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Video Selected</h3>
                  <p className="text-sm text-muted-foreground mb-4">Upload a video to start editing</p>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="video/*"
                    className="hidden"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Edit with AI</CardTitle>
                  <CardDescription>Describe the changes you want to make to your video</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="E.g., 'Remove background noise', 'Add a blur effect to the background', 'Increase brightness'"
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isProcessing || !videoSrc}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Common Edits</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPrompt("Remove background noise")}
                          disabled={isProcessing || !videoSrc}
                        >
                          Remove noise
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPrompt("Enhance video quality")}
                          disabled={isProcessing || !videoSrc}
                        >
                          Enhance quality
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPrompt("Add subtitles")}
                          disabled={isProcessing || !videoSrc}
                        >
                          Add subtitles
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPrompt("Crop to 16:9 aspect ratio")}
                          disabled={isProcessing || !videoSrc}
                        >
                          Crop video
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Effects</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPrompt("Add a cinematic color grade")}
                          disabled={isProcessing || !videoSrc}
                        >
                          Cinematic
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPrompt("Add a vintage film effect")}
                          disabled={isProcessing || !videoSrc}
                        >
                          Vintage
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPrompt("Add slow motion effect")}
                          disabled={isProcessing || !videoSrc}
                        >
                          Slow motion
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPrompt("Add a blur effect to the background")}
                          disabled={isProcessing || !videoSrc}
                        >
                          Blur background
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={handleProcessVideo}
                    disabled={isProcessing || !videoSrc || !prompt.trim()}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Apply Edits
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Manual Editing Tools</CardTitle>
                  <CardDescription>Fine-tune your video with precise controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Trim Video</Label>
                    <div className="flex items-center space-x-4">
                      <Input type="text" placeholder="00:00" className="w-24" disabled={isProcessing || !videoSrc} />
                      <span>to</span>
                      <Input type="text" placeholder="00:00" className="w-24" disabled={isProcessing || !videoSrc} />
                      <Button variant="outline" disabled={isProcessing || !videoSrc}>
                        <Scissors className="mr-2 h-4 w-4" />
                        Trim
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Brightness</Label>
                          <span className="text-sm">0</span>
                        </div>
                        <Slider defaultValue={[0]} min={-100} max={100} step={1} disabled={isProcessing || !videoSrc} />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Contrast</Label>
                          <span className="text-sm">0</span>
                        </div>
                        <Slider defaultValue={[0]} min={-100} max={100} step={1} disabled={isProcessing || !videoSrc} />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Saturation</Label>
                          <span className="text-sm">0</span>
                        </div>
                        <Slider defaultValue={[0]} min={-100} max={100} step={1} disabled={isProcessing || !videoSrc} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Speed</Label>
                        <Select defaultValue="1" disabled={isProcessing || !videoSrc}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select speed" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0.25">0.25x</SelectItem>
                            <SelectItem value="0.5">0.5x</SelectItem>
                            <SelectItem value="0.75">0.75x</SelectItem>
                            <SelectItem value="1">1x (Normal)</SelectItem>
                            <SelectItem value="1.25">1.25x</SelectItem>
                            <SelectItem value="1.5">1.5x</SelectItem>
                            <SelectItem value="2">2x</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Rotation</Label>
                        <Select defaultValue="0" disabled={isProcessing || !videoSrc}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rotation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0° (No rotation)</SelectItem>
                            <SelectItem value="90">90° Clockwise</SelectItem>
                            <SelectItem value="180">180°</SelectItem>
                            <SelectItem value="270">90° Counter-clockwise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="mute-video" disabled={isProcessing || !videoSrc} />
                          <Label htmlFor="mute-video">Mute video</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" disabled={isProcessing || !videoSrc}>
                    <Save className="mr-2 h-4 w-4" />
                    Apply Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="generate" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Video with AI</CardTitle>
                  <CardDescription>Create a new video from a text description</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea placeholder="Describe the video you want to create in detail..." rows={6} />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Video Length</Label>
                      <Select defaultValue="15">
                        <SelectTrigger>
                          <SelectValue placeholder="Select length" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 seconds</SelectItem>
                          <SelectItem value="15">15 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">1 minute</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Style</Label>
                      <Select defaultValue="realistic">
                        <SelectTrigger>
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realistic">Realistic</SelectItem>
                          <SelectItem value="3d">3D Animation</SelectItem>
                          <SelectItem value="cartoon">Cartoon</SelectItem>
                          <SelectItem value="anime">Anime</SelectItem>
                          <SelectItem value="cinematic">Cinematic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Aspect Ratio</Label>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1">
                        16:9
                      </Button>
                      <Button variant="outline" className="flex-1">
                        9:16
                      </Button>
                      <Button variant="outline" className="flex-1">
                        1:1
                      </Button>
                      <Button variant="outline" className="flex-1">
                        4:3
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Quality</Label>
                      <Badge>Premium Feature</Badge>
                    </div>
                    <Select defaultValue="standard" disabled>
                      <SelectTrigger>
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (720p)</SelectItem>
                        <SelectItem value="high">High (1080p)</SelectItem>
                        <SelectItem value="ultra">Ultra (4K)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Video
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add Elements</CardTitle>
                  <CardDescription>Enhance your video with additional elements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col" disabled={isProcessing || !videoSrc}>
                      <Type className="h-6 w-6 mb-2" />
                      <span>Add Text</span>
                    </Button>

                    <Button variant="outline" className="h-20 flex flex-col" disabled={isProcessing || !videoSrc}>
                      <Image className="h-6 w-6 mb-2" />
                      <span>Add Image</span>
                    </Button>

                    <Button variant="outline" className="h-20 flex flex-col" disabled={isProcessing || !videoSrc}>
                      <Music className="h-6 w-6 mb-2" />
                      <span>Add Audio</span>
                    </Button>

                    <Button variant="outline" className="h-20 flex flex-col" disabled={isProcessing || !videoSrc}>
                      <Layers className="h-6 w-6 mb-2" />
                      <span>Add Overlay</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Export Options</CardTitle>
                  <CardDescription>Configure and download your edited video</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Format</Label>
                      <Select defaultValue="mp4" disabled={isProcessing || !videoSrc}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mp4">MP4</SelectItem>
                          <SelectItem value="webm">WebM</SelectItem>
                          <SelectItem value="mov">MOV</SelectItem>
                          <SelectItem value="gif">GIF</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Quality</Label>
                      <Select defaultValue="high" disabled={isProcessing || !videoSrc}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (480p)</SelectItem>
                          <SelectItem value="medium">Medium (720p)</SelectItem>
                          <SelectItem value="high">High (1080p)</SelectItem>
                          <SelectItem value="ultra">Ultra (4K)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Filename</Label>
                    <Input
                      placeholder="Enter filename"
                      defaultValue="edited_video"
                      disabled={isProcessing || !videoSrc}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="optimize-web" defaultChecked disabled={isProcessing || !videoSrc} />
                      <Label htmlFor="optimize-web">Optimize for web</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="include-audio" defaultChecked disabled={isProcessing || !videoSrc} />
                      <Label htmlFor="include-audio">Include audio</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button className="w-full" disabled={isProcessing || !videoSrc}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Video
                  </Button>

                  <Button variant="outline" className="w-full" disabled={isProcessing || !videoSrc}>
                    <Save className="mr-2 h-4 w-4" />
                    Save to Project
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Share</CardTitle>
                  <CardDescription>Share your video directly to platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-12" disabled={isProcessing || !videoSrc}>
                      YouTube
                    </Button>
                    <Button variant="outline" className="h-12" disabled={isProcessing || !videoSrc}>
                      TikTok
                    </Button>
                    <Button variant="outline" className="h-12" disabled={isProcessing || !videoSrc}>
                      Instagram
                    </Button>
                    <Button variant="outline" className="h-12" disabled={isProcessing || !videoSrc}>
                      Twitter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project</CardTitle>
              <CardDescription>Your current video project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input placeholder="Untitled Project" />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Add a description..." rows={3} />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <Input placeholder="Add tags separated by commas" />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Modified:</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Project
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Voice Commands</CardTitle>
              <CardDescription>Control the editor with your voice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full h-12" variant={isProcessing ? "outline" : "default"} disabled={isProcessing}>
                <Mic className="mr-2 h-4 w-4" />
                Start Voice Commands
              </Button>

              <div className="space-y-2">
                <Label>Example Commands</Label>
                <ul className="text-sm space-y-1">
                  <li>"Trim the video from 0:10 to 0:30"</li>
                  <li>"Add a fade-in effect at the beginning"</li>
                  <li>"Increase brightness by 20%"</li>
                  <li>"Add subtitles to the video"</li>
                  <li>"Apply cinematic color grading"</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
              <CardDescription>Recent changes to your video</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Wand2 className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Applied AI enhancement</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Undo
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Scissors className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Trimmed video</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Undo
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Type className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Added text overlay</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Undo
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Music className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Added background music</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Undo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

