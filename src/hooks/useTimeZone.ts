import {getTimeZones, TimeZone} from '@vvo/tzdb'
import {useEffect, useState} from 'react'

interface UseTimeZoneReturn {
  timeZone: TimeZone
  setTimeZone: (timeZone?: TimeZone['currentTimeFormat']) => void
  timeIsLocal: boolean
}

const STORAGE_KEY = 'sp-timeZone'

export const allTimeZones = getTimeZones()

export function getLocalTimeZone(): TimeZone {
  return (
    allTimeZones.find((tz) => tz.name === Intl.DateTimeFormat().resolvedOptions().timeZone) ||
    // Default to GMT-0 if no user timeZone is found
    allTimeZones.find((timeZone) => timeZone.abbreviation === 'GMT') ||
    allTimeZones[0]
  )
}

function getStoredTimeZone(): TimeZone {
  const storedTimeZone = localStorage.getItem(STORAGE_KEY)
  try {
    if (storedTimeZone) {
      return JSON.parse(storedTimeZone)
    }
  } catch (error) {
    // invalid value (non-JSON) - fallback to local timeZone
  }

  return getLocalTimeZone()
}

const useTimeZone = (): UseTimeZoneReturn => {
  const [timeZone, setTimeZone] = useState<TimeZone>(getStoredTimeZone())

  useEffect(() => {
    const handler = () => {
      // When updated in another hook instance, just fetch from localStorage
      setTimeZone(getStoredTimeZone())
    }

    window.addEventListener(STORAGE_KEY, handler)
    return () => {
      window.removeEventListener(STORAGE_KEY, handler)
    }
  }, [])

  const handleNewValue: UseTimeZoneReturn['setTimeZone'] = (value) => {
    setTimeZone((prevTz) => {
      const expanded = value ? allTimeZones.find((tz) => tz.currentTimeFormat === value) : undefined

      // Clear selection if no value is given
      if (!expanded?.name) {
        localStorage.removeItem(STORAGE_KEY)
        window.dispatchEvent(new Event(STORAGE_KEY)) // notify other instances

        return getStoredTimeZone()
      }

      // If different from current state, update localStorage & notify other instances
      if (expanded?.name && prevTz.name !== expanded.name) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(expanded))
        window.dispatchEvent(new Event(STORAGE_KEY))
      }

      return expanded
    })
  }

  return {
    timeZone,
    setTimeZone: handleNewValue,
    timeIsLocal: getLocalTimeZone().name === timeZone.name,
  }
}

export default useTimeZone
