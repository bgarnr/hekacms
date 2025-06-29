import { Button } from "./button"
import { Card, CardContent } from "./card"

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-0 shadow-xl">
      <CardContent className="p-12 text-center">
        <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        {action && (
          <Button
            onClick={action.onClick}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}