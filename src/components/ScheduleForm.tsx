import {CalendarIcon, ClockIcon} from '@sanity/icons'
import {Flex, Stack, Text, TextInput} from '@sanity/ui'
import React from 'react'
import {UseFormHandleSubmit, UseFormRegister} from 'react-hook-form'
import {ScheduleFormData} from '../types'

interface Props {
  onSubmit: UseFormHandleSubmit<ScheduleFormData>
  register: UseFormRegister<ScheduleFormData>
}

const ScheduleForm = (props: Props) => {
  const {onSubmit, register} = props
  return (
    <Flex as="form">
      {/* Date */}
      <Stack flex={1} space={3}>
        <Text size={1} weight="medium">
          Date
        </Text>
        <TextInput
          disabled
          iconRight={CalendarIcon}
          placeholder="Date"
          {...register('date', {required: true})}
        />
        {}
      </Stack>
      {/* Time */}
      <Stack marginLeft={2} space={3}>
        <Text size={1} weight="medium">
          Time
        </Text>
        <TextInput
          disabled
          iconRight={ClockIcon}
          placeholder="Time"
          {...register('time', {required: true})}
        />
      </Stack>
    </Flex>
  )
}

export default ScheduleForm
