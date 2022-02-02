import type {DocumentActionProps} from '@sanity/base'
import {InfoOutlineIcon} from '@sanity/icons'
import {Box, Card, Flex, Stack, Text} from '@sanity/ui'
import React from 'react'
import {DocumentSchedule} from '../types'
import SchedulePill from './SchedulePill'

interface Props extends DocumentActionProps {
  schedules: DocumentSchedule[]
}

const DialogPublishContent = (props: Props) => {
  const {schedules} = props

  return (
    <div>
      <Stack space={4}>
        <Box marginTop={3}>
          <Text size={2} weight="medium">
            Current schedule
          </Text>
        </Box>

        {/* Existing schedules */}
        <Stack space={2}>
          {schedules.map((schedule) => (
            <SchedulePill key={schedule.id} schedule={schedule} />
          ))}
        </Stack>

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
    </div>
  )
}

export default DialogPublishContent
