import { useState, useEffect, useCallback } from 'react'
import { getSafeKVClient } from '@/lib/spark-shim'

export function useSafeKV<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const kv = getSafeKVClient()
  const [value, setValue] = useState<T>(defaultValue)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const loadInitialValue = async () => {
      try {
        const stored = await kv.get<T>(key)
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
  }, [key, kv])

  const updateValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue

        kv.set(key, resolved).catch((error: unknown) => {
          console.warn(`useSafeKV: Failed to persist ${key}:`, error)
        })

        return resolved
      })
    },
    [key, kv]
  )

  const deleteValue = useCallback(() => {
    setValue(defaultValue)
    kv.delete(key).catch((error: unknown) => {
      console.warn(`useSafeKV: Failed to delete ${key}:`, error)
    })
  }, [key, defaultValue, kv])

  return [isInitialized ? value : defaultValue, updateValue, deleteValue]
}
