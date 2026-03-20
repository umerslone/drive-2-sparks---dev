import { ErrorLog, ErrorSeverity, ErrorCategory } from "@/types"

const ERROR_LOGS_KEY = "app-error-logs"
const MAX_ERROR_LOGS = 1000

class ErrorLogger {
  private static instance: ErrorLogger
  private errorLogs: ErrorLog[] = []

  private constructor() {
    this.loadErrorLogs()
  }

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  private loadErrorLogs(): void {
    if (typeof window === "undefined") {
      this.errorLogs = []
      return
    }

    try {
      const storedLogs = localStorage.getItem(ERROR_LOGS_KEY)
      this.errorLogs = storedLogs ? (JSON.parse(storedLogs) as ErrorLog[]) : []
    } catch (error) {
      console.warn("Failed to load error logs:", error)
      this.errorLogs = []
    }
  }

  private async saveErrorLogs(): Promise<void> {
    if (typeof window === "undefined") {
      return
    }

    try {
      const logsToSave = this.errorLogs.slice(0, MAX_ERROR_LOGS)
      localStorage.setItem(ERROR_LOGS_KEY, JSON.stringify(logsToSave))
    } catch (error) {
      console.warn("Failed to save error logs:", error)
    }
  }

  async logError(
    message: string,
    error: Error | unknown,
    category: ErrorCategory,
    severity: ErrorSeverity,
    userId?: string,
    metadata?: Record<string, unknown>
  ): Promise<string> {
    const errorLog: ErrorLog = {
      id: `error-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      timestamp: Date.now(),
      message,
      stack: error instanceof Error ? error.stack : undefined,
      errorType: error instanceof Error ? error.name : typeof error,
      category,
      severity,
      userId,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      url: typeof window !== "undefined" ? window.location.href : "unknown",
      metadata: {
        ...metadata,
        errorString: error instanceof Error ? error.toString() : String(error),
      },
      resolved: false,
    }

    this.errorLogs.unshift(errorLog)
    this.errorLogs = this.errorLogs.slice(0, MAX_ERROR_LOGS)

    await this.saveErrorLogs()

    if (severity === "critical") {
      console.error("CRITICAL ERROR:", errorLog)
    } else if (severity === "high") {
      console.error("HIGH SEVERITY ERROR:", errorLog)
    } else {
      console.warn("Error logged:", errorLog)
    }

    return errorLog.id
  }

  async getErrorLogs(filters?: {
    category?: ErrorCategory
    severity?: ErrorSeverity
    userId?: string
    resolved?: boolean
  }): Promise<ErrorLog[]> {
    let filteredLogs = [...this.errorLogs]

    if (filters?.category) {
      filteredLogs = filteredLogs.filter((log) => log.category === filters.category)
    }

    if (filters?.severity) {
      filteredLogs = filteredLogs.filter((log) => log.severity === filters.severity)
    }

    if (filters?.userId) {
      filteredLogs = filteredLogs.filter((log) => log.userId === filters.userId)
    }

    if (typeof filters?.resolved === "boolean") {
      filteredLogs = filteredLogs.filter((log) => log.resolved === filters.resolved)
    }

    return filteredLogs.sort((a, b) => b.timestamp - a.timestamp)
  }

  async markErrorAsResolved(errorId: string): Promise<void> {
    const errorIndex = this.errorLogs.findIndex((log) => log.id === errorId)

    if (errorIndex !== -1) {
      this.errorLogs[errorIndex] = {
        ...this.errorLogs[errorIndex],
        resolved: true,
        resolvedAt: Date.now(),
      }
      await this.saveErrorLogs()
    }
  }

  async clearResolvedErrors(): Promise<void> {
    this.errorLogs = this.errorLogs.filter((log) => !log.resolved)
    await this.saveErrorLogs()
  }

  async clearAllErrors(): Promise<void> {
    this.errorLogs = []
    await this.saveErrorLogs()
  }

  async getErrorStats(): Promise<{
    total: number
    byCategory: Record<ErrorCategory, number>
    bySeverity: Record<ErrorSeverity, number>
    resolved: number
    unresolved: number
    recentErrors: number
  }> {
    const now = Date.now()
    const oneDayAgo = now - 24 * 60 * 60 * 1000

    const byCategory: Record<ErrorCategory, number> = {
      authentication: 0,
      generation: 0,
      storage: 0,
      export: 0,
      network: 0,
      validation: 0,
      system: 0,
      unknown: 0,
    }

    const bySeverity: Record<ErrorSeverity, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    }

    let resolved = 0
    let unresolved = 0
    let recentErrors = 0

    for (const log of this.errorLogs) {
      byCategory[log.category]++
      bySeverity[log.severity]++

      if (log.resolved) {
        resolved++
      } else {
        unresolved++
      }

      if (log.timestamp >= oneDayAgo) {
        recentErrors++
      }
    }

    return {
      total: this.errorLogs.length,
      byCategory,
      bySeverity,
      resolved,
      unresolved,
      recentErrors,
    }
  }
}

export const errorLogger = ErrorLogger.getInstance()

export const logError = (
  message: string,
  error: Error | unknown,
  category: ErrorCategory = "unknown",
  severity: ErrorSeverity = "medium",
  userId?: string,
  metadata?: Record<string, unknown>
): Promise<string> => {
  return errorLogger.logError(message, error, category, severity, userId, metadata)
}

export const createErrorBoundaryHandler = (category: ErrorCategory, userId?: string) => {
  return (error: Error, errorInfo: { componentStack: string }) => {
    logError("React Error Boundary caught an error", error, category, "high", userId, {
      componentStack: errorInfo.componentStack,
    })
  }
}
