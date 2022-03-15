import {Stack} from '@sanity/ui'
import React, {PropsWithChildren} from 'react'
import {ScheduleFormData} from '../../types'
import ScheduleForm from './ScheduleForm'

interface Props {
  onChange?: (formData: ScheduleFormData) => void
  value?: ScheduleFormData | null
}

export function EditScheduleForm(props: PropsWithChildren<Props>) {
  const {onChange, value} = props

  return (
    <Stack space={4}>
      {props.children}
      <ScheduleForm onChange={onChange} value={value} />
    </Stack>
  )
}
