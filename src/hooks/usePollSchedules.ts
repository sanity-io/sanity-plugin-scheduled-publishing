import axios from 'axios'
import {useCallback, useEffect} from 'react'
import useSWR from 'swr'
import client from '../client'
import {Schedule, ScheduleState} from '../types'
import {ScheduleDeleteEvent, ScheduleEvents, ScheduleUpdateEvent} from './useScheduleOperation'

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
  refreshInterval: 10000, // 10s
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  shouldRetryOnError: false,
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

  const {data, error, mutate} = useSWR(queryKey, fetcher, SWR_OPTIONS)

  // Immediately remove schedule from SWR cache and revalidate
  const handleDelete = useCallback((event: CustomEvent<ScheduleDeleteEvent>) => {
    mutate(
      (schedules) => schedules?.filter((schedule) => schedule.id !== event.detail.scheduleId),
      true // revalidate SWR
    )
  }, [])

  // Immediately update schedule in SWR cache and revalidate
  const handleUpdate = useCallback((event: CustomEvent<ScheduleUpdateEvent>) => {
    mutate(
      (schedules = []) => {
        const index = schedules?.findIndex((schedule) => schedule.id === event.detail.scheduleId)
        return [
          ...schedules?.slice(0, index),
          {
            ...schedules[index],
            executeAt: event.detail.date,
          },
          ...schedules?.slice(index + 1),
        ]
      },
      true // revalidate SWR
    )
  }, [])

  // Listen to schedule events
  useEffect(() => {
    window.addEventListener(ScheduleEvents.delete, handleDelete)
    window.addEventListener(ScheduleEvents.update, handleUpdate)
    return () => {
      window.removeEventListener(ScheduleEvents.delete, handleDelete)
      window.removeEventListener(ScheduleEvents.update, handleUpdate)
    }
  }, [])

  return {
    error,
    isLoading: !error && !data,
    schedules: data || [],
  }
}

export default usePollSchedules
