import React, {useState} from 'react'
import useTimeZone from '../../hooks/useTimeZone'
import {Calendar} from './Calendar'

export const ToolCalendar = () => {
  const {getCurrentZoneDate, utcToCurrentZoneDate} = useTimeZone()

  // Default to user's current date (in stored time zone)
  const [date, setDate] = useState<Date>(getCurrentZoneDate())

  return (
    <Calendar
      focusedDate={utcToCurrentZoneDate(date)}
      onFocusedDateChange={setDate}
      onSelect={setDate}
      selectedDate={utcToCurrentZoneDate(date)}
    />
  )
}
