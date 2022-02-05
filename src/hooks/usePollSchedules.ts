import axios from 'axios'
import useSWR from 'swr'
import client from '../client'
import {Schedule, ScheduleState} from '../types'

// @ts-expect-error
const {dataset, projectId, url} = client.config()
const scheduleBaseUrl = `${url}/schedules/${projectId}/${dataset}`

type QueryKey = {
  params?: {
    documentIds?: string
    state?: ScheduleState
  }
  url: string
}

const fetcher = (queryKey: QueryKey) =>
  axios
    .get<Schedule[]>(queryKey.url, {
      params: queryKey.params,
      withCredentials: true,
    })
    .then((response) => response.data)

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
  const queryKey: QueryKey = {
    params: {
      documentIds: documentId,
      state,
    },
    url: scheduleBaseUrl,
  }

  const {data, error} = useSWR(queryKey, fetcher, SWR_OPTIONS)

  return {
    error,
    isLoading: !error && !data,
    schedules: data || [],
  }
}

export default usePollSchedules
