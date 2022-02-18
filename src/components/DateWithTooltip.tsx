import {Box, Text, Tooltip} from '@sanity/ui'
import {formatDistance} from 'date-fns'
import React from 'react'
import useTimeZone from '../hooks/useTimeZone'
import formatDateTz from '../utils/formatDateTz'

interface Props {
  date: string
}

const DateWithTooltip = (props: Props) => {
  const {date} = props

  const {timeZone} = useTimeZone()

  const currentDate = new Date()
  const targetDate = new Date(date)

  const formattedDateTime = formatDateTz({
    date,
    timeZone,
  })

  return (
    <Tooltip
      content={
        <Box padding={2}>
          <Text muted size={1}>
            Publishing{' '}
            {formatDistance(targetDate, currentDate, {
              addSuffix: true,
            })}
          </Text>
        </Box>
      }
      portal
    >
      <Text size={1}>{formattedDateTime}</Text>
    </Tooltip>
  )
}

export default DateWithTooltip
