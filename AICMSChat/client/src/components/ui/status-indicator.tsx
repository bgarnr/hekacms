import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'busy' | 'away'
  className?: string
  showLabel?: boolean
}

export function StatusIndicator({ status, className, showLabel = false }: StatusIndicatorProps) {
  const statusConfig = {
    online: { color: 'bg-green-500', label: 'Online' },
    offline: { color: 'bg-gray-400', label: 'Offline' },
    busy: { color: 'bg-red-500', label: 'Busy' },
    away: { color: 'bg-yellow-500', label: 'Away' }
  }

  const config = statusConfig[status]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("w-2 h-2 rounded-full", config.color)} />
      {showLabel && (
        <span className="text-xs text-muted-foreground">{config.label}</span>
      )}
    </div>
  )
}