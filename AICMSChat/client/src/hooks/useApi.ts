import { useState, useCallback } from 'react'
import { useToast } from './useToast'

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  showSuccessToast?: boolean
  showErrorToast?: boolean
  successMessage?: string
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const execute = useCallback(async (...args: any[]) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await apiFunction(...args)
      setData(result)
      
      if (options.onSuccess) {
        options.onSuccess(result)
      }
      
      if (options.showSuccessToast && options.successMessage) {
        toast({
          title: "Success",
          description: options.successMessage
        })
      }
      
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred')
      setError(error)
      
      if (options.onError) {
        options.onError(error)
      }
      
      if (options.showErrorToast !== false) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        })
      }
      
      throw error
    } finally {
      setLoading(false)
    }
  }, [apiFunction, options, toast])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    loading,
    error,
    execute,
    reset
  }
}