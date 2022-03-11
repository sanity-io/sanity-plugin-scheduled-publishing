import {Card, Stack} from '@sanity/ui'
import React from 'react'
import {ScheduleFormData} from '../types'
import {DateTimeInput} from './DateInputs'

interface Props {
  onChange?: (formData: ScheduleFormData) => void
  value?: ScheduleFormData | null
}

const ScheduleForm = (props: Props) => {
  const {onChange, value} = props

  const handleChange = (date: string | null) => {
    if (date && onChange) {
      onChange({date})
    }
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
