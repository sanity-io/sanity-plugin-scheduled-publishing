import {IntentLink} from '@sanity/base/components'
import {SchemaType} from '@sanity/types'
import {Box, Card, Flex, Inline} from '@sanity/ui'
import {SanityDefaultPreview} from 'part:@sanity/base/preview'
import {getPublishedId} from 'part:@sanity/base/util/draft-utils'
import React, {forwardRef, useMemo} from 'react'
import useDialogScheduleEdit from '../../hooks/useDialogScheduleEdit'
import {Schedule} from '../../types'
import {PaneItemPreviewState} from '../../utils/paneItemHelpers'
import DateWithTooltip from '../DateWithTooltip'
import ScheduleContextMenu from '../ScheduleContextMenu'
import {DraftStatus} from '../studio/DocumentStatus/DraftStatus'
import {PublishedStatus} from '../studio/DocumentStatus/PublishedStatus'
import User from '../User'

interface Props {
  previewState: PaneItemPreviewState
  schemaType: SchemaType
  schedule: Schedule
}

const ToolPreview = (props: Props) => {
  const {previewState, schedule, schemaType} = props

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

  return (
    <>
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
          <Box marginLeft={4} style={{flexShrink: 0, minWidth: '250px'}}>
            <DateWithTooltip date={schedule.executeAt} useElementQueries />
          </Box>

          {/* Avatar */}
          <Box marginX={3} style={{flexShrink: 0}}>
            <User id={schedule?.author} />
          </Box>

          {/* Document status */}
          <Box marginX={3} style={{flexShrink: 0}}>
            {!previewState.isLoading && (
              <Inline space={4}>
                <PublishedStatus document={previewState.published} />
                <DraftStatus document={previewState.draft} />
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
    </>
  )
}

export default ToolPreview
