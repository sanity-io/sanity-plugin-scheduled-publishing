import {useToast} from '@sanity/ui'
import {getTimeZones} from '@vvo/tzdb'
import {formatInTimeZone, utcToZonedTime, zonedTimeToUtc} from 'date-fns-tz'
import React, {useEffect, useState} from 'react'
import ToastDescription from '../components/toastDescription/ToastDescription'
import {DATE_FORMAT, LOCAL_STORAGE_TZ_KEY} from '../constants'
import {NormalizedTimeZone} from '../types'
import {debugWithName} from '../utils/debug'
import getErrorMessage from '../utils/getErrorMessage'

enum TimeZoneEvents {
  update = 'timeZoneEventUpdate',
}

const debug = debugWithName('useScheduleOperation')

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
  } as NormalizedTimeZone
})

export const localTimeZone: NormalizedTimeZone =
  allTimeZones.find((tz) => tz.name === Intl.DateTimeFormat().resolvedOptions().timeZone) ||
  // Default to GMT-0 if no user timeZone is found
  allTimeZones.find((tz) => tz.abbreviation === 'GMT') ||
  // Return the first time zone as a fallback
  allTimeZones[0]

function getStoredTimeZone(): NormalizedTimeZone {
  const storedTimeZone = localStorage.getItem(LOCAL_STORAGE_TZ_KEY)
  try {
    if (storedTimeZone) {
      return JSON.parse(storedTimeZone)
    }
  } catch (error) {
    // invalid value (non-JSON) - fallback to local timeZone
  }

  return localTimeZone
}

const useTimeZone = () => {
  const [timeZone, setTimeZone] = useState<NormalizedTimeZone>(getStoredTimeZone())
  const toast = useToast()

  useEffect(() => {
    const handler = () => {
      // When updated in another hook instance, just fetch from localStorage
      setTimeZone(getStoredTimeZone())
    }

    window.addEventListener(TimeZoneEvents.update, handler)
    return () => {
      window.removeEventListener(TimeZoneEvents.update, handler)
    }
  }, [])

  /**
   * Return time-zone adjusted date in a date-fns supported format
   */
  const formatDateTz = ({
    date,
    format = DATE_FORMAT.LARGE,
    includeTimeZone,
    prefix,
  }: {
    date: Date
    format?: string
    includeTimeZone?: boolean
    prefix?: string
  }) => {
    let dateFormat = format
    if (prefix) {
      dateFormat = `'${prefix}'${format}`
    }
    if (includeTimeZone) {
      dateFormat = `${format} (zzzz)`
    }
    return formatInTimeZone(date, timeZone.name, dateFormat)
  }

  const getCurrentZoneDate = () => {
    return utcToZonedTime(new Date(), timeZone.name)
  }

  const handleNewValue = (tz: NormalizedTimeZone) => {
    debug('handleNewValue:', tz)

    setTimeZone((prevTz) => {
      try {
        // If different from current state, update localStorage & notify other instances
        if (prevTz.name !== tz.name) {
          localStorage.setItem(LOCAL_STORAGE_TZ_KEY, JSON.stringify(tz))
          window.dispatchEvent(new Event(TimeZoneEvents.update))
        }

        toast.push({
          closable: true,
          description: (
            <ToastDescription
              body={`${tz.alternativeName} (${tz.namePretty})`}
              title="Time zone updated"
            />
          ),
          duration: 15000, // 15s
          status: 'info',
        })
      } catch (err) {
        console.error(err)

        toast.push({
          closable: true,
          description: (
            <ToastDescription body={getErrorMessage(err)} title="Unable to update time zone" />
          ),
          status: 'error',
        })
      }

      return tz
    })
  }

  const utcToCurrentZoneDate = (date: Date) => {
    return utcToZonedTime(date, timeZone.name)
  }

  const zoneDateToUtc = (date: Date) => {
    return zonedTimeToUtc(date, timeZone.name)
  }

  return {
    formatDateTz,
    getCurrentZoneDate,
    setTimeZone: handleNewValue,
    timeZone,
    utcToCurrentZoneDate,
    zoneDateToUtc,
  }
}

export default useTimeZone
