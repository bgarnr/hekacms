import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileText,
  Plus,
  Search,
  Calendar,
  Trash2,
  Edit,
  Eye,
  Filter
} from "lucide-react"
import { getContentInstances, deleteContentInstance } from "@/api/contentInstances"
import { getContentTypes } from "@/api/contentTypes"
import { useToast } from "@/hooks/useToast"
import { useNavigate } from "react-router-dom"
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

export function ContentInstances() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [instances, setInstances] = useState<any[]>([])
  const [contentTypes, setContentTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContentType, setSelectedContentType] = useState<string>("all")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      console.log('Loading content instances and types...')
      const [instancesRes, typesRes] = await Promise.all([
        getContentInstances(),
        getContentTypes()
      ])

      setInstances((instancesRes as any).instances)
      setContentTypes((typesRes as any).contentTypes)
      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: "Failed to load content data",
        variant: "destructive"
      })
      setLoading(false)
    }
  }

  const handleDeleteInstance = async (id: string) => {
    try {
      console.log('Deleting content instance:', id)
      await deleteContentInstance(id)

      toast({
        title: "Success",
        description: "Content instance deleted successfully"
      })

      loadData()
    } catch (error) {
      console.error('Error deleting content instance:', error)
      toast({
        title: "Error",
        description: "Failed to delete content instance",
        variant: "destructive"
      })
    }
  }

  const filteredInstances = instances.filter(instance => {
    const matchesSearch = Object.values(instance.data).some((value: any) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
    const matchesType = selectedContentType === "all" || instance.contentTypeId === selectedContentType

    return matchesSearch && matchesType
  })

  const formatFieldValue = (value: any, maxLength: number = 50) => {
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value)
    }
    const stringValue = String(value)
    return stringValue.length > maxLength ? stringValue.substring(0, maxLength) + '...' : stringValue
  }

  const getStatusColor = (createdAt: string) => {
    const daysSinceCreated = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
    if (daysSinceCreated < 1) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    if (daysSinceCreated < 7) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
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
            Content Instances
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage all your content instances across different types
          </p>
        </div>
        <Button
          onClick={() => navigate('/create-content')}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Content
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedContentType} onValueChange={setSelectedContentType}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {contentTypes.map((type) => (
              <SelectItem key={type._id} value={type._id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content Table */}
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Instances ({filteredInstances.length})
          </CardTitle>
          <CardDescription>
            All content instances with their key information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredInstances.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Content Preview</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstances.map((instance) => (
                  <TableRow key={instance._id}>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {instance.contentType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {Object.entries(instance.data).slice(0, 2).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="font-medium text-muted-foreground">{key}:</span>{' '}
                            <span>{formatFieldValue(value, 30)}</span>
                          </div>
                        ))}
                        {Object.keys(instance.data).length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{Object.keys(instance.data).length - 2} more fields
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(instance.createdAt)}>
                        {Math.floor((Date.now() - new Date(instance.createdAt).getTime()) / (1000 * 60 * 60 * 24)) === 0
                          ? 'New'
                          : Math.floor((Date.now() - new Date(instance.createdAt).getTime()) / (1000 * 60 * 60 * 24)) < 7
                          ? 'Recent'
                          : 'Older'
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(instance.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white dark:bg-slate-900">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Content Instance</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this content instance? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteInstance(instance._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No content instances found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedContentType !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first content instance"
                }
              </p>
              <Button
                onClick={() => navigate('/create-content')}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Content
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}