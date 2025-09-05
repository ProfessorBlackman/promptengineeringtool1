"use client"

import { useState, useEffect, useCallback } from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Library,
  BarChart3,
  FileIcon as FileTemplate,
  TestTube,
  Sparkles,
  GitBranch,
  FlaskConical,
  ChevronDown,
  HelpCircle,
  LogOut,
  User2,
} from "lucide-react"

import PromptBuilder from "@/components/prompt-builder"
import PromptLibrary from "@/components/prompt-library"
import PromptTester from "@/components/prompt-tester"
import TemplateManager from "@/components/template-manager"
import PromptRefiner from "@/components/prompt-refiner"
import VersionControl from "@/components/version-control"
import CuratedLibrary from "@/components/curated-library"
import ABTestManager from "@/components/ab-test-manager"
import AnalyticsDashboard from "@/components/analytics-dashboard"
import HowTo from "@/components/how-to"
import AuthGate from "@/components/auth-gate"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type NavKey =
  | "builder"
  | "analytics"
  | "curated"
  | "templates"
  | "library"
  | "refiner"
  | "tester"
  | "versions"
  | "ab-test"
  | "howto"

export default function PromptEngineeringStudio() {
  const [activeTab, setActiveTab] = useState<NavKey>("builder")
  const [search, setSearch] = useState("")
  const [openNav, setOpenNav] = useState(true)
  const [openAdvanced, setOpenAdvanced] = useState(true)
  const { user, signOut } = useAuth()

  const navItems: { key: NavKey; label: string; icon: any; tooltip: string }[] = [
    { key: "builder", label: "Builder", icon: Brain, tooltip: "Design, compose, and iterate on prompts" },
    { key: "analytics", label: "Analytics", icon: BarChart3, tooltip: "Track usage trends and success metrics" },
    { key: "curated", label: "Curated Prompts", icon: Library, tooltip: "Discover high-quality, pre-vetted prompts" },
    {
      key: "templates",
      label: "Templates",
      icon: FileTemplate,
      tooltip: "Use pre-defined structures to speed up creation",
    },
    { key: "library", label: "Prompts Library", icon: Library, tooltip: "Browse your saved prompts" },
    { key: "howto", label: "How To", icon: HelpCircle, tooltip: "Learn how to use the studio and shortcuts" },
  ]

  const advancedItems: { key: NavKey; label: string; icon: any; tooltip: string }[] = [
    { key: "refiner", label: "Refiner", icon: Sparkles, tooltip: "Improve prompts with guided enhancements" },
    { key: "tester", label: "Tester", icon: TestTube, tooltip: "Run tests and compare outputs" },
    { key: "versions", label: "Versions", icon: GitBranch, tooltip: "Track and compare prompt changes over time" },
    { key: "ab-test", label: "A/B Test", icon: FlaskConical, tooltip: "Experiment with prompt variants" },
  ]

  const handleNavigate = useCallback((key: NavKey) => {
    setActiveTab(key)
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // Keyboard shortcuts: Shift+Cmd/Ctrl+[A/C/T/L/H] and "g" then [a/c/t/l/h]
  useEffect(() => {
    const isEditable = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false
      if (target.isContentEditable) return true
      const tag = target.tagName.toLowerCase()
      return tag === "input" || tag === "textarea" || tag === "select"
    }
    const go = (key: string) => {
      switch (key) {
        case "a":
          handleNavigate("analytics")
          return true
        case "c":
          handleNavigate("curated")
          return true
        case "t":
          handleNavigate("templates")
          return true
        case "l":
          handleNavigate("library")
          return true
        case "h":
          handleNavigate("howto")
          return true
        default:
          return false
      }
    }
    let gPressed = false
    let gTimeout: number | null = null
    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return
      const key = e.key.toLowerCase()
      if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
        if (go(key)) {
          e.preventDefault()
          return
        }
      }
      if (!gPressed && key === "g") {
        gPressed = true
        if (gTimeout) window.clearTimeout(gTimeout)
        gTimeout = window.setTimeout(() => {
          gPressed = false
          gTimeout = null
        }, 1000)
        return
      }
      if (gPressed) {
        gPressed = false
        if (gTimeout) {
          window.clearTimeout(gTimeout)
          gTimeout = null
        }
        if (go(key)) {
          e.preventDefault()
          return
        }
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      if (gTimeout) window.clearTimeout(gTimeout)
    }
  }, [handleNavigate])

  return (
    <AuthGate>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
        <SidebarProvider>
          <Sidebar collapsible="icon" className="border-r">
            <SidebarHeader className="pt-4">
              <div className="flex items-center gap-2 px-2">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-purple-600 text-white">
                  <Brain className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Prompt Studio</span>
                  <span className="text-xs text-muted-foreground">v2.0</span>
                </div>
              </div>
              <div className="px-2 pt-3">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="h-8"
                  aria-label="Search prompts and tools"
                />
              </div>
            </SidebarHeader>

            <SidebarContent>
              {/* Navigate group - Collapsible */}
              <Collapsible defaultOpen className="group/collapsible" open={openNav} onOpenChange={setOpenNav}>
                <SidebarGroup>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex items-center">
                      <span>Navigate</span>
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarMenu>
                      {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeTab === item.key
                        return (
                          <SidebarMenuItem key={item.key}>
                            <SidebarMenuButton
                              isActive={isActive}
                              onClick={() => handleNavigate(item.key)}
                              aria-current={isActive ? "page" : undefined}
                              tooltip={item.tooltip}
                            >
                              <Icon className="h-4 w-4" />
                              <span>{item.label}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      })}
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>

              <SidebarSeparator />

              {/* Advanced group - Collapsible */}
              <Collapsible defaultOpen className="group/collapsible" open={openAdvanced} onOpenChange={setOpenAdvanced}>
                <SidebarGroup>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex items-center">
                      <span>Advanced</span>
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarMenu>
                      {advancedItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeTab === item.key
                        return (
                          <SidebarMenuItem key={item.key}>
                            <SidebarMenuButton
                              isActive={isActive}
                              onClick={() => handleNavigate(item.key)}
                              aria-current={isActive ? "page" : undefined}
                              tooltip={item.tooltip}
                            >
                              <Icon className="h-4 w-4" />
                              <span>{item.label}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      })}
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            </SidebarContent>
          </Sidebar>

          <SidebarInset>
            {/* Top bar */}
            <header className="sticky top-0 z-20 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <SidebarTrigger aria-label="Toggle sidebar" />
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <h1 className="text-lg font-semibold">Prompt Engineering Studio</h1>
                    <Badge variant="secondary" className="hidden sm:inline-flex">
                      v2.0
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {user && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              {(user.displayName?.[0] || user.email?.[0] || "U").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="hidden md:inline text-sm">{user.displayName || user.email}</span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <User2 className="h-4 w-4" /> {user.email}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => setActiveTab("howto")}>
                          <HelpCircle className="h-4 w-4" /> How To
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600" onClick={() => signOut()}>
                          <LogOut className="h-4 w-4" /> Sign out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </header>

            {/* Main content */}
            <main className="container mx-auto px-4 py-6">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as NavKey)} className="space-y-6">
                {/* Compact tab list for large screens */}
                <TabsList className="hidden lg:grid w-full grid-cols-10 gap-1">
                  <TabsTrigger value="builder" className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span>Builder</span>
                  </TabsTrigger>
                  <TabsTrigger value="refiner" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Refiner</span>
                  </TabsTrigger>
                  <TabsTrigger value="library" className="flex items-center gap-2">
                    <Library className="h-4 w-4" />
                    <span>Library</span>
                  </TabsTrigger>
                  <TabsTrigger value="tester" className="flex items-center gap-2">
                    <TestTube className="h-4 w-4" />
                    <span>Tester</span>
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="flex items-center gap-2">
                    <FileTemplate className="h-4 w-4" />
                    <span>Templates</span>
                  </TabsTrigger>
                  <TabsTrigger value="versions" className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    <span>Versions</span>
                  </TabsTrigger>
                  <TabsTrigger value="curated" className="flex items-center gap-2">
                    <Library className="h-4 w-4" />
                    <span>Curated</span>
                  </TabsTrigger>
                  <TabsTrigger value="ab-test" className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4" />
                    <span>A/B Test</span>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger value="howto" className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    <span>How To</span>
                  </TabsTrigger>
                </TabsList>

                {/* Content panes */}
                <TabsContent value="builder" className="space-y-6">
                  <PromptBuilder />
                </TabsContent>

                <TabsContent value="refiner" className="space-y-6">
                  <PromptRefiner />
                </TabsContent>

                <TabsContent value="library" className="space-y-6">
                  <PromptLibrary />
                </TabsContent>

                <TabsContent value="tester" className="space-y-6">
                  <PromptTester />
                </TabsContent>

                <TabsContent value="templates" className="space-y-6">
                  <TemplateManager />
                </TabsContent>

                <TabsContent value="versions" className="space-y-6">
                  <VersionControl />
                </TabsContent>

                <TabsContent value="curated" className="space-y-6">
                  <CuratedLibrary />
                </TabsContent>

                <TabsContent value="ab-test" className="space-y-6">
                  <ABTestManager />
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <AnalyticsDashboard />
                </TabsContent>

                <TabsContent value="howto" className="space-y-6">
                  <HowTo />
                </TabsContent>
              </Tabs>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </AuthGate>
  )
}
