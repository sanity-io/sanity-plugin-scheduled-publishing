import React, {createContext, ReactNode, useContext, useMemo, useState} from 'react'
import {Schedule, ScheduleSort, ScheduleState} from '../../types'

type State = {
  activeSchedules: Schedule[]
  schedules: Schedule[]
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
          if (sortBy === 'executeAt') {
            // By default, all schedules are displayed in reverse chronlogical order,
            // except when displayed 'scheduled' (or upcoming) items.
            const invertOrder = value.scheduleState === 'scheduled' ? -1 : 1
            return (a[sortBy] > b[sortBy] ? -1 : 1) * invertOrder
          }
          return 1
        }) || []
    )
  }, [value.schedules, value.scheduleState, sortBy])

  return (
    <SchedulesContext.Provider
      value={{
        activeSchedules,
        schedules: value.schedules || EMPTY_SCHEDULE,
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
