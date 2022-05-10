import type {ValidationMarker} from '@sanity/types'
import {Card, Stack} from '@sanity/ui'
import React, {useState} from 'react'
import {ScheduleFormData} from '../../types'
import {DateTimeInput} from '../dateInputs'

interface Props {
  customValidation: (selectedDate: Date) => boolean
  markers?: ValidationMarker[]
  onChange?: (formData: ScheduleFormData) => void
  value?: ScheduleFormData | null
}

const ScheduleForm = (props: Props) => {
  const {customValidation, markers, onChange, value} = props

  // Date input is stored locally to handle behaviour of the studio's `<LazyTextInput />` component.
  // If we don't keep this local state (and only rely on the canonical value of `ScheduleFormData`),
  // you'll see an unsightly flash when text inputs are blurred / lose focus, as `<LazyTextInput />`
  // clears its internal value before it's had a chance to re-render as a result of its own props changing.
  const [inputValue, setInputValue] = useState<string>()

  const handleChange = (date: string | null) => {
    if (date && onChange) {
      onChange({date})
      setInputValue(date)
    }
  }

  return (
    <Stack space={4}>
      <Card>
        <DateTimeInput
          level={0}
          markers={markers || []}
          onChange={handleChange}
          type={{
            name: 'date',
            options: {
              customValidation,
              // date-fns format
              dateFormat: `dd/MM/yyyy`,
              timeFormat: 'HH:mm',
            },
            title: 'Date and time',
          }}
          value={inputValue === undefined ? value?.date : inputValue}
        />
      </Card>
    </Stack>
  )
}

export default ScheduleForm
