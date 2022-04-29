import {BadgeTone} from '@sanity/ui'
import {ScheduleState} from './types'

export const LOCAL_STORAGE_TZ_KEY = 'scheduled-publishing::time-zone'

export const SANITY_API_VERSION = '2022-02-02'

export const SCHEDULE_STATE_DICTIONARY: Record<
  ScheduleState,
  {
    badgeTone: BadgeTone
    title: string
  }
> = {
  scheduled: {
    badgeTone: 'primary',
    title: 'Upcoming',
  },
  succeeded: {
    badgeTone: 'default',
    title: 'Completed',
  },
  cancelled: {
    badgeTone: 'critical',
    title: 'Failed',
  },
}

// Tool: denotes order of filter tags as well as accessible routes
export const SCHEDULE_FILTERS: ScheduleState[] = Object.keys(SCHEDULE_STATE_DICTIONARY).filter(
  (f): f is ScheduleState => !!f
)

export const TOOL_HEADER_HEIGHT = 55 // px

export const DOCUMENT_HAS_WARNINGS_TEXT = 'This document has validation warnings.'
export const DOCUMENT_HAS_ERRORS_TEXT =
  'This document has validation errors that should be resolved before its publish date.'

export const SCHEDULE_FAILED_TEXT = 'This schedule failed to run.'

// Text displayed in toasts on any 403 Forbidden request
// (usually if a project doesn't have access to the Scheduled Publishing feature)
export const FORBIDDEN_RESPONSE_TEXT =
  'Forbidden. Please check that your project has access to Scheduled Publishing.'

// date-fns compatible date formats
// https://date-fns.org/v2.28.0/docs/format
export const DATE_FORMAT = {
  // 1 Oct 22, 10:00 PM
  SMALL: `d MMM yy',' p`,
  // 1 October 2022, 10:00 PM
  MEDIUM: `d MMMM yyyy',' p`,
  // Saturday, 1 October 2022, 10:00 PM
  LARGE: `iiii',' d MMMM yyyy',' p`,
}
