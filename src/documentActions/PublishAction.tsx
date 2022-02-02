// TODO: reference and bring in functionality from Sanity's default PublishAction

import type {DocumentActionDescription, DocumentActionProps} from '@sanity/base'
import {PublishIcon} from '@sanity/icons'
import {useDocumentOperation} from '@sanity/react-hooks'
import React, {useEffect, useState} from 'react'
import useSWR from 'swr'
import DialogFooter from '../components/DialogFooter'
import DialogPublishContent from '../components/DialogPublishContent'
import DialogHeader from '../components/DialogHeader'
import {sanityClient} from '../lib/client'
import {debugWithName} from '../utils/debug'
import generateSwrQueryKey from '../utils/generateSwrQueryKey'

const debug = debugWithName('publish-action')

const fetcher = (key: string) => {
  const {query, uri} = JSON.parse(key)
  return sanityClient.request({query, uri})
}

const PublishAction = (props: DocumentActionProps): DocumentActionDescription => {
  const {draft, id, onComplete: onClose, type} = props

  // @ts-ignore
  const {publish} = useDocumentOperation(id, type)
  const [isPublishing, setIsPublishing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Poll for document schedules
  const queryKey = generateSwrQueryKey({documentId: id})
  const {data: schedules = [], error} = useSWR(queryKey, fetcher, {
    refreshInterval: 5000,
  })
  debug('schedules', schedules)

  const hasSchedules = schedules.length > 0

  // Callbacks
  const handleDialogShow = () => {
    setDialogOpen(true)
  }

  const handlePublish = () => {
    publish.execute()
    onClose()
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
          onClose={onClose}
        />
      ),
      header: <DialogHeader title="Confirm publish" />,
      onClose,
      type: 'modal',
    },
    disabled: !draft,
    label: isPublishing ? 'Publishing...' : 'Publish',
    icon: PublishIcon,
    onHandle: hasSchedules ? handleDialogShow : handlePublish,
  }
}

export default PublishAction
