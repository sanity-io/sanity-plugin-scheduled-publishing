import useSWR from 'swr'
import {getSanityClient} from '../lib/client'

function getUri() {
  const client = getSanityClient()
  const {projectId} = client.config()
  return `/projects/${projectId}/features/scheduledPublishing`
}

const fetcher = () => {
  return getSanityClient().request<boolean>({
    method: 'GET',
    uri: getUri(),
  })
}

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
  const {data} = useSWR(getUri(), fetcher, SWR_OPTIONS)
  return data
}

export default useHasScheduledPublishing
