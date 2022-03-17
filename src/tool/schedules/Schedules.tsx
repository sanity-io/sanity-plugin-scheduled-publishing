import {CheckmarkCircleIcon} from '@sanity/icons'
import {Box, Button, Flex, Label, Stack} from '@sanity/ui'
import React, {Fragment} from 'react'
import {ScheduleItem} from '../../components/scheduleItem'
import useScheduleOperation from '../../hooks/useScheduleOperation'
import {ScheduledDocValidations} from '../../types'
import {getValidationStatus} from '../../utils/validationUtils'
import {useSchedules} from '../contexts/schedules'
import EmptySchedules from './EmptySchedules'

interface Props {
  validations: ScheduledDocValidations
}

function getLocalizedDate(date: string) {
  return new Date(date).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })
}

export const Schedules = (props: Props) => {
  const {validations} = props

  const {deleteSchedules} = useScheduleOperation()
  const {activeSchedules, scheduleState, sortBy} = useSchedules()

  const handleClearSchedules = () => {
    deleteSchedules({schedules: activeSchedules || []})
  }

  return (
    <>
      {activeSchedules.length === 0 ? (
        <Box marginY={2}>
          <EmptySchedules scheduleState={scheduleState} />
        </Box>
      ) : (
        <Box marginBottom={5}>
          <Stack space={2}>
            {activeSchedules.map((schedule, index) => {
              // Get localised date string for current and previous schedules (e.g. 'February 2025')
              const datePrevious =
                index > 0 ? getLocalizedDate(activeSchedules[index - 1].executeAt) : null
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
