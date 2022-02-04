import type {DocumentActionDescription, DocumentActionProps} from '@sanity/base'
import {CalendarIcon, ClockIcon} from '@sanity/icons'
import React, {useCallback, useState} from 'react'
import DialogFooter from '../components/DialogFooter'
import DialogHeader from '../components/DialogHeader'
import DialogScheduleContent from '../components/DialogScheduleContent'
import usePollSchedules from '../hooks/usePollSchedules'
import useScheduleOperation from '../hooks/useScheduleOperation'
import {ScheduleFormData} from '../types'
import {debugWithName} from '../utils/debug'

const debug = debugWithName('ScheduleAction')

const ScheduleAction = (props: DocumentActionProps): DocumentActionDescription => {
  const {draft, id, onComplete, type} = props

  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState<ScheduleFormData>()

  const {createSchedule} = useScheduleOperation()

  // Poll for document schedules
  const {error, isLoading, schedules} = usePollSchedules({documentId: id, state: 'scheduled'})
  debug('schedules', schedules)

  // Callbacks
  const handleFormChange = useCallback((form: ScheduleFormData) => setFormData(form), [])
  const handleScheduleDocument = useCallback(() => {
    if (!formData?.date) {
      return
    }
    createSchedule({date: formData.date, documentId: id}).then(() => {
      // Close dialog
      onComplete()
    })
  }, [formData?.date])

  return {
    dialog: dialogOpen && {
      content: (
        <DialogScheduleContent
          {...props}
          formData={formData}
          onChange={handleFormChange}
          // onSubmit={handleSubmit}
          schedules={schedules}
        />
      ),
      footer: (
        <DialogFooter
          buttonText="Schedule"
          disabled={!formData?.date}
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
