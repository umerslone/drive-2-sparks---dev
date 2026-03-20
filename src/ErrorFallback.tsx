import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert"
import { Button } from "./components/ui/button"

export function ErrorFallback({ 
  error, 
  resetErrorBoundary 
}: { 
  error: Error
  resetErrorBoundary: () => void
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-4">
        <Alert variant="destructive">
          <AlertTitle className="text-lg font-semibold">Something went wrong</AlertTitle>
          <AlertDescription className="mt-2">
            An unexpected error occurred. Please try again or refresh the page.
          </AlertDescription>
        </Alert>
        
        <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
          <p className="font-mono text-xs break-all">{error.message}</p>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={resetErrorBoundary} className="flex-1">
            Try again
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
            Refresh page
          </Button>
        </div>
      </div>
    </div>
  )
}
