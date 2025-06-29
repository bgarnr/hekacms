import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Calendar, MapPin, Users, Eye } from "lucide-react"

interface ContentPreviewProps {
  contentType: string
  content: any
}

export function ContentPreview({ contentType, content }: ContentPreviewProps) {
  const renderAppointmentPreview = () => {
    if (!content) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Appointment details will appear here as you provide information</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            {content.subject || 'Appointment Subject'}
          </h3>
          <div className="space-y-2">
            {content.time && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>{new Date(content.time).toLocaleString()}</span>
              </div>
            )}
            {content.place && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>{content.place}</span>
              </div>
            )}
            {content.attendees && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-blue-600" />
                <span>{Array.isArray(content.attendees) ? content.attendees.join(', ') : content.attendees}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderBlogPostPreview = () => {
    if (!content) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Blog post preview will appear here as you provide information</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <article className="bg-white dark:bg-slate-800 p-6 rounded-lg border shadow-sm">
          <header className="mb-4">
            <h1 className="text-2xl font-bold mb-2">
              {content.title || 'Blog Post Title'}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {content.author && <span>By {content.author}</span>}
              {content.publishedDate && (
                <span>{new Date(content.publishedDate).toLocaleDateString()}</span>
              )}
            </div>
            {content.tags && (
              <div className="flex flex-wrap gap-1 mt-2">
                {(Array.isArray(content.tags) ? content.tags : [content.tags]).map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>
          <div className="prose dark:prose-invert max-w-none">
            <p>{content.content || 'Blog post content will appear here...'}</p>
          </div>
        </article>
      </div>
    )
  }

  const renderGenericPreview = () => {
    if (!content) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Content preview will appear here as you provide information</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <h3 className="font-semibold mb-3">{contentType} Preview</h3>
          <div className="space-y-2">
            {Object.entries(content).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="text-sm">
                  {Array.isArray(value) ? value.join(', ') : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderPreview = () => {
    switch (contentType.toLowerCase()) {
      case 'appointment':
        return renderAppointmentPreview()
      case 'blog post':
        return renderBlogPostPreview()
      default:
        return renderGenericPreview()
    }
  }

  return (
    <Card className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Live Preview
        </CardTitle>
        <CardDescription>
          See how your {contentType} will look in real-time
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-120px)] overflow-y-auto">
        {renderPreview()}
      </CardContent>
    </Card>
  )
}