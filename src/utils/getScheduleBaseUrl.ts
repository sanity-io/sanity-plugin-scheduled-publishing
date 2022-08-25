import {getSanityClient} from '../lib/client'

export default function getScheduleBaseUrl(): string {
  const client = getSanityClient()
  const {dataset, projectId} = client.config()
  return `/schedules/${projectId}/${dataset}`
}
