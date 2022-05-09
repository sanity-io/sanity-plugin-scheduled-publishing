import React, {useCallback, useState} from 'react'
import useTimeZone from '../../hooks/useTimeZone'
import {Calendar} from './Calendar'

interface Props {
  onSelect: (date?: Date) => void
  selectedDate?: Date
}

export const ToolCalendar = (props: Props) => {
  const {onSelect, selectedDate} = props

  const {getCurrentZoneDate, utcToCurrentZoneDate} = useTimeZone()

  // Focus selected date (if routed) or user's current date (in stored time zone)
  const [focusedDate, setFocusedDate] = useState<Date>(selectedDate || getCurrentZoneDate())

  const handleFocusDateChange = useCallback(
    (date: Date) => {
      setFocusedDate(utcToCurrentZoneDate(date))
    },
    [utcToCurrentZoneDate]
  )

  return (
    <Calendar
      focusedDate={focusedDate}
      onFocusedDateChange={handleFocusDateChange}
      onSelect={onSelect}
      selectedDate={selectedDate}
    />
  )
}
