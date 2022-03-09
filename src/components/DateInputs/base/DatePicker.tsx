import React from 'react'
import useTimeZone from '../../../hooks/useTimeZone'
import {Calendar} from './calendar/Calendar'

export const DatePicker = React.forwardRef(function DatePicker(
  props: Omit<React.ComponentProps<'div'>, 'onChange'> & {
    value?: Date
    onChange: (nextDate: Date) => void
    selectTime?: boolean
    timeStep?: number
  },
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {getCurrentZoneDate} = useTimeZone()

  const {
    // Default to current date in selected time zone
    value = getCurrentZoneDate(),
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
    <Calendar
      {...rest}
      ref={ref}
      selectedDate={value}
      onSelect={handleSelect}
      focusedDate={focusedDate || value}
      onFocusedDateChange={setFocusedDay}
    />
  )
})
