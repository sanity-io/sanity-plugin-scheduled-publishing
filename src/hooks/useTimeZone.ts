import React from 'react'
import {TimeZone, getTimeZones} from '@vvo/tzdb'

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

type ACTIONTYPE =
  | {type: 'UPDATED_ELSEWHERE'}
  | {type: 'SET_TIMEZONE'; value: UseTimeZoneReturn['timeZone'] | null}

const timeZoneReducer = (state: UseTimeZoneReturn['timeZone'], action: ACTIONTYPE) => {
  switch (action.type) {
    case 'SET_TIMEZONE':
      // Clear selection if no value is given
      if (!action.value?.name) {
        localStorage.removeItem(STORAGE_KEY)
        window.dispatchEvent(new Event(STORAGE_KEY)) // notify other instances

        return getStoredTimeZone()
      }

      // If different from current state, update localStorage & notify other instances
      if (action.value?.name && state.name !== action.value.name) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(action.value))
        window.dispatchEvent(new Event(STORAGE_KEY))
      }

      return action.value
    case 'UPDATED_ELSEWHERE':
      return getStoredTimeZone() // No need to notify others
    default:
      return state
  }
}

const useTimeZone = (): UseTimeZoneReturn => {
  const [timeZone, dispatch] = React.useReducer(timeZoneReducer, getStoredTimeZone())

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
    timeZone,
    setTimeZone: (value) => {
      if (!value) {
        dispatch({type: 'SET_TIMEZONE', value: null})
      }

      const expanded = allTimeZones.find((tz) => tz.currentTimeFormat === value)
      dispatch({type: 'SET_TIMEZONE', value: expanded || null})
    },
    timeIsLocal: getLocalTimeZone().name === timeZone.name,
  }
}

export default useTimeZone
