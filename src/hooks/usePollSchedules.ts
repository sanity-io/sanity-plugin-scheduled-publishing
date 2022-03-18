import axios from 'axios'
import {useCallback, useEffect} from 'react'
import useSWR from 'swr'
import client from '../client'
import {Schedule, ScheduleState} from '../types'
import {
  ScheduleDeleteEvent,
  ScheduleDeleteMultipleEvent,
  ScheduleEvents,
  ScheduleUpdateEvent,
} from './useScheduleOperation'

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
    .get<{schedules: Schedule[] | undefined}>(queryKey.url, {
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

const NO_SCHEDULES: Schedule[] = []

/**
 * Poll for all schedules
 */
function usePollSchedules({documentId, state}: {documentId?: string; state?: ScheduleState} = {}): {
  error: Error
  isInitialLoading: boolean
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
      (currentData) => ({
        schedules: currentData?.schedules?.filter(
          (schedule) => schedule.id !== event.detail.scheduleId
        ),
      }),
      true // revalidate SWR
    )
  }, [])

  // Immediately remove schedules from SWR cache and revalidate
  const handleDeleteMultiple = useCallback((event: CustomEvent<ScheduleDeleteMultipleEvent>) => {
    mutate(
      (currentData) => ({
        schedules: currentData?.schedules?.filter(
          (schedule) => !event.detail.scheduleIds.includes(schedule.id)
        ),
      }),
      true // revalidate SWR
    )
  }, [])

  // Immediately update schedule in SWR cache and revalidate
  const handleUpdate = useCallback((event: CustomEvent<ScheduleUpdateEvent>) => {
    mutate(
      (currentData) => {
        const currentSchedules = currentData?.schedules || []
        const index = currentSchedules.findIndex(
          (schedule) => schedule.id === event.detail.scheduleId
        )
        return {
          schedules: [
            ...currentSchedules?.slice(0, index),
            {
              ...currentSchedules[index],
              executeAt: event.detail.date,
            },
            ...currentSchedules?.slice(index + 1),
          ],
        }
      },
      true // revalidate SWR
    )
  }, [])

  // Listen to schedule events
  useEffect(() => {
    window.addEventListener(ScheduleEvents.delete, handleDelete)
    window.addEventListener(ScheduleEvents.deleteMultiple, handleDeleteMultiple)
    window.addEventListener(ScheduleEvents.update, handleUpdate)
    return () => {
      window.removeEventListener(ScheduleEvents.delete, handleDelete)
      window.removeEventListener(ScheduleEvents.deleteMultiple, handleDeleteMultiple)
      window.removeEventListener(ScheduleEvents.update, handleUpdate)
    }
  }, [])

  return {
    error,
    isInitialLoading: !error && !data,
    schedules: data?.schedules || NO_SCHEDULES,
  }
}

export default usePollSchedules
