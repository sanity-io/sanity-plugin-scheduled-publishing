import {Schedule, ScheduledDocValidations, ValidationStatus} from '../types'
import {useMemo} from 'react'
import {isValidationErrorMarker, isValidationWarningMarker} from '@sanity/types'
import {ButtonTone} from '@sanity/ui'
import {Marker} from '@sanity/types'

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
  markers: Marker[]
  validationTone: ButtonTone
  hasError: boolean
  hasWarning: boolean
}

export function getValidationState(markers: Marker[]): ValidationState {
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
    markers,
    validationTone,
    hasError,
    hasWarning,
  }
}

export function useValidationState(markers: Marker[]): ValidationState {
  return useMemo(() => getValidationState(markers), [markers])
}
