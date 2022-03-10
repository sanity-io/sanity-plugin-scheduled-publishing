import {IntentLink} from '@sanity/base/components'
import {SchemaType} from '@sanity/types'
import {Box, Card, Flex, Inline} from '@sanity/ui'
import {SanityDefaultPreview} from 'part:@sanity/base/preview'
import {getPublishedId} from 'part:@sanity/base/util/draft-utils'
import React, {forwardRef, useMemo} from 'react'
import useDialogScheduleEdit from '../../hooks/useDialogScheduleEdit'
import {Schedule, ValidationStatus} from '../../types'
import {PaneItemPreviewState} from '../../utils/paneItemHelpers'
import DateWithTooltip from '../DateWithTooltip'
import ScheduleContextMenu from '../ScheduleContextMenu'
import {DraftStatus} from '../studio/DocumentStatus/DraftStatus'
import {PublishedStatus} from '../studio/DocumentStatus/PublishedStatus'
import User from '../User'
import {ItemValidation} from './ItemValidation'
import {useValidationState} from '../../utils/validation-utils'

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

  const {validationTone, hasError, hasWarning} = useValidationState(validationStatus)
  return (
    <Card padding={1} radius={2} shadow={1} tone={validationTone}>
      <Flex align="center" justify="space-between">
        {/* Dialogs */}
        {DialogScheduleEdit && <DialogScheduleEdit {...dialogProps} />}

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
                <ItemValidation
                  validationStatus={validationStatus}
                  tone={validationTone}
                  hasError={hasError}
                  hasWarning={hasWarning}
                  type={schemaType}
                />
              </Inline>
            )}
          </Box>
        </Flex>
      </Card>

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
  )
}

export default ToolPreview
