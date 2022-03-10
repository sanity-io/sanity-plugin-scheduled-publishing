import {SanityProps} from './helper-types'
import React, {forwardRef, Ref, useMemo, useState} from 'react'
import {NestedFormBuilder} from './NestedFormBuilder'
import {ObjectSchemaType} from '@sanity/types'
import usePollSchedules from '../../hooks/usePollSchedules'
import useTimeZone from '../../hooks/useTimeZone'
import formatDateTz from '../../utils/formatDateTz'
import {Badge, Box, Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {EditIcon, ErrorOutlineIcon} from '@sanity/icons'

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

  const [editScheduled, setEditScheduled] = useState(false)
  const readOnly = props.readOnly || (!!formattedDateTime && !editScheduled)
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

              {hasError && (
                <Card shadow={1} padding={4}>
                  <Flex gap={2} justify="center" align="center">
                    <Text size={2}>
                      <ErrorOutlineIcon color="red" />
                    </Text>
                    <Text>Validation errors that should be fixed before the scheduled time!</Text>
                  </Flex>
                </Card>
              )}

              {!editScheduled && (
                <Flex flex={1} justify="center" marginTop={2}>
                  <Button
                    icon={EditIcon}
                    text={'Enable editing'}
                    style={{width: '100%'}}
                    onClick={() => setEditScheduled(true)}
                  />
                </Flex>
              )}
            </Stack>
          </Card>
        </Box>
      )}
      <NestedFormBuilder {...props} ref={ref} type={type} readOnly={readOnly} />
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
