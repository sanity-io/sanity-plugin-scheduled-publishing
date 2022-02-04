import type {DocumentActionProps} from '@sanity/base'
import {Stack, Text} from '@sanity/ui'
import React from 'react'
import {Schedule, ScheduleFormData} from '../types'
import ScheduleForm from './ScheduleForm'
import ScheduleItemMini from './ScheduleItemMini'

interface Props extends DocumentActionProps {
  formData?: ScheduleFormData
  onChange?: (formData: ScheduleFormData) => void
  onSubmit?: () => void
  schedules: Schedule[]
}

const DialogScheduleContent = (props: Props) => {
  const {formData, onChange, onComplete, onSubmit, schedules} = props

  return (
    <Stack space={4}>
      {/* Form */}
      {schedules.length === 0 ? (
        <>
          <Stack space={4}>
            <Text size={2} weight="medium">
              New schedule
            </Text>
            <Text size={1}>Schedule this document to be published at any time in the future.</Text>
          </Stack>
          <ScheduleForm formData={formData} onChange={onChange} onSubmit={onSubmit} />
        </>
      ) : (
        <>
          <Stack space={4}>
            <Text size={2} weight="medium">
              Current schedule
            </Text>
            <Stack space={2}>
              {schedules.map((schedule) => (
                <ScheduleItemMini key={schedule.id} onComplete={onComplete} schedule={schedule} />
              ))}
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  )
}

export default DialogScheduleContent
