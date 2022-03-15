import {Badge, Box, Card, Flex, Stack, Text} from '@sanity/ui'
import {ValidationInfo} from '../validation/ValidationInfo'
import React, {useMemo} from 'react'
import usePollSchedules from '../../hooks/usePollSchedules'
import useTimeZone from '../../hooks/useTimeZone'
import formatDateTz from '../../utils/formatDateTz'
import {usePublishedId} from '../../hooks/usePublishedId'
import {useValidationState} from '../../utils/validationUtils'
import {Marker, SchemaType} from '@sanity/types'

interface Props {
  id: string
  markers: Marker[]
  type: SchemaType
}

export function ScheduleBanner(props: Props) {
  const {id, markers, type} = props
  const publishedId = usePublishedId(id)
  const {hasError} = useValidationState(markers)
  const formattedDateTime = useNextSchedule(publishedId)

  if (!formattedDateTime) {
    return null
  }

  return (
    <Box marginBottom={4}>
      <Card
        padding={3}
        paddingTop={2}
        radius={1}
        shadow={1}
        tone={hasError ? 'critical' : 'primary'}
      >
        <Stack space={3}>
          <Flex gap={2} align="center">
            <Badge fontSize={1} style={{flexShrink: 0}}>
              Scheduled
            </Badge>
            <Flex gap={1} align="center">
              <Text style={{flexShrink: 0}}>
                <ValidationInfo markers={markers} type={type} documentId={publishedId} />
              </Text>
              {hasError && (
                <Box>
                  <Text muted textOverflow="ellipsis" size={1}>
                    Please attend to validation issues before the scheduled time.
                  </Text>
                </Box>
              )}
            </Flex>
          </Flex>

          <Box marginBottom={1}>
            <Text size={1}>
              This document will be published{' '}
              <span style={{fontWeight: 500}}>{formattedDateTime}</span>
            </Text>
          </Box>
        </Stack>
      </Card>
    </Box>
  )
}

function useNextSchedule(id: string) {
  const {schedules} = usePollSchedules({documentId: id, state: 'scheduled'})
  const {timeZone} = useTimeZone()

  return useMemo(() => {
    const upcomingSchedule = schedules?.[0]

    if (!upcomingSchedule) {
      return undefined
    }
    return formatDateTz({
      date: upcomingSchedule.executeAt,
      includeTimeZone: true,
      timeZone,
    })
  }, [schedules, timeZone])
}
