import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Database,
  Plus,
  Search,
  Calendar,
  Trash2,
  Edit,
  Eye,
  MessageCircle
} from "lucide-react"
import { ChatInterface } from "@/components/ChatInterface"
import { getContentTypes, createContentType, deleteContentType } from "@/api/contentTypes"
import { useToast } from "@/hooks/useToast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function ContentTypes() {
  const { toast } = useToast()
  const [contentTypes, setContentTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showChat, setShowChat] = useState(false)

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

  const handleCreateContentType = async (schema: any) => {
    try {
      console.log('Creating content type:', schema)
      const response = await createContentType({
        name: schema.name,
        fields: schema.fields
      })

      toast({
        title: "Success",
        description: "Content type created successfully"
      })

      loadContentTypes()
      setShowChat(false)
    } catch (error) {
      console.error('Error creating content type:', error)
      toast({
        title: "Error",
        description: "Failed to create content type",
        variant: "destructive"
      })
    }
  }

  const handleDeleteContentType = async (id: string) => {
    try {
      console.log('Deleting content type:', id)
      await deleteContentType(id)

      toast({
        title: "Success",
        description: "Content type deleted successfully"
      })

      loadContentTypes()
    } catch (error) {
      console.error('Error deleting content type:', error)
      toast({
        title: "Error",
        description: "Failed to delete content type",
        variant: "destructive"
      })
    }
  }

  const filteredContentTypes = contentTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getFieldTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      text: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      number: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      date: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      datetime: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      select: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      multiselect: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      richtext: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
      textarea: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      image: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
      multitext: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400'
    }
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
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
            Content Types
          </h1>
          <p className="text-muted-foreground mt-2">
            Define and manage your content structures with AI assistance
          </p>
        </div>
        <Button
          onClick={() => setShowChat(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create with AI
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search content types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Content Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContentTypes.map((contentType) => (
          <Card key={contentType._id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg">{contentType.name}</CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {contentType.instanceCount} instances
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-2 text-sm">
                <Calendar className="h-3 w-3" />
                Created {new Date(contentType.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Fields ({contentType.fields.length})</h4>
                <div className="flex flex-wrap gap-1">
                  {contentType.fields.slice(0, 4).map((field: any, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className={`text-xs ${getFieldTypeColor(field.type)}`}
                    >
                      {field.name}
                      {field.required && <span className="ml-1 text-red-500">*</span>}
                    </Badge>
                  ))}
                  {contentType.fields.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{contentType.fields.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white dark:bg-slate-900">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Content Type</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{contentType.name}"? This action cannot be undone and will also delete all associated content instances.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteContentType(contentType._id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContentTypes.length === 0 && !loading && (
        <div className="text-center py-12">
          <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No content types found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Try adjusting your search terms" : "Get started by creating your first content type with AI"}
          </p>
          <Button
            onClick={() => setShowChat(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Create with AI
          </Button>
        </div>
      )}

      {/* AI Chat Interface with Schema Preview */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-7xl h-[80vh] bg-white dark:bg-slate-900 rounded-lg shadow-2xl border-0">
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-lg">
              <h2 className="text-lg font-semibold">Create Content Type with AI</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(false)}
                className="hover:bg-white/50 dark:hover:bg-slate-800/50"
              >
                ✕
              </Button>
            </div>
            <div className="h-[calc(80vh-73px)]">
              <ChatInterface
                context="content-type"
                initialMessage="I'd be happy to help you create a new content type! What kind of content are you looking to manage? For example, you could say 'I want to create a recipe' or 'I need a blog post structure'."
                onContentTypeCreate={handleCreateContentType}
                showSchemaPreview={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}