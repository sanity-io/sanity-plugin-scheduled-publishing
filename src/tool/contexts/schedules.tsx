import {isSameDay} from 'date-fns'
import React, {createContext, ReactNode, useCallback, useContext, useMemo, useState} from 'react'
import {Schedule, ScheduleSort, ScheduleState} from '../../types'
import {getLastExecuteDate} from '../../utils/scheduleUtils'

type State = {
  activeSchedules: Schedule[]
  schedules: Schedule[]
  schedulesByDate: (date: Date) => {
    completed: Schedule[]
    failed: Schedule[]
    invalid: Schedule[]
    upcoming: Schedule[]
  }
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

  // Date must be in UTC
  const schedulesByDate = useCallback(
    (date: Date) => {
      return {
        completed: value.schedules.filter(
          (schedule) =>
            schedule.state === 'succeeded' &&
            schedule.documents.findIndex((d) => !!d.documentType) >= 0 &&
            isSameDay(new Date(schedule.executeAt), date)
        ),
        failed: value.schedules.filter(
          (schedule) =>
            schedule.state === 'cancelled' &&
            schedule.documents.findIndex((d) => !!d.documentType) >= 0 &&
            isSameDay(new Date(schedule.executeAt), date)
        ),
        invalid: value.schedules.filter(
          (schedule) =>
            schedule.documents.findIndex((d) => !!d.documentType) === -1 &&
            isSameDay(new Date(schedule.executeAt), date)
        ),
        upcoming: value.schedules.filter(
          (schedule) =>
            schedule.state === 'scheduled' &&
            schedule.documents.findIndex((d) => !!d.documentType) >= 0 &&
            isSameDay(new Date(schedule.executeAt), date)
        ),
      }
    },
    [value.schedules]
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
