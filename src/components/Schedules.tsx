import {CheckmarkCircleIcon} from '@sanity/icons'
import {Box, Button, Flex, Label, Stack} from '@sanity/ui'
import React from 'react'
import useScheduleOperation from '../hooks/useScheduleOperation'
import {Schedule, ScheduleSort, ScheduleState} from '../types'
import CardEmptySchedules from './CardEmptySchedules'
import ScheduleItemTool from './ScheduleItemTool'

interface Props {
  schedules: Schedule[]
  scheduleState: ScheduleState
  sortBy: ScheduleSort
}

function getLocalizedDate(date: string) {
  return new Date(date).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })
}

const Schedules = (props: Props) => {
  const {schedules, scheduleState, sortBy} = props

  const {deleteSchedules} = useScheduleOperation()

  const sortedSchedules = schedules.sort((a, b) => {
    if (sortBy === 'createdAt') {
      return a[sortBy] < b[sortBy] ? 1 : -1
    }
    if (sortBy === 'executeAt') {
      return a[sortBy] > b[sortBy] ? 1 : -1
    }
    return 1
  })

  const activeSchedules = schedules.filter((schedule) => schedule.state === scheduleState)

  // Callbacks
  const handleClearSchedules = () => {
    deleteSchedules({schedules: activeSchedules})
  }

  return (
    <>
      {sortedSchedules.length === 0 ? (
        <Box marginY={2}>
          <CardEmptySchedules scheduleState={scheduleState} />
        </Box>
      ) : (
        <Box marginBottom={5}>
          <Stack space={2}>
            {sortedSchedules.map((v, index) => {
              // Get localised date string for current and previous schedules (e.g. 'February 2025')
              const datePrevious =
                index > 0 ? getLocalizedDate(sortedSchedules[index - 1].executeAt) : null
              const dateCurrent = getLocalizedDate(v.executeAt)
              return (
                <>
                  {/* Render date subheaders (only when sorting by execution / publish date) */}
                  {sortBy === 'executeAt' && dateCurrent !== datePrevious && (
                    <Box key={dateCurrent} paddingBottom={3} paddingTop={index === 0 ? 1 : 5}>
                      <Label muted size={1}>
                        {dateCurrent}
                      </Label>
                    </Box>
                  )}
                  <ScheduleItemTool key={v.id} schedule={v} />
                </>
              )
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
