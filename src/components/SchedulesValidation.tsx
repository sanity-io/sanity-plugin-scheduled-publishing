import {Schedule, ValidationStatus} from '../types'
import {getScheduledDocumentId} from '../utils/paneItemHelpers'
import {useSchemaType} from '../hooks/useSchemaType'
import {useValidationStatus} from '@sanity/react-hooks'
import React, {useEffect} from 'react'

interface Props {
  schedules: Schedule[]
  updateValidation: UpdateValidation
}

export type UpdateValidation = (schedule: Schedule, validationStatus: ValidationStatus) => void

export function SchedulesValidation(props: Props) {
  const {schedules, updateValidation} = props

  return (
    <>
      {schedules.map((schedule) => (
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
  const id = getScheduledDocumentId(schedule)
  if (!id) {
    return null
  }
  return <ValidationRunner id={id} schedule={schedule} updateValidation={updateValidation} />
}

function ValidationRunner({
  id,
  schedule,
  updateValidation,
}: {
  id: string
  schedule: Schedule
  updateValidation: UpdateValidation
}) {
  const schemaType = useSchemaType(schedule)
  const validationStatus = useValidationStatus(id, schemaType.name)

  useEffect(() => {
    if (!validationStatus.isValidating) {
      updateValidation(schedule, validationStatus)
    }
  }, [schedule, validationStatus])

  return null
}
