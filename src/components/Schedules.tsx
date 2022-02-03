import {Box, Stack, Text} from '@sanity/ui'
import React from 'react'
import {Schedule} from '../types'
import SchedulePill from './SchedulePill'

interface Props {
  schedules: Schedule[]
}

const Schedules = (props: Props) => {
  const {schedules} = props

  return (
    <>
      {schedules.length === 0 ? (
        <Box padding={2}>
          <Text size={1}>No schedules</Text>
        </Box>
      ) : (
        <Stack space={2}>
          {schedules.map((schedule) => (
            <SchedulePill key={schedule.id} schedule={schedule} />
          ))}
        </Stack>
      )}
    </>
  )
}

export default Schedules
