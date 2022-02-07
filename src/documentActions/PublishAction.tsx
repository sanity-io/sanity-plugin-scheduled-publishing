// TODO: reference and bring in functionality from Sanity's default PublishAction

import type {DocumentActionDescription, DocumentActionProps} from '@sanity/base'
import {PublishIcon} from '@sanity/icons'
import {useDocumentOperation} from '@sanity/react-hooks'
import React, {useEffect, useState} from 'react'
import DialogFooter from '../components/DialogFooter'
import DialogHeader from '../components/DialogHeader'
import DialogPublishContent from '../components/DialogPublishContent'
import usePollSchedules from '../hooks/usePollSchedules'
import {debugWithName} from '../utils/debug'

const debug = debugWithName('PublishAction')

const PublishAction = (props: DocumentActionProps): DocumentActionDescription => {
  const {draft, id, onComplete, type} = props

  // @ts-ignore
  const {publish} = useDocumentOperation(id, type)
  const [isPublishing, setIsPublishing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Poll for document schedules
  // TODO: handle error + isLoading states
  const {schedules} = usePollSchedules({documentId: id, state: 'scheduled'})
  debug('schedules', schedules)

  const hasSchedules = schedules.length > 0

  // Callbacks
  const handleDialogShow = () => {
    setDialogOpen(true)
  }

  const handlePublish = () => {
    publish.execute()
    // Close dialog
    onComplete()
  }

  // Effects
  useEffect(() => {
    if (isPublishing && !draft) {
      setIsPublishing(false)
    }
  }, [draft])

  return {
    color: 'success',
    dialog: dialogOpen && {
      content: <DialogPublishContent {...props} schedules={schedules} />,
      footer: (
        <DialogFooter
          buttonText="Publish"
          disabled={!draft}
          icon={PublishIcon}
          onAction={handlePublish}
          onComplete={onComplete}
        />
      ),
      header: <DialogHeader title="Confirm publish" />,
      onClose: onComplete,
      type: 'modal',
    },
    disabled: !draft,
    label: isPublishing ? 'Publishing...' : 'Publish',
    icon: PublishIcon,
    onHandle: hasSchedules ? handleDialogShow : handlePublish,
  }
}

export default PublishAction
