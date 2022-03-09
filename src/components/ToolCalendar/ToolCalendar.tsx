import React, {useState} from 'react'
import useTimeZone from '../../hooks/useTimeZone'
import {Calendar} from './Calendar'

export const ToolCalendar = () => {
  const {getCurrentZoneDate} = useTimeZone()

  // Default to user's current date (in stored time zone)
  const [date, setDate] = useState<Date>(getCurrentZoneDate())

  return (
    <Calendar
      focusedDate={date}
      onFocusedDateChange={setDate}
      onSelect={setDate}
      selectedDate={date}
    />
  )
}
