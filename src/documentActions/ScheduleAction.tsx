import type {DocumentActionDescription, DocumentActionProps} from '@sanity/base'
import {InsufficientPermissionsMessage} from '@sanity/base/components'
import {
  unstable_useDocumentPairPermissions as useDocumentPairPermissions,
  useCurrentUser,
} from '@sanity/base/hooks'
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

/**
 * NOTE: Document actions are re-run whenever `onComplete` is called.
 *
 * The `onComplete` callback prop is used to typically denote that an action is 'finished',
 * and default behavior means that `useEffect` and other hooks are immediately re-run upon 'completion'.
 *
 * This particular custom action has a hook that polls an endpoint (`usePollSchedules`) and any
 * triggered `onComplete` action (typically done when a dialog is closed) will automatically query
 * this endpoint by virtue of the hook re-running and in turn, revalidate our data.
 *
 * In this case, this is exactly what we want (we want to revalidate once a schedule has been created,
 * updated or deleted) - just be mindful that any hooks here can and will run multiple times, even with
 * empty dependency arrays.
 */

const ScheduleAction = (props: DocumentActionProps): DocumentActionDescription => {
  const {draft, id, onComplete, published, type} = props

  // Studio hooks
  const {value: currentUser} = useCurrentUser()
  const [permissions, isPermissionsLoading] = useDocumentPairPermissions({
    id,
    type,
    permission: 'publish',
  })
  const {createSchedule} = useScheduleOperation()

  const [dialogOpen, setDialogOpen] = useState(false)
  const {formData, onFormChange} = useScheduleForm()
  // Poll for document schedules
  // TODO: handle error + isLoading states
  const {schedules} = usePollSchedules({documentId: id, state: 'scheduled'})
  debug('schedules', schedules)

  const hasExistingSchedules = schedules.length > 0

  // Check to see if the document 'exists' (has either been published OR has draft content).
  // When creating a new document, despite having an ID assigned it won't exist in your dataset
  // until the document has been edited / dirtied in any way.
  const documentExists = draft !== null || published !== null

  const insufficientPermissions = !isPermissionsLoading && !permissions?.granted

  // Callbacks
  const handleDialogOpen = useCallback(() => {
    setDialogOpen(true)
  }, [])

  const handleScheduleCreate = useCallback(() => {
    if (!formData?.date) {
      return
    }

    // Create schedule then close dialog
    createSchedule({date: formData.date, documentId: id}).then(onComplete)
  }, [formData?.date])

  const title = hasExistingSchedules ? 'Edit Schedule' : 'Schedule'

  if (insufficientPermissions) {
    return {
      disabled: true,
      icon: CalendarIcon,
      label: title,
      title: (
        <InsufficientPermissionsMessage currentUser={currentUser} operationLabel="edit schedules" />
      ),
    }
  }

  return {
    dialog: dialogOpen && {
      content: (
        <DocumentActionPropsProvider value={props}>
          {hasExistingSchedules ? (
            <DialogScheduleListContent schedules={schedules} />
          ) : (
            <DialogScheduleFormContent onChange={onFormChange} type="new" value={formData} />
          )}
        </DocumentActionPropsProvider>
      ),
      footer: !hasExistingSchedules && (
        <DialogFooter
          buttonText="Schedule"
          disabled={!formData?.date}
          icon={ClockIcon}
          onAction={schedules.length === 0 ? handleScheduleCreate : undefined}
          onComplete={onComplete}
          tone="primary"
        />
      ),
      header: <DialogHeader title={title} />,
      onClose: onComplete,
      type: 'modal',
    },
    disabled: !documentExists,
    label: title,
    icon: CalendarIcon,
    onHandle: handleDialogOpen,
    title: documentExists ? '' : `This document doesn't exist yet`,
  }
}

export default ScheduleAction
