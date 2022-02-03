import useSWR from 'swr'
import client, {dataset, projectId} from '../client'
import {DocumentSchedule} from '../types'

interface FetcherOptions {
  query: Record<string, string>
  uri: string
}

const fetcher = ({query, uri}: FetcherOptions) => client.request({query, uri})

function useDocumentSchedules({documentId}: {documentId: string}): {
  error: any
  isLoading: boolean
  schedules: DocumentSchedule[]
} {
  const sanityQuery = {
    query: {
      documentIds: documentId,
      state: 'scheduled',
    },
    uri: `/schedules/${projectId}/${dataset}`,
  }

  // TODO: correctly type errors
  const {data, error} = useSWR<DocumentSchedule[]>(sanityQuery, fetcher, {
    refreshInterval: 5000,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })

  return {
    error,
    isLoading: !error && !data,
    schedules: data || [],
  }
}

export default useDocumentSchedules
