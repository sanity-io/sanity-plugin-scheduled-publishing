import {isSameDay} from 'date-fns'
import React, {createContext, ReactNode, useCallback, useContext, useMemo, useState} from 'react'
import useTimeZone from '../../hooks/useTimeZone'
import {Schedule, ScheduleSort, ScheduleState} from '../../types'
import {getLastExecuteDate} from '../../utils/scheduleUtils'

type State = {
  activeSchedules: Schedule[]
  schedules: Schedule[]
  schedulesByDate: (date: Date) => Schedule[]
  scheduleState?: ScheduleState
  selectedDate?: Date
  setSortBy: (sortBy: ScheduleSort) => void
  sortBy?: ScheduleSort
}

const SchedulesContext = createContext<State | undefined>(undefined)

const EMPTY_SCHEDULE: Schedule[] = []

function SchedulesProvider({
  children,
  value,
}: {
  children: ReactNode
  value: {
    schedules: Schedule[]
    scheduleState: ScheduleState
    selectedDate?: Date
    sortBy?: ScheduleSort
  }
}) {
  const [sortBy, setSortBy] = useState<ScheduleSort>(value.sortBy || 'executeAt')
  const {timeZone, utcToCurrentZoneDate} = useTimeZone()

  function filterByDate(wallDate: Date) {
    return function (schedule: Schedule) {
      const executeDate = getLastExecuteDate(schedule)
      if (!executeDate) {
        return false
      }
      const scheduleDate = new Date(executeDate) // UTC
      const zonedScheduleDate = utcToCurrentZoneDate(scheduleDate)
      return isSameDay(zonedScheduleDate, wallDate)
    }
  }

  function filterByState(scheduleState: ScheduleState) {
    return function (schedule: Schedule) {
      return schedule.state === scheduleState
    }
  }

  /**
   * Return all schedules if no date is currently selected, otherwise return all schedules for the
   * selected calendar date.
   *
   * By default, all schedules are displayed in reverse chronlogical order
   * except when filtering by upcoming schedules, or a date has been selected in the calendar.
   *
   * If a schedule as an `executedAt` date, sort by that instead.
   * This is because schedules may have differing values for `executeAt` and `executedAt` if
   * they've been force-published ahead of time, and we only care about the final execution date.
   *
   * Schedules with a null value for `executeAt` (possible if created externally via the Scheduling API)
   * should always be placed after all other results.
   */
  const activeSchedules = useMemo(() => {
    return (
      value.schedules
        .filter((scheduleState) => {
          if (value.selectedDate) {
            return filterByDate(value.selectedDate)(scheduleState)
          }
          return filterByState(value.scheduleState)(scheduleState)
        })
        .sort((a, b) => {
          if (sortBy === 'createdAt') {
            return a[sortBy] < b[sortBy] ? 1 : -1
          }
          if (sortBy === 'executeAt') {
            const invertOrder = value.scheduleState === 'scheduled' || value.selectedDate ? -1 : 1
            const aExecuteDate = getLastExecuteDate(a)
            const bExecuteDate = getLastExecuteDate(b)

            if (aExecuteDate === bExecuteDate) {
              return 0
            }
            if (aExecuteDate === null) {
              return 1
            }
            if (bExecuteDate === null) {
              return -1
            }
            return (aExecuteDate > bExecuteDate ? -1 : 1) * invertOrder
          }
          return 1
        }) || []
    )
  }, [value.schedules, value.scheduleState, value.selectedDate, sortBy])

  /**
   * Return all matching schedules with specified date (in clock time).
   *
   * Scheduled are sorted chronologically by executed + execute date.
   *
   * Schedules with a null value for `executeAt` (possible if created externally via the Scheduling API)
   * should always be placed after all other results.
   */
  const schedulesByDate = useCallback(
    (wallDate: Date) => {
      return value.schedules.filter(filterByDate(wallDate)).sort((a, b) => {
        const aExecuteDate = getLastExecuteDate(a)
        const bExecuteDate = getLastExecuteDate(b)

        if (aExecuteDate === bExecuteDate) {
          return 0
        }
        if (aExecuteDate === null) {
          return 1
        }
        if (bExecuteDate === null) {
          return -1
        }
        return aExecuteDate > bExecuteDate ? 1 : -1
      })
    },
    [timeZone, value.schedules]
  )

  return (
    <SchedulesContext.Provider
      value={{
        activeSchedules,
        schedules: value.schedules || EMPTY_SCHEDULE,
        schedulesByDate,
        scheduleState: value.scheduleState,
        selectedDate: value.selectedDate,
        setSortBy,
        sortBy,
      }}
    >
      {children}
    </SchedulesContext.Provider>
  )
}

function useSchedules() {
  const context = useContext(SchedulesContext)
  if (context === undefined) {
    throw new Error('useSchedules must be used within a SchedulesProvider')
  }
  return context
}

export {SchedulesProvider, useSchedules}
