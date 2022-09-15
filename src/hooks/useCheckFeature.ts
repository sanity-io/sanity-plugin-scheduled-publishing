import useSWR from 'swr'
import {useClient} from 'sanity'
import {useCallback} from 'react'

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
  const client = useClient({apiVersion: '2022-09-01'})
  const uri = `/projects/${client.config().projectId}/features/scheduledPublishing`
  const fetcher = useCallback(
    () =>
      client.request<boolean>({
        method: 'GET',
        uri,
      }),
    [client, uri]
  )

  const {data} = useSWR(uri, fetcher, SWR_OPTIONS)
  return data
}

export default useHasScheduledPublishing
