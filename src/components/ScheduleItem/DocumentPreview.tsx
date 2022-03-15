import {Box, Card, Flex} from '@sanity/ui'
import React, {useMemo} from 'react'
import {useDocumentActionProps} from '../../contexts/documentActionProps'
import useDialogScheduleEdit from '../../hooks/useDialogScheduleEdit'
import {Schedule, ValidationStatus} from '../../types'
import DateWithTooltip from '../DateWithTooltip'
import ScheduleContextMenu from '../ScheduleContextMenu'
import User from '../User'
import {ValidationInfo} from '../validation/ValidationInfo'
import {useValidationState} from '../../utils/validationUtils'
import {SchemaType} from '@sanity/types'
import {getScheduledDocumentId} from '../../utils/paneItemHelpers'

interface Props {
  schedule: Schedule
  schemaType: SchemaType
  validationStatus: ValidationStatus
}

const DocumentPreview = (props: Props) => {
  const {schedule, validationStatus, schemaType} = props

  const {DialogScheduleEdit, dialogProps, dialogScheduleEditShow} = useDialogScheduleEdit(schedule)
  const {onComplete} = useDocumentActionProps()
  const {hasError, hasWarning} = useValidationState(validationStatus.markers)
  const publishedId = useMemo(() => getScheduledDocumentId(schedule), [schedule])
  return (
    <>
      {/* Dialogs (rendered outside of cards so they don't infer card colors) */}
      {DialogScheduleEdit && <DialogScheduleEdit {...dialogProps} />}

      <Card
        __unstable_focusRing
        data-as="a"
        flex={1}
        onClick={dialogScheduleEditShow}
        padding={1}
        radius={2}
        shadow={1}
        tabIndex={0}
      >
        <Flex align="center" gap={2} justify="space-between" paddingX={2} style={{height: '35px'}}>
          {/* Schedule date */}
          <DateWithTooltip date={props.schedule.executeAt} />

          {/* Avatar */}
          <User id={schedule?.author} />
        </Flex>
      </Card>

      {(hasError || hasWarning) && (
        <Box marginX={2}>
          <ValidationInfo
            markers={validationStatus.markers}
            type={schemaType}
            documentId={publishedId}
          />
        </Box>
      )}

      {/* Context menu */}
      <Box marginLeft={1} style={{flexShrink: 0}}>
        <ScheduleContextMenu
          actions={{
            delete: true,
            edit: true,
          }}
          onDelete={onComplete}
          onEdit={dialogScheduleEditShow}
          schedule={schedule}
        />
      </Box>
    </>
  )
}

export default DocumentPreview
