import type {Schedule} from '../types'

/**
 * Return a schedule's `executedAt` date if it exists, otherwise just return `executeAt`.
 *
 * When dealing with schedules that may have differing values for `executeAt` and
 * `executedAt` (e.g. schedules force-published ahead of time), for the purposes of
 * rendering and sorting we only care about the _final_ date a schedule was executed.
 */
export function getLastExecuteDate(schedule: Schedule) {
  return schedule?.executedAt || schedule.executeAt
}
