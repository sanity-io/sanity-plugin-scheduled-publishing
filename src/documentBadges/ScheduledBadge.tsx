import type {DocumentActionProps} from '@sanity/base'
import {format} from 'date-fns'
import usePollCache from '../hooks/usePollCache'
import {debugWithName} from '../utils/debug'

const debug = debugWithName('scheduled-badge')

const ScheduledBadge = (props: DocumentActionProps) => {
  const schedules = usePollCache({documentId: props.id})
  debug('schedules (cached)', schedules)

  const upcomingSchedule = schedules?.[0]

  if (!upcomingSchedule) {
    return null
  }

  // Example: Fri 24 Dec 2021  6:00 AM
  const formattedDateTime = format(new Date(upcomingSchedule.executeAt), `iii d MMM yyyy \u00a0 p`)

  return {
    color: 'primary',
    label: `Scheduled`,
    title: formattedDateTime,
  }
}

export default ScheduledBadge
