import sanityClient from '../lib/client'

export default function getScheduleBaseUrl(): string {
  const client = sanityClient()
  const {dataset, projectId} = client.config()
  return `/schedules/${projectId}/${dataset}`
}
