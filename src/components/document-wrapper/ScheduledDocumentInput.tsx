import {SanityProps} from './helper-types'
import React, {forwardRef, Ref, useCallback, useMemo, useState} from 'react'
import {NestedFormBuilder} from './NestedFormBuilder'
import {ObjectSchemaType} from '@sanity/types'
import usePollSchedules from '../../hooks/usePollSchedules'
import useTimeZone from '../../hooks/useTimeZone'
import formatDateTz from '../../utils/formatDateTz'
import {Badge, Box, Card, Flex, Stack, Switch} from '@sanity/ui'
import {useId} from '@reach/auto-id'
import {FormFieldHeaderText} from '@sanity/base/components'

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
  const toggleEdit = useCallback(() => setEditScheduled((current) => !current), [setEditScheduled])

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

              <Box marginTop={2}>
                <EnableEditing enabled={editScheduled} onClick={toggleEdit} hasError={hasError} />
              </Box>
            </Stack>
          </Card>
        </Box>
      )}
      <NestedFormBuilder {...props} ref={ref} type={type} readOnly={readOnly} />
    </>
  )
})

function EnableEditing({
  enabled,
  onClick,
  hasError,
}: {
  enabled: boolean
  onClick: () => void
  hasError: boolean
}) {
  const inputId = useId()
  return (
    <Card border radius={1} flex={1} padding={2}>
      <Flex align="center" gap={2}>
        <Box>
          <Switch id={inputId} checked={enabled} onChange={onClick} />
        </Box>
        <Box flex={1} paddingY={3}>
          <FormFieldHeaderText
            title="Enable editing"
            description={
              hasError ? (
                <>
                  <strong>This document has errors.</strong>
                  <br />
                  It will still be published according to schedule. Correcting these errors is
                  strongly recommended.
                </>
              ) : (
                'This draft will be published according to schedule. Any changes made will be part of the published document.'
              )
            }
            inputId={inputId}
          />
        </Box>
      </Flex>
    </Card>
  )
}

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
