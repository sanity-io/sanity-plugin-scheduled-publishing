import type {DocumentActionDescription, DocumentActionProps} from '@sanity/base'
import {CalendarIcon, ClockIcon} from '@sanity/icons'
import React, {useCallback, useState} from 'react'
import {useForm} from 'react-hook-form'
import DialogFooter from '../components/DialogFooter'
import DialogScheduleContent from '../components/DialogScheduleContent'
import DialogHeader from '../components/DialogHeader'
import {sanityClient} from '../lib/client'
import {ScheduleFormData} from '../types'
import {debugWithName} from '../utils/debug'
import usePollCache from '../hooks/usePollCache'

const debug = debugWithName('schedule-action')

const {dataset, projectId} = sanityClient.config()

const ScheduleAction = (props: DocumentActionProps): DocumentActionDescription => {
  const {draft, id, onComplete: onClose, type} = props

  const [dialogOpen, setDialogOpen] = useState(false)

  const schedules = usePollCache({documentId: props.id})
  debug('schedules', schedules)

  // react-hook-form
  const {errors, formState, handleSubmit, register, reset} = useForm<ScheduleFormData>()

  // Callbacks
  const handleScheduleDocument = useCallback(() => {
    // Current time + 5 minutes
    const currentTime = new Date()
    const scheduleTime = new Date(currentTime.getTime() + 5 * 60000).toISOString()

    sanityClient
      .request({
        body: {
          documents: [{documentId: id}],
          executeAt: scheduleTime, // ISO date
          name: scheduleTime,
        },
        method: 'POST',
        uri: `/schedules/${projectId}/${dataset}`,
      })
      .then((res) => {
        debug('Schedule complete', res)
        // Close dialog
        onClose()
        // TODO: dispatch toast
      })
      .catch((err) => {
        // TODO: handle error
        debug('Schedule error', err)
      })
  }, [])

  return {
    dialog: dialogOpen && {
      content: <DialogScheduleContent onSubmit={handleSubmit} register={register} />,
      footer: (
        <DialogFooter
          buttonText="Schedule"
          icon={ClockIcon}
          onAction={handleScheduleDocument}
          onClose={onClose}
          tone="primary"
        />
      ),
      header: <DialogHeader title="Schedule" />,
      onClose,
      type: 'modal',
    },
    label: 'Schedule',
    icon: CalendarIcon,
    onHandle: () => setDialogOpen(true),
  }
}

export default ScheduleAction
