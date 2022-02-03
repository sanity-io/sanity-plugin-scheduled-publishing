import {Flex, Stack} from '@sanity/ui'
import React from 'react'
import {SCHEDULE_STATES} from '../constants'
import {Schedule, ScheduleState} from '../types'
import ScheduleFilter from './ScheduleFilter'

interface Props {
  schedules: Schedule[]
  scheduleState: ScheduleState
}

// TODO: refactor, filters should be receiving a much smaller snapshot of data

const ScheduleFilters = (props: Props) => {
  const {scheduleState, schedules} = props

  return (
    <Flex align="stretch" direction="column" padding={2}>
      <Stack space={2}>
        {SCHEDULE_STATES.map((filter) => (
          <ScheduleFilter
            count={schedules.filter((schedule) => schedule.state === filter).length}
            key={filter}
            selected={scheduleState === filter}
            state={filter}
          />
        ))}
      </Stack>
    </Flex>
  )
}

export default ScheduleFilters
