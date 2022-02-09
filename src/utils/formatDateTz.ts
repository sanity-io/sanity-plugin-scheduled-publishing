import {formatInTimeZone} from 'date-fns-tz'
import {TimeZone} from '../types'

/**
 * Return time-zone adjusted date in the format 'Fri 24 Dec 2021 at 6:00 AM'
 */
export default function formatDateTz({
  date,
  includeTimeZone,
  prefix,
  timeZone,
}: {
  date: string
  includeTimeZone?: boolean
  prefix?: string
  timeZone: TimeZone
}): string {
  let format = `iii d MMM yyyy 'at' p`
  if (prefix) {
    format = `'${prefix}'${format}`
  }
  if (includeTimeZone) {
    format = `${format} (zzzz)`
  }
  return formatInTimeZone(date, timeZone.name, format)
}
