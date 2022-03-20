import {isSameDay} from 'date-fns'
import React, {createContext, ReactNode, useCallback, useContext, useMemo, useState} from 'react'
import useTimeZone from '../../hooks/useTimeZone'
import {Schedule, ScheduleSort, ScheduleState} from '../../types'
import {getLastExecuteDate} from '../../utils/scheduleUtils'

type State = {
  activeSchedules: Schedule[]
  schedules: Schedule[]
  schedulesByDate: (date: Date) => Schedule[]
  scheduleState: ScheduleState
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
    sortBy?: ScheduleSort
  }
}) {
  const [sortBy, setSortBy] = useState<ScheduleSort>(value.sortBy || 'executeAt')
  const {timeZone, utcToCurrentZoneDate} = useTimeZone()

  const activeSchedules = useMemo(() => {
    return (
      value.schedules
        .filter((schedule) => schedule.state === value.scheduleState)
        .sort((a, b) => {
          if (sortBy === 'createdAt') {
            return a[sortBy] < b[sortBy] ? 1 : -1
          }
          /**
           * By default, all schedules are displayed in reverse chronlogical order
           * except when displaying 'scheduled' (or upcoming) items.
           * If a schedule as an `executedAt` date, sort by that instead.
           * This is because schedules may have differing values for `executeAt` and `executedAt` if
           * they've been force-published ahead of time, and we only care about the final execution date.
           */
          if (sortBy === 'executeAt') {
            const invertOrder = value.scheduleState === 'scheduled' ? -1 : 1
            return (getLastExecuteDate(a) > getLastExecuteDate(b) ? -1 : 1) * invertOrder
          }
          return 1
        }) || []
    )
  }, [value.schedules, value.scheduleState, sortBy])

  /**
   * Return all matching schedules with specified date (in clock time).
   * Scheduled are sorted chronologically by executed + execute date.
   */
  const schedulesByDate = useCallback(
    (clockDate: Date) => {
      return value.schedules
        .filter((schedule) => {
          const scheduleDate = new Date(getLastExecuteDate(schedule)) // UTC
          const zonedScheduleDate = utcToCurrentZoneDate(scheduleDate)
          return isSameDay(zonedScheduleDate, clockDate)
        })
        .sort((a, b) => (getLastExecuteDate(a) > getLastExecuteDate(b) ? 1 : -1))
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
