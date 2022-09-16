import {Marker} from '@sanity/types'

export interface NormalizedTimeZone {
  abbreviation: string
  alternativeName: string
  mainCities: string
  name: string
  namePretty: string
  offset: string
  value: string
}

export interface Schedule {
  author: string
  action: string
  createdAt: string
  dataset: string
  description: string
  documents: {
    documentId: string
    documentType?: string
  }[]
  executeAt: string | null
  executedAt?: string
  id: string
  name: string
  projectId: string
  state: ScheduleState
  stateReason: string
}

export interface ScheduleFilter {
  state: ScheduleState
  title: string
}

export interface ScheduleFormData {
  date: string
}

export type ScheduleSort = 'createdAt' | 'executeAt'

export type ScheduleState = 'cancelled' | 'scheduled' | 'succeeded'

export interface ValidationStatus {
  isValidating: boolean
  markers: Marker[]
}

/**
 * key is schedule.id, NOT documentId
 */
export type ScheduledDocValidations = Record<string, ValidationStatus>
