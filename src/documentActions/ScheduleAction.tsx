import type {DocumentActionDescription, DocumentActionProps} from '@sanity/base'
import {CalendarIcon, ClockIcon} from '@sanity/icons'
import React, {useCallback, useState} from 'react'
import DialogFooter from '../components/DialogFooter'
import DialogHeader from '../components/DialogHeader'
import DialogScheduleFormContent from '../components/DialogScheduleFormContent'
import DialogScheduleListContent from '../components/DialogScheduleListContent'
import {DocumentActionPropsProvider} from '../contexts/documentActionProps'
import usePollSchedules from '../hooks/usePollSchedules'
import useScheduleForm from '../hooks/useScheduleForm'
import useScheduleOperation from '../hooks/useScheduleOperation'
import {debugWithName} from '../utils/debug'

const debug = debugWithName('ScheduleAction')

const ScheduleAction = (props: DocumentActionProps): DocumentActionDescription => {
  const {draft, id, onComplete, published} = props

  const [dialogOpen, setDialogOpen] = useState(false)
  const {createSchedule} = useScheduleOperation()
  const {formData, onFormChange} = useScheduleForm()

  // Poll for document schedules
  // TODO: handle error + isLoading states
  const {schedules} = usePollSchedules({documentId: id, state: 'scheduled'})
  debug('schedules', schedules)

  const showCreateForm = schedules.length === 0

  // Check to see if the document 'exists' (has either been published OR has draft content).
  // When creating a new document, despite having an ID assigned it won't exist in your dataset
  // until the document has been edited / dirtied in any way.
  const documentExists = draft !== null || published !== null

  // Callbacks
  const handleScheduleCreate = useCallback(() => {
    if (!formData?.date) {
      return
    }
    // Create schedule then close dialog
    createSchedule({date: formData.date, documentId: id}).then(onComplete)
  }, [formData?.date])

  return {
    dialog: dialogOpen && {
      content: (
        <DocumentActionPropsProvider value={props}>
          {showCreateForm ? (
            <DialogScheduleFormContent onChange={onFormChange} type="new" value={formData} />
          ) : (
            <DialogScheduleListContent schedules={schedules} />
          )}
        </DocumentActionPropsProvider>
      ),
      footer: showCreateForm && (
        <DialogFooter
          buttonText="Schedule"
          disabled={!formData?.date}
          icon={ClockIcon}
          onAction={schedules.length === 0 ? handleScheduleCreate : undefined}
          onComplete={onComplete}
          tone="primary"
        />
      ),
      header: <DialogHeader title="Schedule" />,
      onClose: onComplete,
      type: 'modal',
    },
    disabled: !documentExists,
    label: 'Schedule',
    icon: CalendarIcon,
    onHandle: () => setDialogOpen(true),
    title: documentExists ? '' : `This document doesn't exist yet`,
  }
}

export default ScheduleAction
