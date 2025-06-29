import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Layout,
  Plus,
  Search,
  Grid,
  Smartphone,
  Tablet,
  Monitor,
  Save,
  Eye,
  MessageCircle,
  FileText,
  Database
} from "lucide-react"
import { ChatInterface } from "@/components/ChatInterface"
import { GridEditor } from "@/components/GridEditor"
import { PageTreeView } from "@/components/PageTreeView"
import { getPages, createPage, updatePage } from "@/api/pages"
import { getContentInstances } from "@/api/contentInstances"
import { useToast } from "@/hooks/useToast"

export function PageBuilder() {
  const { toast } = useToast()
  const [pages, setPages] = useState<any[]>([])
  const [contentInstances, setContentInstances] = useState<any[]>([])
  const [selectedPage, setSelectedPage] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [showChat, setShowChat] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("pages")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      console.log('Loading pages and content instances...')
      const [pagesRes, instancesRes] = await Promise.all([
        getPages(),
        getContentInstances()
      ])

      setPages((pagesRes as any).pages)
      setContentInstances((instancesRes as any).instances)
      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: "Failed to load page builder data",
        variant: "destructive"
      })
      setLoading(false)
    }
  }

  const handleCreatePage = async (parentId?: string) => {
    try {
      const pageName = parentId ? 'New Child Page' : 'New Page'
      console.log('Creating page:', pageName, 'with parent:', parentId)
      
      const response = await createPage({
        name: pageName,
        layout: { sections: [] },
        parentId
      })

      toast({
        title: "Success",
        description: "Page created successfully"
      })

      loadData()
      setShowChat(false)
    } catch (error) {
      console.error('Error creating page:', error)
      toast({
        title: "Error",
        description: "Failed to create page",
        variant: "destructive"
      })
    }
  }

  const handleSavePage = async () => {
    if (!selectedPage) return

    try {
      console.log('Saving page:', selectedPage)
      await updatePage(selectedPage._id, {
        name: selectedPage.name,
        layout: selectedPage.layout
      })

      toast({
        title: "Success",
        description: "Page saved successfully"
      })
    } catch (error) {
      console.error('Error saving page:', error)
      toast({
        title: "Error",
        description: "Failed to save page",
        variant: "destructive"
      })
    }
  }

  const getViewModeIcon = (mode: string) => {
    switch (mode) {
      case 'desktop': return Monitor
      case 'tablet': return Tablet
      case 'mobile': return Smartphone
      default: return Monitor
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="lg:col-span-3 h-96 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Page Builder
          </h1>
          <p className="text-muted-foreground mt-2">
            Design and build pages with drag-and-drop interface
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowChat(true)}
            variant="outline"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
          <Button
            onClick={() => handleCreatePage()}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Page
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with Tabs */}
        <div className="space-y-4">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-0 shadow-xl">
            <CardHeader className="pb-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pages" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    Pages
                  </TabsTrigger>
                  <TabsTrigger value="content" className="text-xs">
                    <Database className="h-3 w-3 mr-1" />
                    Content
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="pages" className="mt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">Page Structure</h3>
                      <Badge variant="secondary" className="text-xs">
                        {pages.length} pages
                      </Badge>
                    </div>
                    <PageTreeView
                      pages={pages}
                      selectedPage={selectedPage}
                      onPageSelect={setSelectedPage}
                      onCreatePage={handleCreatePage}
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="content" className="mt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">Content Library</h3>
                      <Badge variant="secondary" className="text-xs">
                        {contentInstances.length} items
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      Drag content to add to your page
                    </CardDescription>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {contentInstances.map((instance) => (
                        <div
                          key={instance._id}
                          className="p-3 rounded-lg border bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 cursor-grab hover:shadow-md transition-all duration-200 border-blue-100 dark:border-blue-800"
                          draggable
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs bg-white dark:bg-slate-700">
                              {instance.contentType}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate font-medium">
                            {Object.values(instance.data)[0] as string}
                          </p>
                          <div className="flex items-center gap-1 mt-2">
                            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
                            <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>

        {/* Main Editor Area */}
        <div className="lg:col-span-3 space-y-4">
          {selectedPage ? (
            <>
              {/* Toolbar */}
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-0 shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Input
                        value={selectedPage.name}
                        onChange={(e) => setSelectedPage({ ...selectedPage, name: e.target.value })}
                        className="font-medium bg-white dark:bg-slate-800"
                      />
                      <Badge variant={selectedPage.published ? "default" : "secondary"}>
                        {selectedPage.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* View Mode Toggle */}
                      <div className="flex border rounded-lg p-1 bg-gray-50 dark:bg-slate-800">
                        {(['desktop', 'tablet', 'mobile'] as const).map((mode) => {
                          const Icon = getViewModeIcon(mode)
                          return (
                            <Button
                              key={mode}
                              variant={viewMode === mode ? "default" : "ghost"}
                              size="sm"
                              onClick={() => setViewMode(mode)}
                              className="h-8 w-8 p-0"
                            >
                              <Icon className="h-4 w-4" />
                            </Button>
                          )
                        })}
                      </div>

                      <Button variant="outline" size="sm" className="bg-white dark:bg-slate-800">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        onClick={handleSavePage}
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Grid Editor */}
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-0 shadow-xl">
                <CardContent className="p-6">
                  <GridEditor
                    layout={selectedPage.layout}
                    viewMode={viewMode}
                    contentInstances={contentInstances}
                    onLayoutChange={(newLayout) =>
                      setSelectedPage({ ...selectedPage, layout: newLayout })
                    }
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-0 shadow-xl">
              <CardContent className="p-12 text-center">
                <Layout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a page to start editing</h3>
                <p className="text-muted-foreground mb-4">
                  Choose a page from the tree view or create a new one to begin building
                </p>
                <Button
                  onClick={() => handleCreatePage()}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Page
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* AI Chat Interface */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl h-[600px] bg-white dark:bg-slate-900 rounded-lg shadow-2xl border-0">
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-lg">
              <h2 className="text-lg font-semibold">AI Layout Assistant</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(false)}
                className="hover:bg-white/50 dark:hover:bg-slate-800/50"
              >
                ✕
              </Button>
            </div>
            <div className="h-[calc(600px-73px)]">
              <ChatInterface
                context="general"
                initialMessage="I can help you design page layouts! Tell me what kind of page you want to create, and I'll suggest the best layout and content arrangement."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}