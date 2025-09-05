"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Brain, Sparkles, Library, BarChart3, ArrowRight, Star, GitBranch, FlaskConical } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const features = [
    {
      icon: Brain,
      title: "Intelligent Prompt Builder",
      description:
        "Create sophisticated prompts with parameters, constraints, and dynamic variables using our intuitive interface.",
      color: "text-blue-500",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Refinement",
      description:
        "Leverage GPT-4 to analyze and improve your prompts with specific suggestions for clarity and effectiveness.",
      color: "text-purple-500",
    },
    {
      icon: Library,
      title: "Curated Prompt Library",
      description:
        "Access hundreds of high-quality, community-vetted prompts categorized by use case and LLM compatibility.",
      color: "text-green-500",
    },
    {
      icon: FlaskConical,
      title: "A/B Testing Suite",
      description: "Compare prompt variations with statistical analysis to identify the most effective versions.",
      color: "text-orange-500",
    },
    {
      icon: GitBranch,
      title: "Version Control",
      description:
        "Track changes, collaborate with teams, and revert to previous versions with Git-like version management.",
      color: "text-indigo-500",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Comprehensive performance metrics, insights, and visualizations to optimize your prompt engineering workflow.",
      color: "text-red-500",
    },
  ]

  const useCases = [
    {
      title: "Content Creation",
      description: "Generate blog posts, marketing copy, and creative content with optimized prompts.",
      icon: "✍️",
    },
    {
      title: "Code Generation",
      description: "Build better coding assistants with refined prompts for different programming languages.",
      icon: "💻",
    },
    {
      title: "Data Analysis",
      description: "Extract insights from datasets with specialized analytical prompts.",
      icon: "📊",
    },
    {
      title: "Customer Support",
      description: "Create intelligent chatbots and support systems with tested prompt templates.",
      icon: "🎧",
    },
    {
      title: "Education",
      description: "Develop tutoring systems and educational content with pedagogically sound prompts.",
      icon: "🎓",
    },
    {
      title: "Research",
      description: "Accelerate research workflows with prompts optimized for academic and scientific tasks.",
      icon: "🔬",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "AI Product Manager",
      company: "TechCorp",
      content: "This tool transformed our prompt engineering workflow. We've seen a 40% improvement in output quality.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "ML Engineer",
      company: "DataFlow Inc",
      content: "The A/B testing feature alone saved us weeks of manual testing. Highly recommended for any AI team.",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Content Strategist",
      company: "Creative Labs",
      content:
        "The curated library is a goldmine. We found prompts that work perfectly for our content generation needs.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">PromptStudio</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="#features"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Features
              </Link>
              <Link
                href="#use-cases"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Use Cases
              </Link>
              <Link
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Pricing
              </Link>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Docs
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/docs">
                <Button variant="outline">Documentation</Button>
              </Link>
              <Link href="/dashboard">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <Badge className="mb-4" variant="secondary">
            🚀 Now with AI-powered optimization
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Master the Art of
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Prompt Engineering
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Build, test, and optimize prompts for large language models with our comprehensive suite of tools. From
            creation to deployment, we've got your entire prompt engineering workflow covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Building Prompts
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
                View Documentation
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600 dark:text-gray-400">Curated Prompts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">10k+</div>
              <div className="text-gray-600 dark:text-gray-400">Tests Run</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">95%</div>
              <div className="text-gray-600 dark:text-gray-400">Accuracy Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">24/7</div>
              <div className="text-gray-600 dark:text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for Prompt Engineering
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and features you need to create, test, and optimize
              prompts at scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Built for Every Use Case</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Whether you're building AI products, creating content, or conducting research, our platform adapts to your
              needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{useCase.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-white dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Trusted by AI Teams Worldwide</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">See what our users are saying about PromptStudio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Prompt Engineering?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers, researchers, and AI teams who are already using PromptStudio to build better
            AI applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/public">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Read Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">PromptStudio</span>
              </div>
              <p className="text-gray-400">The complete platform for prompt engineering and AI optimization.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/docs" className="hover:text-white">
                    Getting Started
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Examples
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-8 bg-gray-700" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 PromptStudio. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white">
                Privacy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                Terms
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                Security
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
