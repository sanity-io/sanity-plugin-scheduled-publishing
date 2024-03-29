import {getPublishedId, Preview, SanityDefaultPreview, SchemaType} from 'sanity'
import {IntentLink} from 'sanity/router'
import React, {forwardRef, useMemo} from 'react'
import useDialogScheduleEdit from '../../hooks/useDialogScheduleEdit'
import {usePublishedId} from '../../hooks/usePublishedId'
import {Schedule} from '../../types'
import {PaneItemPreviewState} from '../../utils/paneItemHelpers'
import {ScheduleContextMenu} from '../scheduleContextMenu'
import PreviewWrapper from './PreviewWrapper'

interface Props {
  previewState: PaneItemPreviewState
  schedule: Schedule
  schemaType: SchemaType
}

const ToolPreview = (props: Props) => {
  const {previewState, schedule, schemaType} = props

  const visibleDocument = previewState.draft || previewState.published
  const isCompleted = schedule.state === 'succeeded'
  const isScheduled = schedule.state === 'scheduled'

  const {DialogScheduleEdit, dialogProps, dialogScheduleEditShow} = useDialogScheduleEdit(schedule)

  const publishedId = usePublishedId(visibleDocument?._id)

  const LinkComponent = useMemo(() => {
    return forwardRef((linkProps: any, ref: any) => (
      <IntentLink
        {...linkProps}
        intent="edit"
        params={{
          type: schemaType.name,
          id: visibleDocument && getPublishedId(visibleDocument?._id),
        }}
        ref={ref}
      />
    ))
  }, [schemaType, visibleDocument])

  return (
    <>
      {/* Dialogs (rendered outside of cards so they don't infer card colors) */}
      {DialogScheduleEdit && <DialogScheduleEdit {...dialogProps} />}
      <PreviewWrapper
        contextMenu={
          <ScheduleContextMenu
            actions={{
              clear: isCompleted,
              delete: !isCompleted,
              edit: isScheduled,
              execute: isScheduled,
            }}
            onEdit={dialogScheduleEditShow}
            schedule={schedule}
            schemaType={schemaType}
          />
        }
        linkComponent={LinkComponent}
        previewState={previewState}
        publishedDocumentId={publishedId}
        schedule={schedule}
        schemaType={schemaType}
        useElementQueries
      >
        {previewState.isLoading ? (
          <SanityDefaultPreview
            icon={schemaType?.icon as React.ComponentType}
            isPlaceholder={previewState.isLoading}
            layout="default"
          />
        ) : (
          <Preview layout="default" schemaType={schemaType} value={visibleDocument} />
        )}
      </PreviewWrapper>
    </>
  )
}

export default ToolPreview
