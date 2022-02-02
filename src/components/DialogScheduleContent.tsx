import {CalendarIcon, ClockIcon, WarningOutlineIcon} from '@sanity/icons'
import {Card, Flex, Inline, Stack, Text, TextInput} from '@sanity/ui'
import React from 'react'
import {UseFormHandleSubmit, UseFormRegister} from 'react-hook-form'
import {ScheduleFormData} from '../types'

interface Props {
  onSubmit: UseFormHandleSubmit<ScheduleFormData>
  register: UseFormRegister<ScheduleFormData>
}

const DialogScheduleContent = (props: Props) => {
  const {onSubmit, register} = props

  return (
    <Stack space={5}>
      <Stack space={4}>
        <Text size={2} weight="medium">
          New schedule
        </Text>
        <Text size={1}>Schedule this document to be published at any time in the future.</Text>

        <Card padding={3} radius={2} shadow={1} tone="caution">
          <Inline space={3}>
            <Text size={1}>
              <WarningOutlineIcon />
            </Text>
            <Text size={1}>This will currently schedule the document 5 minutes in the future.</Text>
          </Inline>
        </Card>
      </Stack>
      {/* Form */}
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
    </Stack>
  )
}

export default DialogScheduleContent
