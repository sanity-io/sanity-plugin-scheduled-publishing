import {Schedule, ValidationStatus} from '../../types'
import {getScheduledDocumentId} from '../../utils/paneItemHelpers'
import {useScheduleSchemaType} from '../../hooks/useSchemaType'
import {useValidationStatus} from '@sanity/react-hooks'
import React, {useEffect} from 'react'

interface Props {
  schedule: Schedule
  updateValidation: (status: ValidationStatus) => void
}

/**
 * useValidationStatus requires a published id, and we dont always have that
 *
 * This a boilerplate wrapper component around it,
 * so we conditionally call back with updated status whenver it is possible.
 * */
export function ValidateScheduleDoc({schedule, updateValidation}: Props) {
  const schemaType = useScheduleSchemaType(schedule)
  const id = getScheduledDocumentId(schedule)

  if (!id || !schemaType?.name) {
    return null
  }
  return (
    <ValidationRunner id={id} schemaName={schemaType.name} updateValidation={updateValidation} />
  )
}

function ValidationRunner({
  id,
  schemaName,
  updateValidation,
}: {
  id: string
  schemaName: string
  updateValidation: (status: ValidationStatus) => void
}) {
  const validationStatus = useValidationStatus(id, schemaName)

  useEffect(() => {
    if (!validationStatus.isValidating) {
      updateValidation(validationStatus)
    }
  }, [validationStatus])

  return null
}
