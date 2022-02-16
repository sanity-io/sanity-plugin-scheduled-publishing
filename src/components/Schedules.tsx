import {Box, Label, Stack, Text} from '@sanity/ui'
import React from 'react'
import {Schedule} from '../types'
import ScheduleItemTool from './ScheduleItemTool'

interface Props {
  schedules: Schedule[]
}

const Schedules = (props: Props) => {
  const {schedules} = props

  // Iterate through all schedules and inject date headers
  const schedulesWithHeaders = schedules
    .reduce<[string, Schedule[]][]>((acc, val) => {
      // Localised date string: 'Februrary 2025'
      const dateStr = new Date(val.executeAt).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      })
      const index = acc.map((v) => v[0]).indexOf(dateStr)
      if (index === -1) {
        acc.push([dateStr, [val]])
      } else {
        acc[index][1].push(val)
      }
      return acc
    }, [])
    .flat(2)

  return (
    <>
      {schedulesWithHeaders.length === 0 ? (
        <Box>
          <Text size={1}>No schedules</Text>
        </Box>
      ) : (
        <Stack space={2}>
          {schedulesWithHeaders.map((v, index) => {
            if (typeof v === 'string') {
              return (
                <Box key={v} paddingBottom={3} paddingTop={index === 0 ? 1 : 5}>
                  <Label muted size={1}>
                    {v}
                  </Label>
                </Box>
              )
            }
            return <ScheduleItemTool key={v.id} schedule={v} />
          })}
        </Stack>
      )}
    </>
  )
}

export default Schedules
