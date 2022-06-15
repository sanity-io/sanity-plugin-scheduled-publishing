import type {DocumentBadgeComponent} from 'sanity/desk'
import {format} from 'date-fns'
import {DATE_FORMAT} from '../../constants'
import usePollSchedules from '../../hooks/usePollSchedules'
import {debugWithName} from '../../utils/debug'

const debug = debugWithName('ScheduledBadge')

export const ScheduledBadge: DocumentBadgeComponent = (props) => {
  // Poll for document schedules
  const {schedules} = usePollSchedules({documentId: props.id, state: 'scheduled'})
  debug('schedules', schedules)

  const upcomingSchedule = schedules?.[0]

  if (!upcomingSchedule || !upcomingSchedule.executeAt) {
    return null
  }

  const formattedDateTime = format(new Date(upcomingSchedule.executeAt), DATE_FORMAT.LARGE)

  return {
    color: 'primary',
    label: `Scheduled`,
    title: `Publishing on ${formattedDateTime} (local time)`,
  }
}
