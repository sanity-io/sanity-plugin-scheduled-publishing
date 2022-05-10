import {Card, Text} from '@sanity/ui'
import {endOfDay} from 'date-fns'
import React, {useCallback, useMemo} from 'react'
import useTimeZone from '../../../../hooks/useTimeZone'

interface CalendarDayProps {
  date: Date
  focused?: boolean
  onSelect: (date: Date) => void
  isCurrentMonth?: boolean
  isToday: boolean
  customValidation?: (selectedDate: Date) => boolean
  selected?: boolean
}

export function CalendarDay(props: CalendarDayProps) {
  const {date, focused, isCurrentMonth, isToday, customValidation, onSelect, selected} = props

  const {zoneDateToUtc} = useTimeZone()

  // Round date to the end of day when passing to custom validate function.
  // Remember that all calendar days have dates in local / 'wall time', but validation requires a conversion to UTC.
  const isValid = useMemo(() => {
    if (!customValidation) {
      return true
    }
    const dayEnd = endOfDay(date)
    return customValidation(zoneDateToUtc(dayEnd))
  }, [customValidation, date, zoneDateToUtc])

  const handleClick = useCallback(() => {
    if (isValid) {
      onSelect(date)
    }
  }, [date, isValid, onSelect])

  return (
    <div aria-selected={selected} data-ui="CalendarDay">
      <Card
        aria-label={date.toDateString()}
        aria-pressed={selected}
        as="button"
        __unstable_focusRing
        data-weekday
        data-focused={focused ? 'true' : ''}
        disabled={!isValid}
        role="button"
        tabIndex={-1}
        onClick={handleClick}
        padding={3}
        radius={2}
        selected={selected}
        tone={isToday || selected ? 'primary' : 'default'}
      >
        <Text
          muted={!selected && !isCurrentMonth}
          style={{textAlign: 'center'}}
          weight={isCurrentMonth ? 'medium' : 'regular'}
        >
          {date.getDate()}
        </Text>
      </Card>
    </div>
  )
}
