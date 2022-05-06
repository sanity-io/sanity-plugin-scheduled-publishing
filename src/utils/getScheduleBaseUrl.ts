import client from '../lib/client'

export default function getScheduleBaseUrl(): string {
  const {dataset, projectId} = client.config()
  return `/schedules/${projectId}/${dataset}`
}
