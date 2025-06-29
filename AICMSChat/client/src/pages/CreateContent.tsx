import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Database
} from "lucide-react"
import { ChatInterface } from "@/components/ChatInterface"
import { ContentPreview } from "@/components/ContentPreview"
import { getContentTypes } from "@/api/contentTypes"
import { createContentInstance } from "@/api/contentInstances"
import { useToast } from "@/hooks/useToast"
import { useNavigate } from "react-router-dom"

export function CreateContent() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [contentTypes, setContentTypes] = useState<any[]>([])
  const [selectedContentType, setSelectedContentType] = useState<string>("")
  const [showChat, setShowChat] = useState(false)
  const [currentContent, setCurrentContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContentTypes()
  }, [])

  const loadContentTypes = async () => {
    try {
      console.log('Loading content types...')
      const response = await getContentTypes()
      setContentTypes((response as any).contentTypes)
      setLoading(false)
    } catch (error) {
      console.error('Error loading content types:', error)
      toast({
        title: "Error",
        description: "Failed to load content types",
        variant: "destructive"
      })
      setLoading(false)
    }
  }

  const handleContentTypeSelect = (contentTypeId: string) => {
    console.log('Selected content type:', contentTypeId)
    setSelectedContentType(contentTypeId)
    setShowChat(true)
  }

  const handleContentCreate = async (content: any) => {
    try {
      console.log('Creating content instance:', content)
      const response = await createContentInstance({
        contentTypeId: selectedContentType,
        data: content
      })

      toast({
        title: "Success",
        description: "Content created successfully"
      })

      navigate('/content-instances')
    } catch (error) {
      console.error('Error creating content:', error)
      toast({
        title: "Error",
        description: "Failed to create content",
        variant: "destructive"
      })
    }
  }

  const getSelectedContentTypeName = () => {
    const contentType = contentTypes.find(ct => ct._id === selectedContentType)
    return contentType?.name || ""
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-10 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create Content
          </h1>
          <p className="text-muted-foreground mt-2">
            Create new content instances with AI assistance
          </p>
        </div>
        <Button
          onClick={() => navigate('/content-types')}
          variant="outline"
        >
          <Database className="h-4 w-4 mr-2" />
          Manage Types
        </Button>
      </div>

      {!showChat ? (
        <div className="space-y-6">
          {/* Quick Create Section */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Quick Create with AI
              </CardTitle>
              <CardDescription>
                Tell AI what you want to create and it will guide you through the process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowChat(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Creating with AI
              </Button>
            </CardContent>
          </Card>

          {/* Content Type Selection */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Choose Content Type</CardTitle>
              <CardDescription>
                Select a content type to create a new instance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contentTypes.map((contentType) => (
                  <Card
                    key={contentType._id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200 dark:hover:border-blue-800"
                    onClick={() => handleContentTypeSelect(contentType._id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{contentType.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {contentType.instanceCount} instances
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {contentType.fields.length} fields
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {contentType.fields.slice(0, 3).map((field: any, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {field.name}
                            </Badge>
                          ))}
                          {contentType.fields.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{contentType.fields.length - 3}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-3 group"
                        >
                          Create {contentType.name}
                          <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {contentTypes.length === 0 && (
                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No content types available</h3>
                  <p className="text-muted-foreground mb-4">
                    You need to create content types before you can create content instances
                  </p>
                  <Button
                    onClick={() => navigate('/content-types')}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Content Type
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Chat Interface */}
          <div className="h-full">
            <ChatInterface
              context="content-creation"
              initialMessage={`I'll help you create a new ${getSelectedContentTypeName()}. Let's start with the basics - what would you like to create?`}
              onContentCreate={handleContentCreate}
            />
          </div>

          {/* Live Preview */}
          <div className="h-full">
            <ContentPreview
              contentType={getSelectedContentTypeName()}
              content={currentContent}
            />
          </div>
        </div>
      )}

      {showChat && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={() => setShowChat(false)}
            variant="outline"
            size="sm"
          >
            ← Back to Selection
          </Button>
        </div>
      )}
    </div>
  )
}