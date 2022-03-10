import {ScheduleState} from './types'

export const LOCAL_STORAGE_TZ_KEY = 'scheduled-publishing::time-zone'

export const SANITY_API_VERSION = '2022-02-02'

export type ScheduleFilterType = ScheduleState | 'errors'

export const SCHEDULE_FILTER_DICTIONARY: Record<ScheduleFilterType, string> = {
  scheduled: 'Upcoming',
  errors: 'Errors',
  succeeded: 'Completed',
  cancelled: 'Failed',
}

// Tool: denotes order of filter tags as well as accessible routes
export const SCHEDULE_FILTERS: ScheduleFilterType[] = Object.keys(
  SCHEDULE_FILTER_DICTIONARY
).filter((f): f is ScheduleFilterType => !!f)

export const TOOL_HEADER_HEIGHT = 55 // px
