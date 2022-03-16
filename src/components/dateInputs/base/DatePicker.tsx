import React from 'react'
import useTimeZone from '../../../hooks/useTimeZone'
import {Calendar} from './calendar/Calendar'

export const DatePicker = React.forwardRef(function DatePicker(
  props: Omit<React.ComponentProps<'div'>, 'onChange'> & {
    value?: Date
    onChange: (nextDate: Date) => void
    selectTime?: boolean
    timeStep?: number
    customValidation?: (selectedDate: Date) => boolean
  },
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {utcToCurrentZoneDate} = useTimeZone()
  const {value = new Date(), onChange, customValidation, ...rest} = props
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
      selectedDate={utcToCurrentZoneDate(value)}
      onSelect={handleSelect}
      focusedDate={utcToCurrentZoneDate(focusedDate || value)}
      onFocusedDateChange={setFocusedDay}
      customValidation={customValidation}
    />
  )
})
