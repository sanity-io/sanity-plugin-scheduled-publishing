import {CheckmarkCircleIcon} from '@sanity/icons'
import {Box, Button, Flex, Label, Stack} from '@sanity/ui'
import React, {Fragment, useMemo} from 'react'
import useScheduleOperation from '../../hooks/useScheduleOperation'
import {Schedule, ScheduledDocValidations, ScheduleSort, ScheduleState} from '../../types'
import EmptySchedules from './EmptySchedules'
import {ScheduleItem} from '../scheduleItem'
import {getValidationStatus} from '../../utils/validationUtils'
import {useFilteredSchedules} from '../../hooks/useFilteredSchedules'

interface Props {
  schedules: Schedule[]
  scheduleState: ScheduleState
  sortBy: ScheduleSort
  validations: ScheduledDocValidations
}

function getLocalizedDate(date: string) {
  return new Date(date).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })
}

export const Schedules = (props: Props) => {
  const {schedules, scheduleState, sortBy, validations} = props

  const {deleteSchedules} = useScheduleOperation()

  const activeSchedules = useFilteredSchedules(schedules, scheduleState)
  const sortedSchedules = useSortedSchedules(activeSchedules, sortBy)

  const handleClearSchedules = () => {
    deleteSchedules({schedules: activeSchedules})
  }

  return (
    <>
      {sortedSchedules.length === 0 ? (
        <Box marginY={2}>
          <EmptySchedules scheduleState={scheduleState} />
        </Box>
      ) : (
        <Box marginBottom={5}>
          <Stack space={2}>
            {sortedSchedules.map((schedule, index) => {
              // Get localised date string for current and previous schedules (e.g. 'February 2025')
              const datePrevious =
                index > 0 ? getLocalizedDate(sortedSchedules[index - 1].executeAt) : null
              const dateCurrent = getLocalizedDate(schedule.executeAt)
              return (
                <Fragment key={schedule.id}>
                  {/* Render date subheaders (only when sorting by execution / publish date) */}
                  {sortBy === 'executeAt' && dateCurrent !== datePrevious && (
                    <Box paddingBottom={3} paddingTop={index === 0 ? 1 : 5}>
                      <Label muted size={1}>
                        {dateCurrent}
                      </Label>
                    </Box>
                  )}
                  <ScheduleItem
                    schedule={schedule}
                    type="tool"
                    validationStatus={getValidationStatus(schedule, validations)}
                  />
                </Fragment>
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

function useSortedSchedules(schedules: Schedule[], sortBy: ScheduleSort): Schedule[] {
  return useMemo(
    () =>
      schedules.sort((a, b) => {
        if (sortBy === 'createdAt') {
          return a[sortBy] < b[sortBy] ? 1 : -1
        }
        if (sortBy === 'executeAt') {
          return a[sortBy] > b[sortBy] ? 1 : -1
        }
        return 1
      }),
    [schedules, sortBy]
  )
}
