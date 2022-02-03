import type {DocumentActionDescription, DocumentActionProps} from '@sanity/base'
import {CalendarIcon, ClockIcon} from '@sanity/icons'
import {useToast} from '@sanity/ui'
import format from 'date-fns/format'
import React, {useCallback, useState} from 'react'
import {useForm} from 'react-hook-form'
import {createSchedule} from '../actions/schedule'
import DialogFooter from '../components/DialogFooter'
import DialogHeader from '../components/DialogHeader'
import DialogScheduleContent from '../components/DialogScheduleContent'
import {useSchedules} from '../hooks/schedule'
import {ScheduleFormData} from '../types'
import {debugWithName} from '../utils/debug'

const debug = debugWithName('schedule-action')

const ScheduleAction = (props: DocumentActionProps): DocumentActionDescription => {
  const {draft, id, onComplete, type} = props

  const [dialogOpen, setDialogOpen] = useState(false)

  const toast = useToast()

  // react-hook-form
  const {errors, formState, handleSubmit, register, reset} = useForm<ScheduleFormData>()

  // Poll for document schedules
  const {error, isLoading, schedules} = useSchedules({documentId: id, state: 'scheduled'})
  debug('schedules', schedules)

  // Callbacks
  const handleScheduleDocument = useCallback(() => {
    // Current time + 5 minutes
    const currentDate = new Date()
    const scheduleDate = new Date(currentDate.getTime() + 5 * 60000).toISOString()

    createSchedule({
      date: scheduleDate,
      documentId: id,
    })
      .then((schedule) => {
        debug('Schedule created', schedule)
        // Close dialog
        onComplete()
        // Dispatch toast
        toast.push({
          closable: true,
          description: format(
            new Date(schedule.executeAt),
            `'Publishing on' iiii d MMMM yyyy 'at' p`
          ),
          status: 'success',
          title: 'Schedule created',
        })
      })
      .catch((err) => {
        // TODO: handle error
        debug('Schedule error', err)
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
