import type {DocumentActionProps} from '@sanity/base'
import {InfoOutlineIcon} from '@sanity/icons'
import {Box, Stack, Text} from '@sanity/ui'
import React from 'react'
import {Schedule} from '../types'
import Callout from './Callout'
import ScheduleItemMini from './ScheduleItemMini'

interface Props extends DocumentActionProps {
  schedules: Schedule[]
}

const DialogPublishContent = (props: Props) => {
  const {onComplete, schedules} = props

  return (
    <Stack space={4}>
      <Text size={2} weight="medium">
        Current schedule
      </Text>
      {schedules.length === 0 ? (
        <Box>
          <Text size={1}>No schedules</Text>
        </Box>
      ) : (
        <Stack space={2}>
          {schedules.map((schedule) => (
            <ScheduleItemMini key={schedule.id} onComplete={onComplete} schedule={schedule} />
          ))}
        </Stack>
      )}

      <Callout
        description="Publishing this document may conflict with the above schedules."
        icon={InfoOutlineIcon}
        title="This document has been scheduled for publishing."
        tone="caution"
      />
    </Stack>
  )
}

export default DialogPublishContent
