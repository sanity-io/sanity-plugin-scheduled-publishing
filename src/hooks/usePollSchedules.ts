import {useCallback, useEffect} from 'react'
import useSWR from 'swr'
import {getSanityClient} from '../lib/client'
import {Schedule, ScheduleState} from '../types'
import getScheduleBaseUrl from '../utils/getScheduleBaseUrl'
import {
  ScheduleDeleteEvent,
  ScheduleDeleteMultipleEvent,
  ScheduleEvents,
  SchedulePublishEvent,
  ScheduleUpdateEvent,
} from './useScheduleOperation'

type QueryKey = {
  params?: {
    documentIds?: string
    state?: ScheduleState
  }
  url: string
}

const fetcher = (queryKey: QueryKey) =>
  getSanityClient().request<{schedules: Schedule[] | undefined}>({
    query: queryKey.params,
    method: 'GET',
    uri: queryKey.url,
  })

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
    url: getScheduleBaseUrl(),
  }

  const {data, error, mutate} = useSWR(queryKey, fetcher, SWR_OPTIONS)

  // Immediately remove schedule from SWR cache and revalidate
  const handleDelete = useCallback(
    (event: CustomEvent<ScheduleDeleteEvent>) => {
      mutate(
        (currentData) => ({
          schedules: currentData?.schedules?.filter(
            (schedule) => schedule.id !== event.detail.scheduleId
          ),
        }),
        true // revalidate SWR
      )
    },
    [mutate]
  )

  // Immediately remove schedules from SWR cache and revalidate
  const handleDeleteMultiple = useCallback(
    (event: CustomEvent<ScheduleDeleteMultipleEvent>) => {
      mutate(
        (currentData) => ({
          schedules: currentData?.schedules?.filter(
            (schedule) => !event.detail.scheduleIds.includes(schedule.id)
          ),
        }),
        true // revalidate SWR
      )
    },
    [mutate]
  )

  // Immediately publish schedule in SWR cache and revalidate
  const handlePublish = useCallback(
    (event: CustomEvent<SchedulePublishEvent>) => {
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
                executeAt: new Date().toISOString(),
                state: 'succeeded',
              },
              ...currentSchedules?.slice(index + 1),
            ],
          }
        },
        true // revalidate SWR
      )
    },
    [mutate]
  )

  // Immediately update schedule in SWR cache and revalidate
  const handleUpdate = useCallback(
    (event: CustomEvent<ScheduleUpdateEvent>) => {
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
    },
    [mutate]
  )

  // Listen to schedule events
  useEffect(() => {
    window.addEventListener(ScheduleEvents.delete, handleDelete)
    window.addEventListener(ScheduleEvents.deleteMultiple, handleDeleteMultiple)
    window.addEventListener(ScheduleEvents.publish, handlePublish)
    window.addEventListener(ScheduleEvents.update, handleUpdate)
    return () => {
      window.removeEventListener(ScheduleEvents.delete, handleDelete)
      window.removeEventListener(ScheduleEvents.deleteMultiple, handleDeleteMultiple)
      window.removeEventListener(ScheduleEvents.publish, handlePublish)
      window.removeEventListener(ScheduleEvents.update, handleUpdate)
    }
  }, [handleDelete, handleDeleteMultiple, handlePublish, handleUpdate])

  return {
    error,
    isInitialLoading: !error && !data,
    schedules: data?.schedules || NO_SCHEDULES,
  }
}

export default usePollSchedules
