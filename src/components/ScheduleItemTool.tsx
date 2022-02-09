import {UserAvatar} from '@sanity/base/components'
import {ClockIcon, EditIcon, EllipsisVerticalIcon, PublishIcon, TrashIcon} from '@sanity/icons'
import {Box, Button, Card, Flex, Inline, Menu, MenuButton, MenuItem, Text} from '@sanity/ui'
import {SanityDefaultPreview} from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import React, {useEffect, useMemo, useState} from 'react'
import useDialogScheduleEdit from '../hooks/useDialogScheduleEdit'
import useScheduleOperation from '../hooks/useScheduleOperation'
import useTimeZone from '../hooks/useTimeZone'
import {Schedule} from '../types'
import {debugWithName} from '../utils/debug'
import formatDateTz from '../utils/formatDateTz'
import {getPreviewStateObservable, PaneItemPreviewState} from '../utils/paneItemHelpers'
import {DraftStatus} from './DocumentStatus/DraftStatus'
import {PublishedStatus} from './DocumentStatus/PublishedStatus'

interface Props {
  schedule: Schedule
}

const debug = debugWithName('ScheduleItemTool')

const ScheduleItemTool = (props: Props) => {
  const {schedule} = props

  const {deleteSchedule, publishSchedule} = useScheduleOperation()
  const {DialogScheduleEdit, dialogProps, dialogScheduleEditShow} = useDialogScheduleEdit(schedule)
  const [paneItemPreview, setPaneItemPreview] = useState<PaneItemPreviewState>({})
  const schemaType = useMemo(() => schema.get('article'), [])
  const {timeZone} = useTimeZone()

  const formattedDateTime = formatDateTz({
    date: props.schedule.executeAt,
    timeZone,
  })

  const firstDocument = schedule.documents?.[0]

  const {draft, published, isLoading} = paneItemPreview

  // Callbacks
  const handlePublish = () => {
    debug('handlePublish')
    publishSchedule({schedule})
  }

  const handleDelete = () => {
    debug('handleDelete')
    deleteSchedule({schedule})
  }

  // Effects
  useEffect(() => {
    const subscription = getPreviewStateObservable(
      schemaType,
      firstDocument.documentId,
      'Test'
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

      <Card padding={2} radius={2} shadow={1}>
        <Flex align="center" justify="space-between">
          {/* Preview */}
          <Box
            style={{
              flexBasis: 'auto',
              flexGrow: 1,
            }}
          >
            <SanityDefaultPreview
              icon={schemaType?.icon}
              isPlaceholder={isLoading}
              layout="default"
              value={draft || published}
            />
          </Box>

          {/* Document status */}
          {/* TODO: add support for presence? */}
          <Box marginX={5} style={{flexShrink: 0}}>
            {!isLoading && (
              <Inline space={4}>
                <PublishedStatus document={published} />
                <DraftStatus document={draft} />
              </Inline>
            )}
          </Box>

          {/* Schedule date */}
          <Box
            marginLeft={4}
            style={{
              // border: '1px solid blue',
              flexShrink: 0,
              minWidth: '250px',
            }}
          >
            <Inline space={3}>
              <Text size={2}>
                <ClockIcon />
              </Text>
              <Text size={1}>{formattedDateTime}</Text>
            </Inline>
          </Box>

          {/* Document last updated date */}
          {/*
          <Box
            marginLeft={2}
            style={{
              border: '1px solid orange', //
              flexShrink: 0,
            }}
          >
            <Text size={1}>(last updated)</Text>
          </Box>
          */}

          {/* Avatar */}
          <Box marginLeft={2} style={{flexShrink: 0}}>
            <UserAvatar userId={schedule?.author} withTooltip />
          </Box>

          {/* Context menu */}
          <Box
            marginLeft={2}
            style={{
              // border: '1px solid red',
              flexShrink: 0,
            }}
          >
            <MenuButton
              button={
                <Button
                  icon={EllipsisVerticalIcon}
                  mode="bleed"
                  paddingX={2}
                  paddingY={3}
                  tone="default"
                />
              }
              id="contextMenu"
              menu={
                <Menu>
                  {schedule.state === 'scheduled' && (
                    <>
                      <MenuItem
                        icon={EditIcon}
                        onClick={dialogScheduleEditShow}
                        text="Edit"
                        tone="default"
                      />
                      <MenuItem
                        icon={PublishIcon}
                        onClick={handlePublish}
                        text="Publish now"
                        tone="default"
                      />
                    </>
                  )}
                  <MenuItem icon={TrashIcon} onClick={handleDelete} text="Delete" tone="critical" />
                </Menu>
              }
              placement="left"
              popover={{portal: true}}
            />
          </Box>
        </Flex>
      </Card>
    </>
  )
}

export default ScheduleItemTool
