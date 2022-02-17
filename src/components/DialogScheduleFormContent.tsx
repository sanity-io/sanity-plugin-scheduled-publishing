import {Stack, Text} from '@sanity/ui'
import React from 'react'
import {ScheduleFormData} from '../types'
import ScheduleForm from './ScheduleForm'

interface Props {
  onChange?: (formData: ScheduleFormData) => void
  type: 'edit' | 'new'
  value?: ScheduleFormData | null
}

const DialogScheduleFormContent = (props: Props) => {
  const {onChange, type, value} = props

  return (
    <Stack space={5}>
      {type === 'new' && (
        <Stack space={4}>
          <Text size={1}>
            Schedule this document to be published at any time in the future.
            <br />
            Any edits in the meantime will be added to the scheduled document.
          </Text>
          <Text size={1}>Visit the Schedules page to get an overview of all schedules.</Text>
        </Stack>
      )}
      <ScheduleForm onChange={onChange} value={value} />
    </Stack>
  )
}

export default DialogScheduleFormContent
