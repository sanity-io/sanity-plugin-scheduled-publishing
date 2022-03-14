import {SanityProps} from './helper-types'
import React, {forwardRef, Ref, useMemo} from 'react'
import {NestedFormBuilder} from './NestedFormBuilder'
import {ObjectSchemaType} from '@sanity/types'
import usePollSchedules from '../../hooks/usePollSchedules'
import useTimeZone from '../../hooks/useTimeZone'
import formatDateTz from '../../utils/formatDateTz'
import {Badge, Box, Card, Flex, Stack, Text} from '@sanity/ui'
import {usePublishedId} from '../../hooks/usePublishedId'
import {useValidationState} from '../../utils/validation-utils'
import {ValidationInfo} from '../validation/ValidationInfo'

export const scheduledMarkerFieldName = 'hasScheduleWrapper'
export const validationMarkerField = '_validationError'

export const ScheduledDocumentInput = forwardRef(function ScheduledDocumentInput(
  props: SanityProps<{_id?: string; [validationMarkerField]?: boolean}>,
  ref: Ref<any>
) {
  if (props.type.jsonType !== 'object') {
    throw new Error(`jsonType of schema must be object, but was ${props.type.jsonType}`)
  }

  const type = useTypeWithMarkerField(props.type)
  const {value, markers} = props
  const id = value?._id
  const publishedId = usePublishedId(id)
  const formattedDateTime = useNextSchedule(publishedId)

  const {hasError} = useValidationState(markers)
  return (
    <>
      {formattedDateTime && (
        <Box marginBottom={4}>
          <Card padding={3} shadow={1} tone={hasError ? 'critical' : 'primary'}>
            <Stack space={3}>
              <Flex gap={2} align="center">
                <Badge>Scheduled</Badge>
                {hasError && (
                  <Card tone="critical" style={{background: 'none'}}>
                    <Flex gap={2} align="center">
                      <Box>
                        <Text size={2} accent>
                          <ValidationInfo markers={markers} type={type} documentId={publishedId} />
                        </Text>
                      </Box>
                      <Box>
                        <Text>Please attend to validation issues before the scheduled time.</Text>
                      </Box>
                    </Flex>
                  </Card>
                )}
              </Flex>

              <Box>This document will be published {formattedDateTime}</Box>
            </Stack>
          </Card>
        </Box>
      )}
      <NestedFormBuilder {...props} ref={ref} type={type} />
    </>
  )
})

function useNextSchedule(id?: string) {
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

function useTypeWithMarkerField(type: ObjectSchemaType): ObjectSchemaType {
  const t = {
    ...type,
    [scheduledMarkerFieldName]: true,
  }
  const typeOfType =
    'type' in type && type.type ? useTypeWithMarkerField(type.type as ObjectSchemaType) : undefined
  return {
    ...t,
    type: typeOfType,
  }
}
