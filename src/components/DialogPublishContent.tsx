import type {DocumentActionProps} from '@sanity/base'
import {InfoOutlineIcon} from '@sanity/icons'
import {Box, Card, Flex, Stack, Text} from '@sanity/ui'
import React from 'react'
import {Schedule} from '../types'
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
        <Box padding={2}>
          <Text size={1}>No schedules</Text>
        </Box>
      ) : (
        <Stack space={2}>
          {schedules.map((schedule) => (
            <ScheduleItemMini key={schedule.id} onComplete={onComplete} schedule={schedule} />
          ))}
        </Stack>
      )}

      <Card padding={4} radius={2} shadow={1} tone="caution">
        <Flex>
          <Text size={2}>
            <InfoOutlineIcon />
          </Text>
          <Stack marginLeft={3} space={2}>
            <Text size={1} weight="semibold">
              This document has been scheduled for publishing.
            </Text>
            <Text size={1}>Publishing this document may conflict with the above schedules.</Text>
          </Stack>
        </Flex>
      </Card>
    </Stack>
  )
}

export default DialogPublishContent
