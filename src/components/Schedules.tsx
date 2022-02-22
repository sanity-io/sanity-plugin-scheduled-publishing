import {CheckmarkCircleIcon} from '@sanity/icons'
import {Box, Button, Flex, Label, Stack} from '@sanity/ui'
import React from 'react'
import useScheduleOperation from '../hooks/useScheduleOperation'
import {Schedule, ScheduleState} from '../types'
import CardEmptySchedules from './CardEmptySchedules'
import ScheduleItemTool from './ScheduleItemTool'

interface Props {
  schedules: Schedule[]
  scheduleState: ScheduleState
}

const Schedules = (props: Props) => {
  const {schedules, scheduleState} = props

  const {deleteSchedules} = useScheduleOperation()

  // Iterate through all schedules and inject date headers
  const schedulesWithHeaders = schedules
    .reduce<[string, Schedule[]][]>((acc, val) => {
      // Localised date string: 'February 2025'
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

  const activeSchedules = schedules.filter((schedule) => schedule.state === scheduleState)

  // Callbacks
  const handleClearSchedules = () => {
    deleteSchedules({schedules: activeSchedules})
  }

  return (
    <>
      {schedulesWithHeaders.length === 0 ? (
        <Box marginY={2}>
          <CardEmptySchedules scheduleState={scheduleState} />
        </Box>
      ) : (
        <Box marginBottom={5}>
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

          {/* Clear completed schedules */}
          {scheduleState === 'succeeded' && (
            <Flex justify="center" marginTop={6}>
              <Button
                icon={CheckmarkCircleIcon}
                mode="ghost"
                onClick={handleClearSchedules}
                text="Clear all completed schedules"
              />
            </Flex>
          )}
        </Box>
      )}
    </>
  )
}

export default Schedules
