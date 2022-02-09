import {utcToZonedTime} from 'date-fns-tz'
import React from 'react'
import useTimeZone from '../../../hooks/useTimeZone'
import {Calendar as SanityCalendar} from '@sanity/form-builder/lib/inputs/DateInputs/base/calendar/Calendar'

export const DatePicker = React.forwardRef(function DatePicker(
  props: Omit<React.ComponentProps<'div'>, 'onChange'> & {
    value?: Date
    onChange: (nextDate: Date) => void
    selectTime?: boolean
    timeStep?: number
  },
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {timeZone} = useTimeZone()

  const {
    // Default to current date in selected time zone
    value = utcToZonedTime(new Date(), timeZone.name),
    onChange,
    ...rest
  } = props
  const [focusedDate, setFocusedDay] = React.useState<Date>()

  const handleSelect = React.useCallback(
    (nextDate) => {
      onChange(nextDate)
      setFocusedDay(undefined)
    },
    [onChange]
  )

  return (
    <SanityCalendar
      {...rest}
      ref={ref}
      selectedDate={value}
      onSelect={handleSelect}
      focusedDate={focusedDate || value}
      onFocusedDateChange={setFocusedDay}
    />
  )
})
