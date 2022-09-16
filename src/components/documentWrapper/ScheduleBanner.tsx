import {CalendarIcon} from '@sanity/icons'
import {Marker, SchemaType} from '@sanity/types'
import {Badge, Box, Card, Flex, Stack, Text} from '@sanity/ui'
import {format} from 'date-fns'
import React, {useMemo} from 'react'
import {DATE_FORMAT} from '../../constants'
import usePollSchedules from '../../hooks/usePollSchedules'
import {usePublishedId} from '../../hooks/usePublishedId'
import {useValidationState} from '../../utils/validationUtils'
import {ValidationInfo} from '../validation/ValidationInfo'

interface Props {
  id: string
  markers: Marker[]
  type: SchemaType
}

export function ScheduleBanner(props: Props) {
  const {id, markers, type} = props
  const publishedId = usePublishedId(id)
  const {hasError} = useValidationState(markers)
  const {formattedDateTime, action} = useNextSchedule(publishedId)

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
        tone={hasError ? 'critical' : `${action === 'publish' ? 'primary' : 'caution'}`}
      >
        <Stack space={2}>
          <Flex>
            <Badge fontSize={1} mode="outline" padding={2} style={{flexShrink: 0}}>
              {hasError
                ? 'Scheduled (with errors)'
                : `${action === 'publish' ? 'Scheduled' : `Scheduled Unpublish`}`}
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
              {hasError
                ? 'Publishing with errors on'
                : `Scheduled to ${action === 'publish' ? `Publish` : `Unpublish`} on`}{' '}
              <span style={{fontWeight: 500}}>{formattedDateTime}</span> (local time)
            </Text>
          </Flex>
        </Stack>
      </Card>
    </Box>
  )
}

function useNextSchedule(id: string): {
  formattedDateTime?: string
  action?: string
} {
  const {schedules} = usePollSchedules({documentId: id, state: 'scheduled'})

  return useMemo(() => {
    const upcomingSchedule = schedules?.[0]

    if (!upcomingSchedule || !upcomingSchedule.executeAt) {
      return {}
    }
    return {
      formattedDateTime: format(new Date(upcomingSchedule.executeAt), DATE_FORMAT.LARGE),
      action: upcomingSchedule.action,
    }
  }, [schedules])
}
