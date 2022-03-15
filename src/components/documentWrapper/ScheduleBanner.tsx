import {Badge, Box, Card, Flex, Stack, Text} from '@sanity/ui'
import {ValidationInfo} from '../validation/ValidationInfo'
import React, {useMemo} from 'react'
import usePollSchedules from '../../hooks/usePollSchedules'
import useTimeZone from '../../hooks/useTimeZone'
import formatDateTz from '../../utils/formatDateTz'
import {usePublishedId} from '../../hooks/usePublishedId'
import {useValidationState} from '../../utils/validationUtils'
import {Marker, SchemaType} from '@sanity/types'
import {CalendarIcon} from '@sanity/icons'

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
        paddingBottom={2}
        paddingTop={3}
        paddingX={3}
        radius={1}
        shadow={1}
        tone={hasError ? 'critical' : 'primary'}
      >
        <Stack space={2}>
          <Flex>
            <Badge fontSize={1} mode="outline" padding={2} style={{flexShrink: 0}}>
              {hasError ? 'Scheduled (with errors)' : 'Scheduled'}
            </Badge>
          </Flex>

          <Flex align="center" gap={1}>
            {hasError ? (
              <ValidationInfo markers={markers} type={type} documentId={publishedId} />
            ) : (
              <Box padding={3}>
                <Text muted>
                  <CalendarIcon />
                </Text>
              </Box>
            )}
            <Text muted size={1}>
              {hasError ? 'Publishing with errors on' : 'Scheduled to publish on'}{' '}
              <span style={{fontWeight: 500}}>{formattedDateTime}</span> (local time)
            </Text>
          </Flex>
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
      includeTimeZone: false,
      timeZone,
    })
  }, [schedules, timeZone])
}
