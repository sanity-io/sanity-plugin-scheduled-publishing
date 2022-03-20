import {useMemo} from 'react'
import {isValidationErrorMarker, isValidationWarningMarker} from '@sanity/types'
import {ButtonTone} from '@sanity/ui'
import {Marker} from '@sanity/types'
import {ValidationStatus} from '../types'

export const EMPTY_VALIDATION_STATUS: ValidationStatus = {
  markers: [],
  isValidating: false,
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
