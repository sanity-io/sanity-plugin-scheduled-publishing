import {ScheduleState} from './types'

export const LOCAL_STORAGE_TZ_KEY = 'scheduled-publishing::time-zone'

export const SANITY_API_VERSION = '2022-02-02'

export const SCHEDULE_FILTER_DICTIONARY: Record<ScheduleState, string> = {
  scheduled: 'Upcoming',
  succeeded: 'Completed',
  cancelled: 'Failed',
}

// Tool: denotes order of filter tags as well as accessible routes
export const SCHEDULE_FILTERS: ScheduleState[] = Object.keys(SCHEDULE_FILTER_DICTIONARY).filter(
  (f): f is ScheduleState => !!f
)

export const TOOL_HEADER_HEIGHT = 55 // px

export const DOCUMENT_HAS_WARNINGS_TEXT = 'This document has validation warnings.'
export const DOCUMENT_HAS_ERRORS_TEXT =
  'This document has validation errors that should be resolved before its publish date.'
