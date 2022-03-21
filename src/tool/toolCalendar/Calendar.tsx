import {Box, Button, Flex, Text, useForwardedRef} from '@sanity/ui'
import {ChevronLeftIcon, ChevronRightIcon} from '@sanity/icons'
import {addDays, addMonths, setHours, setMinutes} from 'date-fns'
import React, {forwardRef, useCallback, useEffect} from 'react'
import {CalendarMonth} from './CalendarMonth'
import {ARROW_KEYS, MONTH_NAMES} from './constants'
import {TOOL_HEADER_HEIGHT} from '../../constants'
import useTimeZone from '../../hooks/useTimeZone'

export type CalendarProps = Omit<React.ComponentProps<'div'>, 'onSelect'> & {
  focusedDate: Date
  onSelect: (date?: Date) => void
  onFocusedDateChange: (index: Date) => void
  selectedDate?: Date
}

// This is used to maintain focus on a child element of the calendar-grid between re-renders
// When using arrow keys to move focus from a day in one month to another we are setting focus at the button for the day
// after it has changed but *only* if we *already* had focus inside the calendar grid (e.g not if focus was on the "next
// year" button, or any of the other controls)
// When moving from the last day of a month that displays 6 weeks in the grid to a month that displays 5 weeks, current
// focus gets lost on render, so this provides us with a stable element to help us preserve focus on a child element of
// the calendar grid between re-renders
const PRESERVE_FOCUS_ELEMENT = (
  <span
    data-preserve-focus
    style={{overflow: 'hidden', position: 'absolute', outline: 'none'}}
    tabIndex={-1}
  />
)

export const Calendar = forwardRef(function Calendar(
  props: CalendarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>
) {
  const {focusedDate, onFocusedDateChange, onSelect, selectedDate, ...restProps} = props

  const {zoneDateToUtc} = useTimeZone()

  const setFocusedDate = useCallback(
    (date: Date) => onFocusedDateChange(zoneDateToUtc(date)),
    [onFocusedDateChange, zoneDateToUtc]
  )

  const moveFocusedDate = useCallback(
    (by: number) => setFocusedDate(addMonths(focusedDate, by)),
    [focusedDate, setFocusedDate]
  )

  const handleDateChange = useCallback(
    (date?: Date) => {
      onSelect(
        date
          ? zoneDateToUtc(setMinutes(setHours(date, date.getHours()), date.getMinutes()))
          : undefined
      )
    },
    [onSelect, zoneDateToUtc]
  )

  const ref = useForwardedRef(forwardedRef)

  const focusCurrentWeekDay = useCallback(() => {
    ref.current?.querySelector<HTMLElement>(`[data-focused="true"]`)?.focus()
  }, [ref])

  const handleKeyDown = useCallback(
    (event) => {
      if (!ARROW_KEYS.includes(event.key)) {
        return
      }
      event.preventDefault()
      if (event.target.hasAttribute('data-calendar-grid')) {
        focusCurrentWeekDay()
        return
      }
      if (event.key === 'ArrowUp') {
        onFocusedDateChange(zoneDateToUtc(addDays(focusedDate, -7)))
      }
      if (event.key === 'ArrowDown') {
        onFocusedDateChange(zoneDateToUtc(addDays(focusedDate, 7)))
      }
      if (event.key === 'ArrowLeft') {
        onFocusedDateChange(zoneDateToUtc(addDays(focusedDate, -1)))
      }
      if (event.key === 'ArrowRight') {
        onFocusedDateChange(zoneDateToUtc(addDays(focusedDate, 1)))
      }
      // set focus temporarily on this element to make sure focus is still inside the calendar-grid after re-render
      ref.current?.querySelector<HTMLElement>('[data-preserve-focus]')?.focus()
    },
    [ref, focusCurrentWeekDay, onFocusedDateChange, focusedDate]
  )

  useEffect(() => {
    focusCurrentWeekDay()
  }, [focusCurrentWeekDay])

  useEffect(() => {
    const currentFocusInCalendarGrid = document.activeElement?.matches(
      '[data-calendar-grid], [data-calendar-grid] [data-preserve-focus]'
    )
    if (
      // Only move focus if it's currently in the calendar grid
      currentFocusInCalendarGrid
    ) {
      focusCurrentWeekDay()
    }
  }, [ref, focusCurrentWeekDay, focusedDate])

  const handleNowClick = useCallback(() => onSelect(new Date()), [onSelect])

  const handlePrevMonthClick = useCallback(() => moveFocusedDate(-1), [moveFocusedDate])

  const handleNextMonthClick = useCallback(() => moveFocusedDate(1), [moveFocusedDate])

  return (
    <Box data-ui="Calendar" {...restProps} ref={ref}>
      {/* Month + Year header */}
      <Flex
        align="center"
        paddingLeft={4}
        style={{
          borderBottom: '1px solid var(--card-border-color)',
          minHeight: `${TOOL_HEADER_HEIGHT}px`,
          position: 'sticky',
          top: 0,
        }}
      >
        <Flex align="center" flex={1} justify="space-between">
          <Text weight="medium">
            {MONTH_NAMES[focusedDate?.getMonth()]} {focusedDate?.getFullYear()}
          </Text>
          <Flex>
            <Button
              icon={ChevronLeftIcon}
              mode="bleed"
              onClick={handlePrevMonthClick}
              radius={0}
              style={{height: '55px', width: '50px'}}
            />
            <Button
              icon={ChevronRightIcon}
              mode="bleed"
              onClick={handleNextMonthClick}
              radius={0}
              style={{height: '55px', width: '50px'}}
            />
          </Flex>
        </Flex>
      </Flex>

      {/* Select date */}
      <Box>
        {/* Selected month (grid of days) */}
        <Box data-calendar-grid onKeyDown={handleKeyDown} overflow="hidden" tabIndex={0}>
          <CalendarMonth
            date={focusedDate}
            focused={focusedDate}
            onSelect={handleDateChange}
            selected={selectedDate}
          />
          {PRESERVE_FOCUS_ELEMENT}
        </Box>
      </Box>

      {/* Today button */}
      <Box flex={1} style={{borderBottom: '1px solid var(--card-border-color)'}}>
        <Button
          fontSize={1}
          mode="bleed"
          onClick={handleNowClick}
          padding={4}
          radius={0}
          style={{width: '100%'}}
          text="Today"
        />
      </Box>
    </Box>
  )
})
