import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { 
  LayoutDashboard, 
  Database, 
  FileText, 
  Plus, 
  Layout,
  Sparkles,
  Settings,
  HelpCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "./ui/badge"

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Content Types', href: '/content-types', icon: Database },
  { name: 'Content Instances', href: '/content-instances', icon: FileText },
  { name: 'Create Content', href: '/create-content', icon: Plus },
  { name: 'Page Builder', href: '/page-builder', icon: Layout },
]

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
]

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  console.log('Current location:', location.pathname)

  return (
    <div className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-white/80 dark:bg-slate-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">AI Powered</span>
            </div>
          </div>
          
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-11",
                    isActive 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg" 
                      : "hover:bg-blue-50 dark:hover:bg-slate-800"
                  )}
                  onClick={() => {
                    console.log('Navigating to:', item.href)
                    navigate(item.href)
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                  {item.name === 'Content Types' && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      5
                    </Badge>
                  )}
                  {item.name === 'Content Instances' && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      23
                    </Badge>
                  )}
                </Button>
              )
            })}
          </nav>
        </div>
        
        <div className="border-t p-4">
          <nav className="space-y-2">
            {bottomNavigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-11",
                    isActive 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" 
                      : "hover:bg-blue-50 dark:hover:bg-slate-800"
                  )}
                  onClick={() => {
                    console.log('Navigating to:', item.href)
                    navigate(item.href)
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Button>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}