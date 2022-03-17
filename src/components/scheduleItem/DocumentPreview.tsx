import {SchemaType} from '@sanity/types'
import React, {useMemo} from 'react'
import {useDocumentActionProps} from '../../contexts/documentActionProps'
import useDialogScheduleEdit from '../../hooks/useDialogScheduleEdit'
import {Schedule, ValidationStatus} from '../../types'
import {getScheduledDocumentId} from '../../utils/paneItemHelpers'
import {ScheduleContextMenu} from '../scheduleContextMenu'
import PreviewWrapper from './PreviewWrapper'

interface Props {
  schedule: Schedule
  schemaType: SchemaType
  validationStatus: ValidationStatus
}

const DocumentPreview = (props: Props) => {
  const {schedule, validationStatus, schemaType} = props

  const {DialogScheduleEdit, dialogProps, dialogScheduleEditShow} = useDialogScheduleEdit(schedule)
  const {onComplete} = useDocumentActionProps()
  const publishedId = useMemo(() => getScheduledDocumentId(schedule), [schedule])

  return (
    <>
      {/* Dialogs (rendered outside of cards so they don't infer card colors) */}
      {DialogScheduleEdit && <DialogScheduleEdit {...dialogProps} />}

      <PreviewWrapper
        contextMenu={
          <ScheduleContextMenu
            actions={{
              delete: true,
              edit: true,
            }}
            onDelete={onComplete}
            onEdit={dialogScheduleEditShow}
            schedule={schedule}
            schemaType={schemaType}
          />
        }
        markers={validationStatus?.markers}
        onClick={dialogScheduleEditShow}
        publishedDocumentId={publishedId}
        schedule={schedule}
        schemaType={schemaType}
      />
    </>
  )
}

export default DocumentPreview
