import {Schedule, ValidationStatus} from '../../types'
import {getScheduledDocumentId} from '../../utils/paneItemHelpers'
import {useScheduleSchemaType} from '../../hooks/useSchemaType'
import {useValidationStatus} from '@sanity/react-hooks'
import React, {useEffect} from 'react'
import {useFilteredSchedules} from '../../hooks/useFilteredSchedules'

interface Props {
  schedules: Schedule[]
  updateValidation: UpdateValidation
}

export type UpdateValidation = (schedule: Schedule, validationStatus: ValidationStatus) => void

export function SchedulesValidation(props: Props) {
  const {schedules, updateValidation} = props
  const validatedSchedules = useFilteredSchedules(schedules, 'scheduled')
  return (
    <>
      {validatedSchedules.map((schedule) => (
        <ValidateScheduleDoc
          key={schedule.id}
          schedule={schedule}
          updateValidation={updateValidation}
        />
      ))}
    </>
  )
}

/**
 * useValidationStatus is sweet, but a hook, so this a boilerplate wrapper component around it,
 * so we get a callback when the hook returns new values
 * */
export function ValidateScheduleDoc({
  schedule,
  updateValidation,
}: {
  schedule: Schedule
  updateValidation: UpdateValidation
}) {
  const schemaType = useScheduleSchemaType(schedule)
  const id = getScheduledDocumentId(schedule)

  if (!id || !schemaType?.name) {
    return null
  }
  return (
    <ValidationRunner
      id={id}
      schedule={schedule}
      schemaName={schemaType.name}
      updateValidation={updateValidation}
    />
  )
}

function ValidationRunner({
  id,
  schedule,
  schemaName,
  updateValidation,
}: {
  id: string
  schedule: Schedule
  schemaName: string
  updateValidation: UpdateValidation
}) {
  const validationStatus = useValidationStatus(id, schemaName)

  useEffect(() => {
    if (!validationStatus.isValidating) {
      updateValidation(schedule, validationStatus)
    }
  }, [schedule, validationStatus])

  return null
}
