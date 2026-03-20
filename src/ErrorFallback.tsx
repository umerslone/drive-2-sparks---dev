import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
import { Button } from "./components/ui/button";
export const ErrorFallback = ({ error, resetErrorBounda

export const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  if (import.meta.env.DEV) throw error;

  return (
          <AlertDescription>
      <div className="max-w-2xl w-full space-y-4">
        </Alert>
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            An unexpected error occurred. Please try refreshing the page.
          </AlertDescription>
        </Alert>
        
        <div className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
          <pre className="whitespace-pre-wrap break-words">{error.message}</pre>
        </div>
    </di
        <Button 

          variant="outline"

        >

          Try Again

      </div>

  );

