import {InfoOutlineIcon} from '@sanity/icons'
import {Box, Stack, Text} from '@sanity/ui'
import React from 'react'
import {Schedule} from '../types'
import Callout from './Callout'
import ScheduleItemDocument from './ScheduleItemDocument'

interface Props {
  publishWarning?: boolean
  schedules: Schedule[]
}

const DialogScheduleListContent = (props: Props) => {
  const {publishWarning, schedules} = props

  return (
    <Stack space={4}>
      {schedules.length === 0 ? (
        <Box>
          <Text size={1}>No schedules</Text>
        </Box>
      ) : (
        <Stack space={2}>
          {schedules.map((schedule) => (
            <ScheduleItemDocument key={schedule.id} schedule={schedule} />
          ))}
        </Stack>
      )}
      {publishWarning && (
        <Callout
          description="Publishing this document may conflict with the above schedules."
          icon={InfoOutlineIcon}
          title="This document has been scheduled for publishing."
          tone="caution"
        />
      )}
    </Stack>
  )
}

export default DialogScheduleListContent
