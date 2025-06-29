import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Database, 
  FileText, 
  Layout, 
  Plus, 
  TrendingUp, 
  Users, 
  Calendar,
  BarChart3
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getContentTypes } from "@/api/contentTypes"
import { getContentInstances } from "@/api/contentInstances"
import { useToast } from "@/hooks/useToast"

export function Dashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [stats, setStats] = useState({
    contentTypes: 0,
    contentInstances: 0,
    pages: 0,
    activeUsers: 0
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      console.log('Loading dashboard data...')
      const [contentTypesRes, instancesRes] = await Promise.all([
        getContentTypes(),
        getContentInstances()
      ])

      setStats({
        contentTypes: (contentTypesRes as any).contentTypes.length,
        contentInstances: (instancesRes as any).instances.length,
        pages: 5, // Mock data
        activeUsers: 12 // Mock data
      })

      // Mock recent activity
      setRecentActivity([
        { id: '1', type: 'content_created', description: 'New appointment created', time: '2 minutes ago' },
        { id: '2', type: 'content_type_created', description: 'Blog Post content type created', time: '1 hour ago' },
        { id: '3', type: 'page_published', description: 'Homepage published', time: '3 hours ago' },
        { id: '4', type: 'user_joined', description: 'New user Sarah joined', time: '1 day ago' }
      ])

      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      })
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: "Create Content Type",
      description: "Define a new content structure with AI",
      icon: Database,
      action: () => navigate('/content-types'),
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "Add Content",
      description: "Create new content instances",
      icon: Plus,
      action: () => navigate('/create-content'),
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Build Page",
      description: "Design pages with drag & drop",
      icon: Layout,
      action: () => navigate('/page-builder'),
      color: "from-purple-500 to-pink-500"
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening with your content.
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Types</CardTitle>
            <Database className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.contentTypes}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Instances</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.contentInstances}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12 from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Pages</CardTitle>
            <Layout className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.pages}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +1 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +3 from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Get started with these common tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                onClick={action.action}
              >
                <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color}`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates from your team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {activity.type.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}