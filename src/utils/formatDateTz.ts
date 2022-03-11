import {formatInTimeZone} from 'date-fns-tz'
import {NormalizedTimeZone} from '../types'

/**
 * Return time-zone adjusted date in the format 'Fri 24 Dec 2021 at 6:00 AM'
 */
// TODO: consider moving into `useTimeZone` to avoid needing to pass `timeZone`
export default function formatDateTz({
  date,
  includeTimeZone,
  mode = 'large',
  prefix,
  timeZone,
}: {
  date: string
  includeTimeZone?: boolean
  mode?: 'small' | 'medium' | 'large'
  prefix?: string
  timeZone: NormalizedTimeZone
}): string {
  let format
  switch (mode) {
    case 'small':
      format = `d MMM yy',' p` // 1 Oct 22, 10:00 PM
      break
    case 'medium':
      format = `d MMMM yyyy',' p` // 1 October 2022, 10:00 PM
      break
    case 'large':
      format = `iiii',' d MMMM yyyy',' p` // Saturday, 1 October 2022, 10:00 PM
      break
    default:
      throw new Error('Unhandled mode')
  }
  if (prefix) {
    format = `'${prefix}'${format}`
  }
  if (includeTimeZone) {
    format = `${format} (zzzz)`
  }
  return formatInTimeZone(date, timeZone.name, format)
}
