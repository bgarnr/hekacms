import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center p-4">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-0 shadow-xl max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-red-100 dark:bg-red-900/20 rounded-full w-fit">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
              {this.state.error && (
                <details className="text-left bg-gray-50 dark:bg-slate-800 p-3 rounded text-sm">
                  <summary className="cursor-pointer font-medium">Error details</summary>
                  <pre className="mt-2 whitespace-pre-wrap text-xs">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              <Button
                onClick={this.resetError}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}