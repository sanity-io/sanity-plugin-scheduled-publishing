import type {DocumentBadgeComponent} from '@sanity/base'
import usePollSchedules from '../../hooks/usePollSchedules'
import useTimeZone from '../../hooks/useTimeZone'
import {debugWithName} from '../../utils/debug'

const debug = debugWithName('ScheduledBadge')

export const ScheduledBadge: DocumentBadgeComponent = (props) => {
  // Poll for document schedules
  const {schedules} = usePollSchedules({documentId: props.id, state: 'scheduled'})
  debug('schedules', schedules)

  const {formatDateTz} = useTimeZone()

  const upcomingSchedule = schedules?.[0]

  if (!upcomingSchedule) {
    return null
  }

  const formattedDateTime = formatDateTz({
    date: upcomingSchedule.executeAt,
    includeTimeZone: true,
  })

  return {
    color: 'primary',
    label: `Scheduled`,
    title: `Publishing on ${formattedDateTime}`,
  }
}
