import { Bell, LogOut, MessageCircle } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./ui/theme-toggle"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Badge } from "./ui/badge"

export function Header() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    console.log('User logging out')
    logout()
    navigate("/login")
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI CMS
          </div>
          <Badge variant="secondary" className="text-xs">
            Beta
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <MessageCircle className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-blue-500">
              3
            </Badge>
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
              2
            </Badge>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}