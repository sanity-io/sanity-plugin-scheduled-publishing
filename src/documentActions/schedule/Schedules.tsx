import {Box, Stack, Text} from '@sanity/ui'
import React from 'react'
import {Schedule, ScheduledDocValidations} from '../../types'
import {ScheduleItem} from '../../components/scheduleItem'
import {getValidationStatus} from '../../utils/validationUtils'

interface Props {
  schedules: Schedule[]
  validations: ScheduledDocValidations
}

const Schedules = (props: Props) => {
  const {schedules, validations} = props

  return (
    <Stack space={4}>
      {schedules.length === 0 ? (
        <Box>
          <Text size={1}>No schedules</Text>
        </Box>
      ) : (
        <Stack space={2}>
          {schedules.map((schedule) => (
            <ScheduleItem
              key={schedule.id}
              schedule={schedule}
              type="document"
              validationStatus={getValidationStatus(schedule, validations)}
            />
          ))}
        </Stack>
      )}
    </Stack>
  )
}

export default Schedules
