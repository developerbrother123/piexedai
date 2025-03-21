import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Brain,
  MessageSquare,
  Code,
  ImageIcon,
  Music,
  Video,
  Zap,
  Database,
  Cloud,
  HardDrive,
  CreditCard,
  Lock,
  BarChart,
  Settings,
  Sparkles,
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-indigo-900 to-purple-900 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">Welcome to Piexed AI</h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">The Self-Evolving Generative AI Platform</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-100">
                  Get Started
                </Button>
              </Link>
              <Link href="/api-docs">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  API Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>
      </section>

      {/* AI Models Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Advanced AI Models</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Piexed AI offers a range of powerful models to suit your needs, from basic text generation to advanced
              emotional intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-4 mx-auto">
                  <Brain className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Pi-o</h3>
                <p className="text-gray-600 text-center">
                  The foundational model, optimized for general-purpose tasks.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 mb-4 mx-auto">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Pi-Transformer</h3>
                <p className="text-gray-600 text-center">
                  An advanced model leveraging transformer architecture for complex tasks.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4 mx-auto">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Pi-Alpha</h3>
                <p className="text-gray-600 text-center">
                  A cutting-edge model with enhanced emotional intelligence and self-learning capabilities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore the wide range of capabilities that make Piexed AI the ultimate generative AI platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 border border-gray-200 rounded-lg hover:border-indigo-500 transition-colors">
              <MessageSquare className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Advanced Chat</h3>
              <p className="text-gray-600">Engage in natural conversations with context-aware responses.</p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg hover:border-indigo-500 transition-colors">
              <Code className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Code Generation</h3>
              <p className="text-gray-600">Generate code in multiple programming languages with explanations.</p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg hover:border-indigo-500 transition-colors">
              <ImageIcon className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Image Generation</h3>
              <p className="text-gray-600">Create stunning images from text descriptions.</p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg hover:border-indigo-500 transition-colors">
              <Music className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Music Generation</h3>
              <p className="text-gray-600">Compose original music in various styles and genres.</p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg hover:border-indigo-500 transition-colors">
              <Video className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Video Creation</h3>
              <p className="text-gray-600">Generate short videos from text prompts.</p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg hover:border-indigo-500 transition-colors">
              <Database className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">API Access</h3>
              <p className="text-gray-600">Integrate AI capabilities into your applications with our API.</p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg hover:border-indigo-500 transition-colors">
              <BarChart className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Usage Analytics</h3>
              <p className="text-gray-600">Track and analyze your AI usage with detailed metrics.</p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg hover:border-indigo-500 transition-colors">
              <Settings className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Customization</h3>
              <p className="text-gray-600">Tailor the AI to your specific needs and preferences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Storage Options Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Flexible Storage Solutions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the storage option that works best for your needs, from local to cloud-based solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                <h3 className="text-xl font-bold text-white">Cloud Storage</h3>
              </div>
              <CardContent className="pt-6">
                <div className="flex justify-center mb-6">
                  <Cloud className="h-16 w-16 text-indigo-500" />
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                    <span>AWS S3 Integration</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                    <span>Google Cloud Storage</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                    <span>Wasabi Cloud Storage</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                    <span>Vultr Object Storage</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4">
                <h3 className="text-xl font-bold text-white">Local Storage</h3>
              </div>
              <CardContent className="pt-6">
                <div className="flex justify-center mb-6">
                  <HardDrive className="h-16 w-16 text-purple-500" />
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                    <span>Server-side storage</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                    <span>User-managed storage locations</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                    <span>Configurable storage quotas</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                    <span>Optimized for shared hosting</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Subscription Plans</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the plan that suits your needs, from basic to premium features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md relative">
              <div className="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 text-sm font-semibold rounded-bl-lg">
                Basic
              </div>
              <CardContent className="pt-10">
                <div className="text-center mb-6">
                  <p className="text-4xl font-bold">
                    $9.99<span className="text-sm text-gray-500">/month</span>
                  </p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Access to Pi-o model</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>100 messages per day</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Basic text generation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>API access</span>
                  </li>
                </ul>
                <div className="text-center">
                  <Button className="w-full">Subscribe</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md relative border-2 border-indigo-500">
              <div className="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 text-sm font-semibold rounded-bl-lg">
                Pro
              </div>
              <CardContent className="pt-10">
                <div className="text-center mb-6">
                  <p className="text-4xl font-bold">
                    $19.99<span className="text-sm text-gray-500">/month</span>
                  </p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Access to Pi-o and Pi-Transformer</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>500 messages per day</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Advanced text and code generation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Image generation capabilities</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Priority API access</span>
                  </li>
                </ul>
                <div className="text-center">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Subscribe</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md relative">
              <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-sm font-semibold rounded-bl-lg">
                Super Pi
              </div>
              <CardContent className="pt-10">
                <div className="text-center mb-6">
                  <p className="text-4xl font-bold">
                    $49.99<span className="text-sm text-gray-500">/month</span>
                  </p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Access to all models including Pi-Alpha</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>2000 messages per day</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>All generation capabilities</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Music and video generation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Unlimited API access</span>
                  </li>
                </ul>
                <div className="text-center">
                  <Button className="w-full">Subscribe</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Payment Options Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Flexible Payment Options</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from multiple payment methods, including traditional and cryptocurrency options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex justify-center mb-6">
                <CreditCard className="h-16 w-16 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Traditional Payments</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-indigo-500 mr-2"></div>
                  <span>Credit/Debit Cards</span>
                </li>
                <li className="flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-indigo-500 mr-2"></div>
                  <span>PayPal</span>
                </li>
                <li className="flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-indigo-500 mr-2"></div>
                  <span>Bank Transfers</span>
                </li>
                <li className="flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-indigo-500 mr-2"></div>
                  <span>PerfectMoney</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex justify-center mb-6">
                <Lock className="h-16 w-16 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Cryptocurrency</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-purple-500 mr-2"></div>
                  <span>Bitcoin (BTC)</span>
                </li>
                <li className="flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-purple-500 mr-2"></div>
                  <span>Ethereum (ETH)</span>
                </li>
                <li className="flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-purple-500 mr-2"></div>
                  <span>USDT</span>
                </li>
                <li className="flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-purple-500 mr-2"></div>
                  <span>USDC</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience the Future of AI?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already leveraging the power of Piexed AI for their projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-100">
                Get Started Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Piexed AI</h3>
              <p className="mb-4">The Self-Evolving Generative AI Platform designed for developers and businesses.</p>
            </div>

            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/chat" className="hover:text-white">
                    AI Chat
                  </Link>
                </li>
                <li>
                  <Link href="/image" className="hover:text-white">
                    Image Generation
                  </Link>
                </li>
                <li>
                  <Link href="/music" className="hover:text-white">
                    Music Generation
                  </Link>
                </li>
                <li>
                  <Link href="/video" className="hover:text-white">
                    Video Generation
                  </Link>
                </li>
                <li>
                  <Link href="/software" className="hover:text-white">
                    Software Development
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/api-docs" className="hover:text-white">
                    API Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/docs.html" className="hover:text-white">
                    User Guide
                  </Link>
                </li>
                <li>
                  <Link href="/docs-installation.html" className="hover:text-white">
                    Installation Guide
                  </Link>
                </li>
                <li>
                  <Link href="/docs-custom-models.html" className="hover:text-white">
                    Custom Models
                  </Link>
                </li>
                <li>
                  <Link href="/docs-crypto-payments.html" className="hover:text-white">
                    Crypto Payments
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@piexed.ai" className="hover:text-white">
                    support@piexed.ai
                  </a>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/subscription" className="hover:text-white">
                    Subscription Plans
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Piexed AI. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

