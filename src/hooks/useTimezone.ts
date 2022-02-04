import React from 'react'
import {TimeZone, getTimeZones} from '@vvo/tzdb'

interface UseTimezoneReturn {
  timezone: TimeZone
  setTimezone: (timezone: TimeZone['currentTimeFormat']) => void
}

const STORAGE_KEY = 'sp-timezone'

export const allTimezones = getTimeZones()

function getStoredTimezone() {
  const storedTimezone = localStorage.getItem(STORAGE_KEY)
  try {
    if (storedTimezone) {
      return JSON.parse(storedTimezone)
    }
  } catch (error) {
    // invalid value (non-JSON) - fallback to local timezone
  }

  return (
    allTimezones.find((tz) => tz.name === Intl.DateTimeFormat().resolvedOptions().timeZone) ||
    // Default to GMT-0 if no user timezone is found
    allTimezones.find((timezone) => timezone.abbreviation === 'GMT') ||
    allTimezones[0]
  )
}

type ACTIONTYPE =
  | {type: 'UPDATED_ELSEWHERE'}
  | {type: 'SET_TIMEZONE'; value: UseTimezoneReturn['timezone'] | null}

const timezoneReducer = (state: UseTimezoneReturn['timezone'], action: ACTIONTYPE) => {
  switch (action.type) {
    case 'SET_TIMEZONE':
      // Clear selection if no value is given
      if (!action.value?.name) {
        localStorage.removeItem(STORAGE_KEY)
        window.dispatchEvent(new Event(STORAGE_KEY)) // notify other instances

        return getStoredTimezone()
      }

      // If different from current state, update localStorage & notify other instances
      if (action.value?.name && state.name !== action.value.name) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(action.value))
        window.dispatchEvent(new Event(STORAGE_KEY))
      }

      return action.value
    case 'UPDATED_ELSEWHERE':
      return getStoredTimezone() // No need to notify others
    default:
      return state
  }
}

const useTimezone = (): UseTimezoneReturn => {
  const [timezone, dispatch] = React.useReducer(timezoneReducer, getStoredTimezone())

  React.useEffect(() => {
    const handler = () => {
      dispatch({type: 'UPDATED_ELSEWHERE'})
    }

    window.addEventListener(STORAGE_KEY, handler)
    return () => {
      window.removeEventListener(STORAGE_KEY, handler)
    }
  }, [])

  return {
    timezone,
    setTimezone: (value) => {
      const expanded = allTimezones.find((tz) => tz.currentTimeFormat === value)
      dispatch({type: 'SET_TIMEZONE', value: expanded || null})
    },
  }
}

export default useTimezone
