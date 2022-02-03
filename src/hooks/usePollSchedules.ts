import useSWR from 'swr'
import client, {dataset, projectId} from '../client'
import {Schedule, ScheduleState} from '../types'

const fetcher = ({query, uri}: {query: Record<string, string>; uri: string}) =>
  client.request({query, uri})

const SWR_OPTIONS = {
  refreshInterval: 5000,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
}

// TODO: correctly type SWR errors

/**
 * Poll for all schedules
 */
function usePollSchedules({documentId, state}: {documentId?: string; state?: ScheduleState} = {}): {
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

export default usePollSchedules
