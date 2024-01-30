import {
  type DocumentActionDescription,
  type DocumentActionDialogProps,
  type DocumentActionProps,
  useDocumentPairPermissions,
  useCurrentUser,
  InsufficientPermissionsMessage,
} from 'sanity'

import {CalendarIcon, ClockIcon} from '@sanity/icons'
import {Box, Text} from '@sanity/ui'
import React, {useCallback, useState} from 'react'
import DialogFooter from '../../components/dialogs/DialogFooter'
import DialogHeader from '../../components/dialogs/DialogHeader'
import {EditScheduleForm} from '../../components/editScheduleForm'
import ErrorCallout from '../../components/errorCallout/ErrorCallout'
import {FEATURE_NOT_SUPPORTED_TEXT} from '../../constants'
import {DocumentActionPropsProvider} from '../../contexts/documentActionProps'
import useCheckFeature from '../../hooks/useCheckFeature'
import usePollSchedules from '../../hooks/usePollSchedules'
import useScheduleForm from '../../hooks/useScheduleForm'
import useScheduleOperation from '../../hooks/useScheduleOperation'
import {debugWithName} from '../../utils/debug'
import {NewScheduleInfo} from './NewScheduleInfo'
import Schedules from './Schedules'

const debug = debugWithName('ScheduleAction')

/*
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

export const ScheduleAction = (props: DocumentActionProps): DocumentActionDescription => {
  const {draft, id, liveEdit, onComplete, published, type} = props

  const currentUser = useCurrentUser()
  const [permissions, isPermissionsLoading] = useDocumentPairPermissions({
    id,
    type,
    permission: 'publish',
  })
  const {createSchedule} = useScheduleOperation()

  // Check if the current project supports Scheduled Publishing
  const hasFeature = useCheckFeature()

  const [dialogOpen, setDialogOpen] = useState(false)
  const {formData, onFormChange} = useScheduleForm()

  // Poll for document schedules
  const {
    error: fetchError,
    isInitialLoading,
    schedules,
  } = usePollSchedules({
    documentId: id,
    state: 'scheduled',
  })

  debug('schedules', schedules)

  const hasExistingSchedules = schedules && schedules.length > 0

  // Check to see if the document 'exists' (has either been published OR has draft content).
  // When creating a new document, despite having an ID assigned it won't exist in your dataset
  // until the document has been edited / dirtied in any way.
  const documentExists = draft !== null || published !== null

  const insufficientPermissions = !isPermissionsLoading && !permissions?.granted

  // Callbacks
  const handleDialogOpen = useCallback(() => {
    setDialogOpen(true)
  }, [])

  const [actionType, setActionType] = useState<'publish' | 'unpublish'>('publish')

  const handleScheduleCreate = useCallback(() => {
    if (!formData?.date) {
      return
    }

    // Create schedule then close dialog
    createSchedule({
      action: actionType,
      date: formData.date,
      documentId: id,
    }).then(onComplete)
  }, [onComplete, createSchedule, id, formData?.date, actionType])

  const handleActionTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActionType(event.target.checked ? 'unpublish' : 'publish')
  }

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

  let tooltip: string | null = `This document doesn't exist yet`
  if (documentExists) {
    tooltip = null
  }
  if (isInitialLoading) {
    tooltip = 'Loading schedules'
  }
  if (liveEdit) {
    tooltip =
      'Live Edit is enabled for this content type and publishing happens automatically as you make changes'
  }

  let dialog: DocumentActionDialogProps
  if (hasFeature === false) {
    dialog = {
      content: <Text size={1}>{FEATURE_NOT_SUPPORTED_TEXT}</Text>,
      header: 'Feature not available',
      onClose: onComplete,
      type: 'dialog',
    }
  } else {
    dialog = {
      content: fetchError ? (
        <ErrorCallout
          description="More information in the developer console."
          title="Something went wrong, unable to retrieve schedules."
        />
      ) : (
        <DocumentActionPropsProvider value={props}>
          {hasExistingSchedules ? (
            <Schedules schedules={schedules} />
          ) : (
            <EditScheduleForm onChange={onFormChange} value={formData}>
              <NewScheduleInfo
                id={id}
                schemaType={type}
                onActionTypeChange={handleActionTypeChange}
                actionType={actionType}
              />
            </EditScheduleForm>
          )}
        </DocumentActionPropsProvider>
      ),
      footer: !hasExistingSchedules && (
        <DialogFooter
          buttonText="Schedule"
          disabled={!formData?.date}
          icon={ClockIcon}
          onAction={handleScheduleCreate}
          onComplete={onComplete}
          tone="primary"
        />
      ),
      header: <DialogHeader title={title} />,
      onClose: onComplete,
      type: 'dialog',
    }
  }

  return {
    dialog: dialogOpen && dialog,
    disabled: isInitialLoading || !documentExists || liveEdit,
    label: title,
    icon: CalendarIcon,
    onHandle: handleDialogOpen,
    title: tooltip && <Box style={{maxWidth: '315px'}}>{tooltip}</Box>,
  }
}
