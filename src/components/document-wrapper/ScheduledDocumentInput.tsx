import {SanityProps} from './helper-types'
import React, {forwardRef, Ref, useMemo} from 'react'
import {NestedFormBuilder} from './NestedFormBuilder'
import {ObjectSchemaType} from '@sanity/types'
import usePollSchedules from '../../hooks/usePollSchedules'
import useTimeZone from '../../hooks/useTimeZone'
import formatDateTz from '../../utils/formatDateTz'
import {Badge, Box, Card, Stack} from '@sanity/ui'

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

  const id = props.value?._id
  const docId = useMemo(() => (id ? id.replaceAll('drafts.', '') : undefined), [id])
  const formattedDateTime = useNextSchedule(docId)

  const hasError = useMemo(() => props.markers.some((m) => m.level === 'error'), [props.markers])

  return (
    <>
      {formattedDateTime && (
        <Box marginBottom={4}>
          <Card padding={2} shadow={1} tone={hasError ? 'critical' : 'positive'}>
            <Stack space={2}>
              <Box>
                <Badge>Publish schedule</Badge>
              </Box>
              <Box>{formattedDateTime}</Box>
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
