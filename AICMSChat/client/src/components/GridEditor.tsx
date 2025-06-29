import { useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Plus, Trash2, Move } from "lucide-react"

interface GridEditorProps {
  layout: any
  viewMode: 'desktop' | 'tablet' | 'mobile'
  contentInstances: any[]
  onLayoutChange: (layout: any) => void
}

export function GridEditor({ layout, viewMode, contentInstances, onLayoutChange }: GridEditorProps) {
  const [draggedItem, setDraggedItem] = useState<any>(null)

  const getGridCols = () => {
    switch (viewMode) {
      case 'mobile': return 'grid-cols-1'
      case 'tablet': return 'grid-cols-2'
      case 'desktop': return 'grid-cols-12'
      default: return 'grid-cols-12'
    }
  }

  const handleDrop = (sectionIndex: number) => {
    if (!draggedItem) return

    console.log('Dropping item in section:', sectionIndex, draggedItem)

    const newLayout = { ...layout }
    if (!newLayout.sections) {
      newLayout.sections = []
    }

    // Add content to the section
    if (!newLayout.sections[sectionIndex]) {
      newLayout.sections[sectionIndex] = {
        id: Date.now().toString(),
        type: 'content',
        contentIds: []
      }
    }

    if (!newLayout.sections[sectionIndex].contentIds) {
      newLayout.sections[sectionIndex].contentIds = []
    }

    newLayout.sections[sectionIndex].contentIds.push(draggedItem._id)
    onLayoutChange(newLayout)
    setDraggedItem(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const addSection = () => {
    const newLayout = { ...layout }
    if (!newLayout.sections) {
      newLayout.sections = []
    }

    newLayout.sections.push({
      id: Date.now().toString(),
      type: 'empty',
      contentIds: []
    })

    onLayoutChange(newLayout)
  }

  const removeSection = (index: number) => {
    const newLayout = { ...layout }
    newLayout.sections.splice(index, 1)
    onLayoutChange(newLayout)
  }

  const renderSection = (section: any, index: number) => {
    const hasContent = section.contentIds && section.contentIds.length > 0

    return (
      <div
        key={section.id || index}
        className={`min-h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 transition-colors hover:border-blue-400 dark:hover:border-blue-500 ${
          hasContent ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-slate-800'
        }`}
        onDrop={() => handleDrop(index)}
        onDragOver={handleDragOver}
      >
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            Section {index + 1}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeSection(index)}
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {hasContent ? (
          <div className="space-y-2">
            {section.contentIds.map((contentId: string) => {
              const content = contentInstances.find(inst => inst._id === contentId)
              if (!content) return null

              return (
                <Card key={contentId} className="bg-white dark:bg-slate-700 border shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="secondary" className="text-xs mb-1">
                          {content.contentType}
                        </Badge>
                        <p className="text-sm font-medium truncate">
                          {Object.values(content.data)[0] as string}
                        </p>
                      </div>
                      <Move className="h-4 w-4 text-muted-foreground cursor-grab" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-24 text-muted-foreground">
            <Plus className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">Drop content here</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Page Layout</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {viewMode} View
          </Badge>
          <Button
            onClick={addSection}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Section
          </Button>
        </div>
      </div>

      <div className={`grid gap-4 ${getGridCols()}`}>
        {layout.sections && layout.sections.length > 0 ? (
          layout.sections.map((section: any, index: number) => (
            <div
              key={section.id || index}
              className={viewMode === 'desktop' ? 'col-span-6' : 'col-span-1'}
            >
              {renderSection(section, index)}
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
              <CardContent className="p-12 text-center">
                <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Start Building Your Page</h3>
                <p className="text-muted-foreground mb-4">
                  Add sections to create your page layout, then drag content from the sidebar
                </p>
                <Button
                  onClick={addSection}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Section
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Grid Guidelines */}
      {viewMode === 'desktop' && (
        <div className="text-xs text-muted-foreground mt-4">
          <p>💡 Tip: Sections will automatically adjust to a 12-column grid system on desktop</p>
        </div>
      )}
    </div>
  )
}