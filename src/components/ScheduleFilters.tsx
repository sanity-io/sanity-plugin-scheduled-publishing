import {Flex, Stack} from '@sanity/ui'
import React from 'react'
import ScheduleFilter from './ScheduleFilter'

const ScheduleFilters = () => {
  return (
    <Flex align="stretch" direction="column" padding={2}>
      <Stack space={2}>
        <ScheduleFilter id="upcoming" selected />
        <ScheduleFilter id="completed" />
        <ScheduleFilter id="failed" />
      </Stack>
    </Flex>
  )
}

export default ScheduleFilters
