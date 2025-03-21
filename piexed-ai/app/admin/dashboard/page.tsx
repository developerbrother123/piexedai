"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  CreditCard,
  HardDrive,
  Image,
  Loader2,
  MessageSquare,
  RefreshCw,
  Server,
  Settings,
  Users,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("24h")

  // Dashboard data
  const [dashboardData, setDashboardData] = useState({
    users: {
      total: 1250,
      active: 780,
      new: 42,
      premium: 320,
    },
    usage: {
      messages: 15780,
      tokens: 3250000,
      images: 1240,
    },
    models: {
      active: 5,
      total: 8,
      mostUsed: "mistral-7b",
      performance: {
        avgResponseTime: 1.8, // seconds
        avgTokensPerSecond: 32,
      },
    },
    system: {
      cpuUsage: 42,
      ramUsage: 68,
      diskUsage: 35,
      gpuUsage: 75,
    },
    revenue: {
      total: 12580,
      recurring: 9850,
      oneTime: 2730,
      currency: "USD",
    },
  })

  // Usage history
  const [usageHistory, setUsageHistory] = useState([
    { date: "2023-06-01", messages: 12500, tokens: 2800000, images: 980 },
    { date: "2023-06-02", messages: 13200, tokens: 2950000, images: 1050 },
    { date: "2023-06-03", messages: 14100, tokens: 3100000, images: 1120 },
    { date: "2023-06-04", messages: 13800, tokens: 3050000, images: 1080 },
    { date: "2023-06-05", messages: 14500, tokens: 3180000, images: 1150 },
    { date: "2023-06-06", messages: 15200, tokens: 3220000, images: 1190 },
    { date: "2023-06-07", messages: 15780, tokens: 3250000, images: 1240 },
  ])

  // Recent users
  const [recentUsers, setRecentUsers] = useState([
    {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@example.com",
      plan: "Pro",
      joinedAt: "2023-06-07",
      messagesCount: 120,
    },
    {
      id: "user-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      plan: "Basic",
      joinedAt: "2023-06-06",
      messagesCount: 45,
    },
    {
      id: "user-3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      plan: "Super Pi",
      joinedAt: "2023-06-05",
      messagesCount: 210,
    },
    {
      id: "user-4",
      name: "Alice Brown",
      email: "alice.brown@example.com",
      plan: "Free",
      joinedAt: "2023-06-04",
      messagesCount: 18,
    },
    {
      id: "user-5",
      name: "Charlie Wilson",
      email: "charlie.wilson@example.com",
      plan: "Pro",
      joinedAt: "2023-06-03",
      messagesCount: 87,
    },
  ])

  // Simulate loading data
  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate API call to refresh data
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  const formatNumber = (num) => {
    return num.toLocaleString()
  }

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData.users.total)}</div>
            <p className="text-xs text-muted-foreground">{formatNumber(dashboardData.users.active)} active users</p>
            <div className="mt-2 flex items-center text-xs text-green-500">
              <span>+{formatNumber(dashboardData.users.new)} new users today</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Processed</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData.usage.messages)}</div>
            <p className="text-xs text-muted-foreground">{formatNumber(dashboardData.usage.tokens)} tokens generated</p>
            <div className="mt-2 flex items-center text-xs text-blue-500">
              <span>{formatNumber(dashboardData.usage.images)} images generated</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.models.active}/{dashboardData.models.total}
            </div>
            <p className="text-xs text-muted-foreground">Most used: {dashboardData.models.mostUsed}</p>
            <div className="mt-2 flex items-center text-xs text-purple-500">
              <span>Avg. response time: {dashboardData.models.performance.avgResponseTime}s</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>

            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardData.revenue.total, dashboardData.revenue.currency)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(dashboardData.revenue.recurring, dashboardData.revenue.currency)} recurring
            </p>
            <div className="mt-2 flex items-center text-xs text-green-500">
              <span>{formatCurrency(dashboardData.revenue.oneTime, dashboardData.revenue.currency)} one-time</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Usage Overview</CardTitle>
                  <CardDescription>AI model usage statistics</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={timeRange === "24h" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange("24h")}
                  >
                    24h
                  </Button>
                  <Button
                    variant={timeRange === "7d" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange("7d")}
                  >
                    7d
                  </Button>
                  <Button
                    variant={timeRange === "30d" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange("30d")}
                  >
                    30d
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Messages</h4>
                    <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-end justify-between p-2">
                      {usageHistory.map((day, index) => (
                        <div
                          key={index}
                          className="w-8 bg-primary rounded-t-sm"
                          style={{
                            height: `${(day.messages / 20000) * 100}%`,
                            opacity: 0.5 + index * 0.07,
                          }}
                        >
                          <div className="text-xs text-center mt-2 transform -rotate-90 origin-left whitespace-nowrap">
                            {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Tokens</h4>
                    <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-end justify-between p-2">
                      {usageHistory.map((day, index) => (
                        <div
                          key={index}
                          className="w-8 bg-blue-500 rounded-t-sm"
                          style={{
                            height: `${(day.tokens / 4000000) * 100}%`,
                            opacity: 0.5 + index * 0.07,
                          }}
                        >
                          <div className="text-xs text-center mt-2 transform -rotate-90 origin-left whitespace-nowrap">
                            {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Images</h4>
                    <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-end justify-between p-2">
                      {usageHistory.map((day, index) => (
                        <div
                          key={index}
                          className="w-8 bg-purple-500 rounded-t-sm"
                          style={{
                            height: `${(day.images / 1500) * 100}%`,
                            opacity: 0.5 + index * 0.07,
                          }}
                        >
                          <div className="text-xs text-center mt-2 transform -rotate-90 origin-left whitespace-nowrap">
                            {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance</CardTitle>
                <CardDescription>Performance metrics for active models</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Brain className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-medium">Mistral AI 7B</span>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Response Time</span>
                          <span>1.8s</span>
                        </div>
                        <Progress value={60} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Tokens/Second</span>
                          <span>32</span>
                        </div>
                        <Progress value={80} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Brain className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-medium">Llama 3 8B</span>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Response Time</span>
                          <span>2.1s</span>
                        </div>
                        <Progress value={55} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Tokens/Second</span>
                          <span>28</span>
                        </div>
                        <Progress value={70} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Image className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-medium">Stable Diffusion XL</span>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Generation Time</span>
                          <span>5.2s</span>
                        </div>
                        <Progress value={65} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Memory Usage</span>
                          <span>5.5GB</span>
                        </div>
                        <Progress value={75} />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Recently active users on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-medium text-primary">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge variant={user.plan === "Free" ? "outline" : "default"} className="mr-2">
                            {user.plan}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{user.messagesCount} msgs</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/admin/users">View All Users</a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Statistics</CardTitle>
              <CardDescription>Detailed user metrics and demographics</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">User Growth</h4>
                      <div className="h-[200px] w-full bg-muted/20 rounded-md"></div>
                      <p className="text-xs text-muted-foreground text-center">+15% growth in the last 30 days</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Subscription Distribution</h4>
                      <div className="h-[200px] w-full bg-muted/20 rounded-md"></div>
                      <div className="flex justify-center space-x-4 text-xs">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                          <span>Free (74%)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                          <span>Basic (15%)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-purple-500 mr-1"></div>
                          <span>Pro (8%)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></div>
                          <span>Super Pi (3%)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">User Retention</h4>
                      <div className="h-[200px] w-full bg-muted/20 rounded-md"></div>
                      <p className="text-xs text-muted-foreground text-center">78% retention rate after 30 days</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Top Users by Usage</h4>
                    <div className="rounded-md border">
                      <table className="min-w-full divide-y divide-border">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Plan</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Messages</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Tokens</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Images</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Last Active</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr>
                            <td className="px-4 py-3 text-sm">
                              <div>
                                <div className="font-medium">Bob Johnson</div>
                                <div className="text-muted-foreground">bob.johnson@example.com</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <Badge>Super Pi</Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">1,245</td>
                            <td className="px-4 py-3 text-sm">320,500</td>
                            <td className="px-4 py-3 text-sm">87</td>
                            <td className="px-4 py-3 text-sm">2 hours ago</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm">
                              <div>
                                <div className="font-medium">Sarah Williams</div>
                                <div className="text-muted-foreground">sarah.williams@example.com</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <Badge>Pro</Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">980</td>
                            <td className="px-4 py-3 text-sm">245,200</td>
                            <td className="px-4 py-3 text-sm">62</td>
                            <td className="px-4 py-3 text-sm">5 hours ago</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm">
                              <div>
                                <div className="font-medium">Michael Davis</div>
                                <div className="text-muted-foreground">michael.davis@example.com</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <Badge>Pro</Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">875</td>
                            <td className="px-4 py-3 text-sm">218,750</td>
                            <td className="px-4 py-3 text-sm">45</td>
                            <td className="px-4 py-3 text-sm">1 day ago</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm">
                              <div>
                                <div className="font-medium">Emily Johnson</div>
                                <div className="text-muted-foreground">emily.johnson@example.com</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <Badge>Basic</Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">720</td>
                            <td className="px-4 py-3 text-sm">180,000</td>
                            <td className="px-4 py-3 text-sm">32</td>
                            <td className="px-4 py-3 text-sm">3 days ago</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm">
                              <div>
                                <div className="font-medium">David Wilson</div>
                                <div className="text-muted-foreground">david.wilson@example.com</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant="outline">Free</Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">650</td>
                            <td className="px-4 py-3 text-sm">162,500</td>
                            <td className="px-4 py-3 text-sm">18</td>
                            <td className="px-4 py-3 text-sm">1 week ago</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Resources</CardTitle>
              <CardDescription>Server and infrastructure metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center">
                            <Server className="h-4 w-4 mr-2" />
                            CPU Usage
                          </Label>
                          <span className="text-sm">{dashboardData.system.cpuUsage}%</span>
                        </div>
                        <Progress value={dashboardData.system.cpuUsage} />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center">
                            <HardDrive className="h-4 w-4 mr-2" />
                            RAM Usage
                          </Label>
                          <span className="text-sm">{dashboardData.system.ramUsage}%</span>
                        </div>
                        <Progress value={dashboardData.system.ramUsage} />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center">
                            <HardDrive className="h-4 w-4 mr-2" />
                            Disk Usage
                          </Label>
                          <span className="text-sm">{dashboardData.system.diskUsage}%</span>
                        </div>
                        <Progress value={dashboardData.system.diskUsage} />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            GPU Usage
                          </Label>
                          <span className="text-sm">{dashboardData.system.gpuUsage}%</span>
                        </div>
                        <Progress value={dashboardData.system.gpuUsage} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">System Information</h4>
                      <div className="rounded-md border p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">CPU</span>
                          <span className="text-sm">Intel Xeon 8-Core @ 3.2GHz</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">RAM</span>
                          <span className="text-sm">32GB DDR4</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">GPU</span>
                          <span className="text-sm">NVIDIA RTX 3080 (10GB)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Disk</span>
                          <span className="text-sm">1TB NVMe SSD</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">OS</span>
                          <span className="text-sm">Ubuntu 22.04 LTS</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Uptime</span>
                          <span className="text-sm">15 days, 7 hours</span>
                        </div>
                      </div>

                      <h4 className="text-sm font-medium">Network</h4>
                      <div className="rounded-md border p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Incoming</span>
                          <span className="text-sm">1.2 GB/hour</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Outgoing</span>
                          <span className="text-sm">3.5 GB/hour</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Active Connections</span>
                          <span className="text-sm">128</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Model Resource Usage</h4>
                    <div className="rounded-md border">
                      <table className="min-w-full divide-y divide-border">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="px-4 py-3 text-left text-sm font-medium">Model</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">CPU</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">RAM</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">GPU</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Disk</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr>
                            <td className="px-4 py-3 text-sm">Mistral AI 7B</td>
                            <td className="px-4 py-3 text-sm">15%</td>
                            <td className="px-4 py-3 text-sm">3.2 GB</td>
                            <td className="px-4 py-3 text-sm">2.8 GB</td>
                            <td className="px-4 py-3 text-sm">4.1 GB</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                                Running
                              </Badge>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm">Llama 3 8B</td>
                            <td className="px-4 py-3 text-sm">12%</td>
                            <td className="px-4 py-3 text-sm">4.1 GB</td>
                            <td className="px-4 py-3 text-sm">3.2 GB</td>
                            <td className="px-4 py-3 text-sm">5.2 GB</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                                Running
                              </Badge>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm">Stable Diffusion XL</td>
                            <td className="px-4 py-3 text-sm">8%</td>
                            <td className="px-4 py-3 text-sm">2.5 GB</td>
                            <td className="px-4 py-3 text-sm">5.5 GB</td>
                            <td className="px-4 py-3 text-sm">6.8 GB</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                                Running
                              </Badge>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm">Gemma 7B</td>
                            <td className="px-4 py-3 text-sm">0%</td>
                            <td className="px-4 py-3 text-sm">0 GB</td>
                            <td className="px-4 py-3 text-sm">0 GB</td>
                            <td className="px-4 py-3 text-sm">4.8 GB</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant="outline">Inactive</Badge>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm">Stable Diffusion 3</td>
                            <td className="px-4 py-3 text-sm">0%</td>
                            <td className="px-4 py-3 text-sm">0 GB</td>
                            <td className="px-4 py-3 text-sm">0 GB</td>
                            <td className="px-4 py-3 text-sm">7.2 GB</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant="outline">Inactive</Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Label({ children, className, ...props }) {
  return (
    <div className={`text-sm font-medium ${className}`} {...props}>
      {children}
    </div>
  )
}

