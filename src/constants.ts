import {ScheduleState} from './types'

export const LOCAL_STORAGE_TZ_KEY = 'scheduled-publishing::time-zone'

export const SANITY_API_VERSION = '2022-02-02'

export const SCHEDULE_FILTER_DICTIONARY: Record<ScheduleState, string> = {
  cancelled: 'Failed',
  scheduled: 'Upcoming',
  succeeded: 'Completed',
}

// Tool: denotes order of filter tags as well as accessible routes
export const SCHEDULE_STATES: ScheduleState[] = ['scheduled', 'succeeded', 'cancelled']

export const TOOL_HEADER_HEIGHT = 55 // px
