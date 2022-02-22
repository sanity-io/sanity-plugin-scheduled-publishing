import {Card, Flex, Heading, Stack, Text} from '@sanity/ui'
import React from 'react'
import {ScheduleState} from '../types'
import BigIconComingSoon from './BigIconComingSoon'
import BigIconSuccess from './BigIconSuccess'
import BigIconScreen from './BigIconScreen'

interface Props {
  scheduleState: ScheduleState
}

const CardEmptySchedules = (props: Props) => {
  const {scheduleState} = props

  let BigIcon
  let description
  let heading
  switch (scheduleState) {
    case 'succeeded': {
      description =
        'When a scheduled document is successfully published it moves to this list view.'
      heading = 'No completed scheduled publications ... yet'
      BigIcon = BigIconComingSoon
      break
    }
    case 'cancelled': {
      description = `When a scheduled publication fails because it's document is deleted, or by other errors, they show up here.`
      heading = 'No failed scheduled publications'
      BigIcon = BigIconSuccess
      break
    }
    case 'scheduled': {
      description =
        'When editing a document, create a new scheduled publication from the menu next to the Publish button.'
      heading = 'No upcoming scheduled publications'
      BigIcon = BigIconScreen
      break
    }
    default: {
      throw new Error(`Unhandled scheduleState: ${scheduleState}`)
    }
  }

  return (
    <Card paddingX={6} paddingY={8} radius={2} shadow={1}>
      <Stack space={4}>
        <Flex justify="center">
          <BigIcon />
        </Flex>
        <Stack space={4}>
          <Heading align="center" size={1}>
            {heading}
          </Heading>
          <Text align="center" size={1}>
            {description}
          </Text>
        </Stack>
      </Stack>
    </Card>
  )
}

export default CardEmptySchedules
