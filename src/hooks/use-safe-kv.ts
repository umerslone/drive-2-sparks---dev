import { useState, useEffect, useCallback } from 'react'

export function useSafeKV<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(defaultValue)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const loadInitialValue = async () => {
      try {
        const stored = await window.spark.kv.get<T>(key)
        if (stored !== undefined) {
          setValue(stored)
        }
      } catch (error) {
        console.warn(`useSafeKV: Failed to load ${key}, using default:`, error)
      } finally {
        setIsInitialized(true)
      }
    }

    loadInitialValue()
  }, [key])

  const updateValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue

        window.spark.kv.set(key, resolved).catch((error) => {
          console.warn(`useSafeKV: Failed to persist ${key}:`, error)
        })

        return resolved
      })
    },
    [key]
  )

  const deleteValue = useCallback(() => {
    setValue(defaultValue)
    window.spark.kv.delete(key).catch((error) => {
      console.warn(`useSafeKV: Failed to delete ${key}:`, error)
    })
  }, [key, defaultValue])

  return [isInitialized ? value : defaultValue, updateValue, deleteValue]
}
