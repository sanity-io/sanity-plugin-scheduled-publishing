import type {DocumentActionDescription, DocumentActionProps} from '@sanity/base'
import {CalendarIcon, ClockIcon} from '@sanity/icons'
import React, {useCallback, useState} from 'react'
import {useForm} from 'react-hook-form'
import DialogFooter from '../components/DialogFooter'
import DialogHeader from '../components/DialogHeader'
import DialogScheduleContent from '../components/DialogScheduleContent'
import usePollSchedules from '../hooks/usePollSchedules'
import useScheduleOperation from '../hooks/useScheduleOperation'
import {ScheduleFormData} from '../types'
import {debugWithName} from '../utils/debug'

const debug = debugWithName('schedule-action')

const ScheduleAction = (props: DocumentActionProps): DocumentActionDescription => {
  const {draft, id, onComplete, type} = props

  const [dialogOpen, setDialogOpen] = useState(false)

  const {createSchedule} = useScheduleOperation()

  // react-hook-form
  const {errors, formState, handleSubmit, register, reset} = useForm<ScheduleFormData>()

  // Poll for document schedules
  const {error, isLoading, schedules} = usePollSchedules({documentId: id, state: 'scheduled'})
  debug('schedules', schedules)

  // Callbacks
  const handleScheduleDocument = useCallback(() => {
    // Current time + 5 minutes
    const currentDate = new Date()
    const scheduleDate = new Date(currentDate.getTime() + 5 * 60000).toISOString()

    createSchedule({
      date: scheduleDate,
      documentId: id,
    }).then(() => {
      // Close dialog
      onComplete()
    })
  }, [])

  return {
    dialog: dialogOpen && {
      content: (
        <DialogScheduleContent
          {...props}
          onSubmit={handleSubmit}
          register={register}
          schedules={schedules}
        />
      ),
      footer: (
        <DialogFooter
          buttonText="Schedule"
          icon={ClockIcon}
          onAction={schedules.length === 0 ? handleScheduleDocument : undefined}
          onComplete={onComplete}
          tone="primary"
        />
      ),
      header: <DialogHeader title="Schedule" />,
      onClose: onComplete,
      type: 'modal',
    },
    label: 'Edit Scheduling',
    icon: CalendarIcon,
    onHandle: () => setDialogOpen(true),
  }
}

export default ScheduleAction
