import {Box} from '@sanity/ui'
import React from 'react'
import {useSchedules} from '../contexts/schedules'
import EmptySchedules from './EmptySchedules'
import VirtualList from './VirtualList'

export const Schedules = () => {
  const {activeSchedules, scheduleState} = useSchedules()
  return (
    <Box style={{height: '100%'}}>
      {activeSchedules.length === 0 ? (
        <Box padding={4}>
          <EmptySchedules scheduleState={scheduleState} />
        </Box>
      ) : (
        <VirtualList />
      )}
    </Box>
  )
}
