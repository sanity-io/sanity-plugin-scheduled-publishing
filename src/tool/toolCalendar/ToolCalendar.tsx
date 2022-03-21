import React, {useState} from 'react'
import useTimeZone from '../../hooks/useTimeZone'
import {Calendar} from './Calendar'

interface Props {
  onSelect: (date?: Date) => void
  selectedDate?: Date
}

export const ToolCalendar = (props: Props) => {
  const {onSelect, selectedDate} = props

  const {getCurrentZoneDate, utcToCurrentZoneDate} = useTimeZone()

  // Default to user's current date (in stored time zone)
  const [date, setDate] = useState<Date>(getCurrentZoneDate())

  return (
    <Calendar
      focusedDate={utcToCurrentZoneDate(date)}
      onFocusedDateChange={setDate}
      onSelect={onSelect}
      selectedDate={selectedDate}
    />
  )
}
