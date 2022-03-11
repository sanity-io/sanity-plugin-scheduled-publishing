import {Card, Stack} from '@sanity/ui'
import React from 'react'
import useTimeZone from '../hooks/useTimeZone'
import {ScheduleFormData} from '../types'
import {DateTimeInput} from './DateInputs'

interface Props {
  onChange?: (formData: ScheduleFormData) => void
  value?: ScheduleFormData | null
}

const ScheduleForm = (props: Props) => {
  const {onChange, value} = props

  const {getCurrentZoneDate} = useTimeZone()

  const handleChange = (date: string | null) => {
    if (date && onChange) {
      onChange({date})
    }
  }

  // Only allow dates in the future (`selectedDate` is UTC)
  const handleIsValidDate = (selectedDate: Date): boolean => {
    return selectedDate > getCurrentZoneDate()
  }

  return (
    <Stack space={4}>
      <Card>
        <DateTimeInput
          level={0}
          markers={[]}
          onChange={handleChange}
          type={{
            name: 'date',
            options: {
              // date-fns format
              dateFormat: `d/MM/yyyy`,
              isValidDate: handleIsValidDate,
              timeFormat: 'HH:mm',
            },
            title: 'Date and time',
          }}
          value={value?.date}
        />
      </Card>
    </Stack>
  )
}

export default ScheduleForm
