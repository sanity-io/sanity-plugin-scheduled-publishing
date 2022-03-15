import {IntentLink} from '@sanity/base/components'
import {SchemaType} from '@sanity/types'
import {Box, Card, Flex, Inline, Text} from '@sanity/ui'
import {SanityDefaultPreview} from 'part:@sanity/base/preview'
import {getPublishedId} from 'part:@sanity/base/util/draft-utils'
import React, {forwardRef, useMemo} from 'react'
import {DOCUMENT_HAS_ERRORS_TEXT, DOCUMENT_HAS_WARNINGS_TEXT} from '../../constants'
import useDialogScheduleEdit from '../../hooks/useDialogScheduleEdit'
import {usePublishedId} from '../../hooks/usePublishedId'
import {Schedule, ValidationStatus} from '../../types'
import {PaneItemPreviewState} from '../../utils/paneItemHelpers'
import {useValidationState} from '../../utils/validationUtils'
import {ScheduleContextMenu} from '../scheduleContextMenu'
import {ValidationInfo} from '../validation/ValidationInfo'
import DateWithTooltip from './dateWithTooltip/DateWithTooltip'
import {DraftStatus} from './documentStatus/DraftStatus'
import {PublishedStatus} from './documentStatus/PublishedStatus'
import User from './User'

interface Props {
  previewState: PaneItemPreviewState
  schemaType: SchemaType
  schedule: Schedule
  validationStatus: ValidationStatus
}

const ToolPreview = (props: Props) => {
  const {previewState, schedule, schemaType, validationStatus} = props

  const visibleDocument = previewState.draft || previewState.published
  const isCompleted = schedule.state === 'succeeded'
  const isScheduled = schedule.state === 'scheduled'

  const {DialogScheduleEdit, dialogProps, dialogScheduleEditShow} = useDialogScheduleEdit(schedule)
  const {hasError} = useValidationState(validationStatus.markers)

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
  }, [IntentLink, visibleDocument])

  const {validationTone} = useValidationState(validationStatus.markers)
  return (
    <>
      {/* Dialogs (rendered outside of cards so they don't infer card colors) */}
      {DialogScheduleEdit && <DialogScheduleEdit {...dialogProps} />}

      <Card padding={1} radius={2} shadow={1} tone={validationTone}>
        <Flex align="center" justify="space-between">
          <Card
            __unstable_focusRing
            as={LinkComponent}
            data-as="a"
            flex={1}
            padding={1}
            radius={2}
            tabIndex={0}
            tone={validationTone}
          >
            <Flex align="center" justify="space-between">
              {/* Preview */}
              <Box style={{flexBasis: 'auto', flexGrow: 1}}>
                <SanityDefaultPreview
                  icon={schemaType?.icon}
                  isPlaceholder={previewState.isLoading}
                  layout="default"
                  value={visibleDocument}
                />
              </Box>

              {/* Schedule date */}
              <Box
                marginLeft={[3, 3, 4]}
                style={{
                  flexShrink: 0,
                  maxWidth: '250px',
                  width: '35%',
                }}
              >
                <DateWithTooltip date={schedule.executeAt} useElementQueries />
              </Box>

              {/* Avatar */}
              <Box display={['none', 'none', 'block']} marginX={3} style={{flexShrink: 0}}>
                <User id={schedule?.author} />
              </Box>

              {/* Document status */}
              <Box marginX={[2, 2, 3]} style={{flexShrink: 0}}>
                {!previewState.isLoading && (
                  <Inline space={4}>
                    <PublishedStatus document={previewState.published} />
                    <DraftStatus document={previewState.draft} />
                  </Inline>
                )}
              </Box>
            </Flex>
          </Card>

          <Box>
            <ValidationInfo
              markers={validationStatus.markers}
              type={schemaType}
              documentId={publishedId}
              menuHeader={
                <Box padding={2}>
                  <Text size={1}>
                    {hasError ? DOCUMENT_HAS_ERRORS_TEXT : DOCUMENT_HAS_WARNINGS_TEXT}
                  </Text>
                </Box>
              }
            />
          </Box>

          {/* Context menu */}
          <Box marginLeft={1} style={{flexShrink: 0}}>
            <ScheduleContextMenu
              actions={{
                clear: isCompleted,
                delete: !isCompleted,
                edit: isScheduled,
                execute: isScheduled,
              }}
              onEdit={dialogScheduleEditShow}
              schedule={schedule}
            />
          </Box>
        </Flex>
      </Card>
    </>
  )
}

export default ToolPreview
