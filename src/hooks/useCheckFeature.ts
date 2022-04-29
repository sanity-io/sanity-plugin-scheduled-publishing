import useSWR from 'swr'
import client from '../lib/client'

const {projectId} = client.config()

const uri = `/projects/${projectId}/features/scheduledPublishing`
const fetcher = () =>
  client.request<boolean>({
    method: 'GET',
    uri,
  })

const SWR_OPTIONS = {
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: false,
}

/**
 * Use SWR to check if the current project supports scheduled publishing.
 * SWR will cache this value and prevent unnecessary re-fetching.
 */
function useHasScheduledPublishing(): boolean | undefined {
  const {data} = useSWR(uri, fetcher, SWR_OPTIONS)
  return data
}

export default useHasScheduledPublishing
