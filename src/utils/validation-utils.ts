import {Schedule, ScheduledDocValidations, ValidationStatus} from '../types'
import {useMemo} from 'react'
import {isValidationErrorMarker, isValidationWarningMarker} from '@sanity/types'
import {ButtonTone} from '@sanity/ui'

export const EMPTY_VALIDATION_STATUS: ValidationStatus = {
  markers: [],
  isValidating: false,
}

export function getValidationStatus(
  schedule: Schedule,
  validations: ScheduledDocValidations
): ValidationStatus {
  return validations[schedule.id] ?? EMPTY_VALIDATION_STATUS
}

interface ValidationState {
  validationStatus: ValidationStatus
  validationTone: ButtonTone
  hasError: boolean
  hasWarning: boolean
}

export function getValidationState(validationStatus: ValidationStatus): ValidationState {
  const markers = validationStatus.markers
  const validationMarkers = markers.filter((marker) => marker.type === 'validation')

  const hasError = validationMarkers.filter(isValidationErrorMarker).length > 0
  const hasWarning = validationMarkers.filter(isValidationWarningMarker).length > 0

  let validationTone: ButtonTone = 'default'
  if (hasWarning) {
    validationTone = 'default' //not using 'caution' for now
  }
  if (hasError) {
    validationTone = 'critical'
  }

  return {
    validationStatus,
    validationTone,
    hasError,
    hasWarning,
  }
}

export function useValidationState(validationStatus: ValidationStatus): ValidationState {
  return useMemo(() => getValidationState(validationStatus), [validationStatus])
}
