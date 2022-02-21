import {IntentLink} from '@sanity/base/components'
import {ClockIcon, WarningOutlineIcon} from '@sanity/icons'
import {Box, Card, Flex, Inline, Text} from '@sanity/ui'
import {SanityDefaultPreview} from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import React, {forwardRef, useEffect, useMemo, useState} from 'react'
import useDialogScheduleEdit from '../hooks/useDialogScheduleEdit'
import {Schedule} from '../types'
import {getPreviewStateObservable, PaneItemPreviewState} from '../utils/paneItemHelpers'
import DateWithTooltip from './DateWithTooltip'
import ScheduleContextMenu from './ScheduleContextMenu'
import {DraftStatus} from './studio/DocumentStatus/DraftStatus'
import {PublishedStatus} from './studio/DocumentStatus/PublishedStatus'
import User from './User'

interface Props {
  schedule: Schedule
}

const ScheduleItemTool = (props: Props) => {
  const {schedule} = props

  // Whilst schedules can contain multiple documents, this plugin specifically limits schedules to one document only
  const firstDocument = schedule.documents?.[0]

  // TODO: correctly infer type from schedule when exposed
  const schemaType = useMemo(() => schema.get('article'), [])

  const {DialogScheduleEdit, dialogProps, dialogScheduleEditShow} = useDialogScheduleEdit(schedule)
  const [paneItemPreview, setPaneItemPreview] = useState<PaneItemPreviewState>({})

  const {draft, published, isLoading} = paneItemPreview

  const visibleDocument = draft || published
  const invalidDocument = !visibleDocument && !isLoading
  const isScheduled = schedule.state === 'scheduled'

  const LinkComponent = useMemo(
    () =>
      forwardRef((linkProps: any, ref: any) => (
        <IntentLink
          {...linkProps}
          intent="edit"
          params={{
            type: schemaType.name,
            id: firstDocument?.documentId,
          }}
          ref={ref}
        />
      )),
    [IntentLink]
  )

  // Effects
  useEffect(() => {
    const subscription = getPreviewStateObservable(
      schemaType,
      firstDocument.documentId,
      ''
    ).subscribe((state) => {
      setPaneItemPreview(state)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return (
    <>
      {/* Dialogs */}
      {DialogScheduleEdit && <DialogScheduleEdit {...dialogProps} />}

      <Card padding={1} radius={2} shadow={1}>
        <Flex align="center" justify="space-between">
          <Card
            __unstable_focusRing
            as={visibleDocument ? LinkComponent : undefined}
            data-as={visibleDocument ? 'a' : undefined}
            flex={1}
            padding={1}
            radius={2}
            tabIndex={0}
          >
            <Flex align="center" justify="space-between">
              {/* Preview */}
              <Box style={{flexBasis: 'auto', flexGrow: 1}}>
                {invalidDocument ? (
                  <SanityDefaultPreview
                    layout="default"
                    media={<WarningOutlineIcon />}
                    subtitle={<em>It may have been since been deleted</em>}
                    title={<em>Document not found</em>}
                  />
                ) : (
                  <SanityDefaultPreview
                    icon={schemaType?.icon}
                    isPlaceholder={isLoading}
                    layout="default"
                    value={visibleDocument}
                  />
                )}
              </Box>

              {/* Schedule date */}
              <Box marginLeft={4} style={{flexShrink: 0, minWidth: '250px'}}>
                <Inline space={3}>
                  <Text size={2}>
                    <ClockIcon />
                  </Text>
                  <DateWithTooltip date={props.schedule.executeAt} />
                </Inline>
              </Box>

              {/* Avatar */}
              <Box marginX={3} style={{flexShrink: 0}}>
                <User id={schedule?.author} />
              </Box>

              {/* Document status */}
              <Box marginX={2} style={{flexShrink: 0}}>
                {!isLoading && (
                  <Inline space={4}>
                    <PublishedStatus document={published} />
                    <DraftStatus document={draft} />
                  </Inline>
                )}
              </Box>
            </Flex>
          </Card>

          {/* Context menu */}
          <Box marginLeft={1} style={{flexShrink: 0}}>
            <ScheduleContextMenu
              actions={{
                delete: true,
                edit: isScheduled && !invalidDocument,
                execute: isScheduled && !invalidDocument,
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

export default ScheduleItemTool
