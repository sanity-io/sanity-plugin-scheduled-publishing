import type {DocumentActionProps} from '@sanity/base'
import {WarningOutlineIcon} from '@sanity/icons'
import {Card, Inline, Stack, Text} from '@sanity/ui'
import React from 'react'
import {UseFormHandleSubmit, UseFormRegister} from 'react-hook-form'
import {DocumentSchedule, ScheduleFormData} from '../types'
import ScheduleForm from './ScheduleForm'
import SchedulePill from './SchedulePill'

interface Props extends DocumentActionProps {
  onSubmit: UseFormHandleSubmit<ScheduleFormData>
  register: UseFormRegister<ScheduleFormData>
  schedules: DocumentSchedule[]
}

const DialogScheduleContent = (props: Props) => {
  const {onComplete, onSubmit, register, schedules} = props

  return (
    <Stack space={5}>
      {/* Form */}
      {schedules.length === 0 ? (
        <>
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
                <Text size={1}>
                  This will currently schedule the document 5 minutes in the future.
                </Text>
              </Inline>
            </Card>
          </Stack>
          <ScheduleForm onSubmit={onSubmit} register={register} />
        </>
      ) : (
        <>
          <Stack space={4}>
            <Text size={2} weight="medium">
              Current schedule
            </Text>
            <Stack space={2}>
              {schedules.map((schedule) => (
                <SchedulePill key={schedule.id} onComplete={onComplete} schedule={schedule} />
              ))}
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  )
}

export default DialogScheduleContent
