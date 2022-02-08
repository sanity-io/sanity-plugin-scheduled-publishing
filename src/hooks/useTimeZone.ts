import {getTimeZones} from '@vvo/tzdb'
import {useEffect, useState} from 'react'
import {TimeZone} from '../types'
interface UseTimeZoneReturn {
  setTimeZone: (timeZone?: TimeZone) => void
  timeIsLocal: boolean
  timeZone: TimeZone
}

const STORAGE_KEY = 'sp-timeZone'

// Map through only the values we care about
export const allTimeZones = getTimeZones().map((tz) => {
  return {
    abbreviation: tz.abbreviation,
    alternativeName: tz.alternativeName,
    mainCities: tz.mainCities.join(', '),
    // Main time zone name 'Africa/Dar_es_Salaam'
    name: tz.name,
    // Time zone name with underscores removed
    namePretty: tz.name.replaceAll('_', ' '),
    offset: tz.currentTimeFormat.split(' ')[0],
    // all searchable text - this is transformed before being rendered in `<AutoComplete>`
    value: `${tz.currentTimeFormat} ${tz.abbreviation} ${tz.name}`,
  } as TimeZone
})

export function getLocalTimeZone(): TimeZone {
  return (
    allTimeZones.find((tz) => tz.name === Intl.DateTimeFormat().resolvedOptions().timeZone) ||
    // Default to GMT-0 if no user timeZone is found
    allTimeZones.find((timeZone) => timeZone.abbreviation === 'GMT') ||
    // Return the first time zone as a fallback
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

  const handleNewValue: UseTimeZoneReturn['setTimeZone'] = (tz) => {
    setTimeZone((prevTz) => {
      // Clear selection if no value is given
      if (!tz?.name) {
        localStorage.removeItem(STORAGE_KEY)
        window.dispatchEvent(new Event(STORAGE_KEY)) // notify other instances

        return getStoredTimeZone()
      }

      // If different from current state, update localStorage & notify other instances
      if (tz?.name && prevTz.name !== tz.name) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tz))
        window.dispatchEvent(new Event(STORAGE_KEY))
      }

      return tz
    })
  }

  return {
    setTimeZone: handleNewValue,
    timeIsLocal: getLocalTimeZone().name === timeZone.name,
    timeZone,
  }
}

export default useTimeZone
