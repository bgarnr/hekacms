import { useState } from "react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  FolderOpen, 
  Folder,
  Plus,
  Search
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Page {
  _id: string
  name: string
  published: boolean
  parentId?: string
  children?: Page[]
  layout: any
  createdAt: string
}

interface PageTreeViewProps {
  pages: Page[]
  selectedPage: Page | null
  onPageSelect: (page: Page) => void
  onCreatePage: (parentId?: string) => void
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function PageTreeView({ 
  pages, 
  selectedPage, 
  onPageSelect, 
  onCreatePage,
  searchTerm,
  onSearchChange
}: PageTreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1', '2']))

  const toggleExpanded = (pageId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId)
    } else {
      newExpanded.add(pageId)
    }
    setExpandedNodes(newExpanded)
  }

  const filterPages = (pages: Page[], term: string): Page[] => {
    if (!term) return pages
    
    return pages.filter(page => {
      const matchesName = page.name.toLowerCase().includes(term.toLowerCase())
      const hasMatchingChildren = page.children && page.children.some(child => 
        child.name.toLowerCase().includes(term.toLowerCase())
      )
      return matchesName || hasMatchingChildren
    }).map(page => ({
      ...page,
      children: page.children ? filterPages(page.children, term) : []
    }))
  }

  const renderPageNode = (page: Page, level: number = 0) => {
    const hasChildren = page.children && page.children.length > 0
    const isExpanded = expandedNodes.has(page._id)
    const isSelected = selectedPage?._id === page._id

    return (
      <div key={page._id} className="select-none">
        <div
          className={cn(
            "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors group",
            "hover:bg-blue-50 dark:hover:bg-blue-900/20",
            isSelected && "bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => onPageSelect(page)}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation()
                toggleExpanded(page._id)
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          ) : (
            <div className="w-4" />
          )}

          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-500" />
            ) : (
              <Folder className="h-4 w-4 text-blue-500" />
            )
          ) : (
            <FileText className="h-4 w-4 text-gray-500" />
          )}

          <span className="flex-1 text-sm font-medium truncate">
            {page.name}
          </span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge 
              variant={page.published ? "default" : "secondary"} 
              className="text-xs"
            >
              {page.published ? 'Published' : 'Draft'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                onCreatePage(page._id)
              }}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-2">
            {page.children!.map(child => renderPageNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const filteredPages = filterPages(pages, searchTerm)

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search pages..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-9"
        />
      </div>

      <div className="space-y-1 max-h-96 overflow-y-auto">
        {filteredPages.map(page => renderPageNode(page))}
      </div>

      <Button
        onClick={() => onCreatePage()}
        variant="outline"
        size="sm"
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Root Page
      </Button>
    </div>
  )
}