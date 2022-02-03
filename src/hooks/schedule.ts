import useSWR from 'swr'
import client, {dataset, projectId} from '../client'
import {Schedule, ScheduleState} from '../types'

interface FetcherOptions {
  query: Record<string, string>
  uri: string
}

const fetcher = ({query, uri}: FetcherOptions) => client.request({query, uri})

const SWR_OPTIONS = {
  refreshInterval: 5000,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
}

// TODO: correctly type SWR errors

/**
 * Poll for individual schedule
 */
function useSchedule({scheduleId}: {scheduleId: string}): {
  error: any
  isLoading: boolean
  schedule: Schedule | undefined
} {
  const queryKey = {
    uri: `/schedules/${projectId}/${dataset}/${scheduleId}`,
  }

  const {data, error} = useSWR<Schedule>(queryKey, fetcher, SWR_OPTIONS)

  return {
    error,
    isLoading: !error && !data,
    schedule: data,
  }
}

/**
 * Poll for all schedules
 */
function useSchedules({documentId, state}: {documentId?: string; state?: ScheduleState} = {}): {
  error: any
  isLoading: boolean
  schedules: Schedule[]
} {
  const queryKey = {
    query: {
      documentIds: documentId,
      state,
    },
    uri: `/schedules/${projectId}/${dataset}`,
  }

  const {data, error} = useSWR<Schedule[]>(queryKey, fetcher, SWR_OPTIONS)

  return {
    error,
    isLoading: !error && !data,
    schedules: data || [],
  }
}

export {useSchedules}
