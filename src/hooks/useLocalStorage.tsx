'use client'
import { useEffect, useState } from 'react'

export default function useLocalStorage<T>(key: string, initialValue: T) {
   const [storedValue, setStoredValue] = useState<T>(initialValue)
   const [isInitialized, setIsInitialized] = useState(false)

   // Load from localStorage on mount
   useEffect(() => {
      try {
         const item = localStorage.getItem(key)
         if (item) {
            const parsed = JSON.parse(item)
            setStoredValue(parsed)
            if (typeof parsed === 'string') {
               document.documentElement.setAttribute('data-theme', parsed)
            }
         } else {
            localStorage.setItem(key, JSON.stringify(initialValue))
         }
      } catch (error) {
         console.error(`Error reading localStorage key "${key}":`, error)
      } finally {
         setIsInitialized(true)
      }
   }, [initialValue, key])

   const setValue = (value: T | ((val: T) => T)) => {
      try {
         const valueToStore =
            value instanceof Function ? value(storedValue) : value
         setStoredValue(valueToStore)
         localStorage.setItem(key, JSON.stringify(valueToStore))
         if (typeof valueToStore === 'string') {
            document.documentElement.setAttribute('data-theme', valueToStore)
         }
      } catch (error) {
         console.error(`Error setting localStorage key "${key}":`, error)
      }
   }

   return [storedValue, setValue, isInitialized] as const
}
