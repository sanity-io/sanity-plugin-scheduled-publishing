import {Box, Text, Tooltip} from '@sanity/ui'
import {formatDistance} from 'date-fns'
import React from 'react'
import useTimeZone from '../../../hooks/useTimeZone'

interface Props {
  date: string // local date in UTC
  useElementQueries?: boolean
}

/**
 * If `useElementQueries` is enabled, dates will be conditionally toggled at different element
 * breakpoints, provided this `<DateWithTooltip>` is wrapped in a `<DateElementQuery>` component.
 */
const DateWithTooltip = (props: Props) => {
  const {date, useElementQueries} = props

  const {formatDateTz} = useTimeZone()

  // Get distance between both dates
  const distance = formatDistance(new Date(date), new Date(), {
    addSuffix: true,
  })

  const dateTimeLarge = formatDateTz({date, mode: 'large'})
  const dateTimeMedium = formatDateTz({date, mode: 'medium'})
  const dateTimeSmall = formatDateTz({date, mode: 'small'})

  return (
    <Text size={1} textOverflow="ellipsis">
      <Tooltip
        content={
          <Box padding={2}>
            <Text muted size={1}>
              {distance}
            </Text>
          </Box>
        }
        portal
      >
        <span>
          {useElementQueries ? (
            <>
              <span className="date-small">{dateTimeSmall}</span>
              <span className="date-medium">{dateTimeMedium}</span>
              <span className="date-large">{dateTimeLarge}</span>
            </>
          ) : (
            dateTimeLarge
          )}
        </span>
      </Tooltip>
    </Text>
  )
}

export default DateWithTooltip
