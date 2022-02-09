import React from 'react'
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
  const {value = new Date(), onChange, ...rest} = props
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
