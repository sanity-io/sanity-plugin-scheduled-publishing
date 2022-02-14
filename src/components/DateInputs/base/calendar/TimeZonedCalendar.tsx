import {utcToZonedTime, zonedTimeToUtc} from 'date-fns-tz'
import React from 'react'
import useTimeZone from '../../../../hooks/useTimeZone'
import {Calendar, CalendarProps} from './Calendar'

function getLoggableDates(log: Record<string, Date | undefined>) {
  const dates: Record<string, string | undefined> = {}
  for (const key of Object.keys(log)) {
    dates[key] = log[key]?.toISOString()?.split('T')?.[1]
  }
  return dates
}

export const TimeZonedCalendar = React.forwardRef(function TimeZonedCalendar(
  props: Omit<CalendarProps, 'focusedDate' | 'onFocusedDateChange'> & {
    focusedDate?: CalendarProps['focusedDate']
    onFocusedDateChange?: CalendarProps['onFocusedDateChange']
  },
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {timeZone} = useTimeZone()

  function onSelect(date: Date) {
    // eslint-disable-next-line
    console.table({
      ...getLoggableDates({
        newDate: date,
        newUtc: zonedTimeToUtc(date || new Date(), timeZone.name),
        newZoned: utcToZonedTime(date || new Date(), timeZone.name),
        selectedDate: props.selectedDate,
      }),
      timeZone: timeZone.offset,
    })

    /**
     * NORMALIZING DATES BEFORE PERSISTING
     *
     * Premises:
     * 1. We want to store time in UTC
     * 1. Dates the user selects in the calendar corespond to the desired `timeZone`
     *  - Ex: If their local time zone is UTC-1 but `timeZone` is UTC+1, 15h will be stored as 14h in UTC-0
     * 1. `Calendar` maps the current user's time zone to date selected,
     * converting it to UTC before passing it to the onSelect handler.
     * 1. Given a known `timeZone`, we can then get the final UTC date by factoring the time zone offset
     *
     * Example scenario:
     * - Selected hour: 15h
     * - Desired `timeZone`: UTC+4
     * - Target UTC result: 11h (15h - 4)
     *
     * How we get there:
     * - Example user's time zone: UTC-1
     * - `Calendar`'s onSelect UTC value: 16h (15 + 1 -> converted based on user's time zone)
     * // @TODO: why is this not 11h?
     * - Factor `timeZone` into final UTC: 16 - UTC+4 = 12h
     */
    props.onSelect(zonedTimeToUtc(date, timeZone.name))
  }

  /**
   * `Calendar` converts UTC dates to the user's local time zone, we need to factor in the selected timeZone.
   *
   * Example scenario:
   * - Selected hour (UTC, as all dates are stored): 15h
   * - Show time according to selected `timeZone`, not the user's local time
   *  - in UTC-2, 15h is shown as 13h
   *  - in UTC+2, 15h is shown as 17h, etc.
   *
   * How we get there:
   * - Selected `timeZone`: UTC+2
   * - For `Calendar` to show 17h, add the `timeZone` offset
   *  - 15 + UTC+2 = 17h
   * - User's time zone: UTC-3
   * // @TODO: why is this not 15h?
   * - Now, `Calendar` will convert 17h UTC to UTC-3 and display 14h
   */
  const selectedDate = utcToZonedTime(props.selectedDate || new Date(), timeZone.name)
  // eslint-disable-next-line
  console.table({
    ...getLoggableDates({
      raw: props.selectedDate,
      utcTimeZone: selectedDate,
      zonedTimeZone: utcToZonedTime(props.selectedDate || new Date(), timeZone.name),
    }),
    timeZone: timeZone.offset,
  })
  return (
    <Calendar
      {...props}
      ref={ref}
      selectedDate={selectedDate}
      onSelect={onSelect}
      focusedDate={
        props.focusedDate ? zonedTimeToUtc(props.focusedDate, timeZone.name) : selectedDate
      }
      onFocusedDateChange={
        props.onFocusedDateChange ||
        (() => {
          // noop
        })
      }
    />
  )
})
