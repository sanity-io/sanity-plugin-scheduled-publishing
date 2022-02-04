import {UserAvatar} from '@sanity/base/components'
import {ClockIcon, EditIcon, EllipsisVerticalIcon, PublishIcon, TrashIcon} from '@sanity/icons'
import {Box, Button, Card, Flex, Inline, Menu, MenuButton, MenuItem, Text} from '@sanity/ui'
import {format} from 'date-fns'
import React from 'react'
import useScheduleOperation from '../hooks/useScheduleOperation'
import {Schedule} from '../types'
import {debugWithName} from '../utils/debug'

interface Props {
  onComplete?: () => void
  schedule: Schedule
}

const debug = debugWithName('ScheduleItem')

const ScheduleItem = (props: Props) => {
  const {onComplete, schedule} = props

  const {deleteSchedule} = useScheduleOperation()

  // Example: Fri 24 Dec 2021 at 6:00 AM
  const formattedDateTime = format(new Date(props.schedule.executeAt), `iii d MMM yyyy 'at' p`)

  const firstDocument = schedule.documents?.[0]

  const handlePublishImmediately = () => {
    debug('handlePublishImmediately')
  }

  const handleDelete = () => {
    debug('handleDelete')
    deleteSchedule({schedule}).then(() => {
      // Close dialog
      if (onComplete) {
        onComplete()
      }
    })
  }

  const handleEdit = () => {
    debug('handleEdit')
  }

  debug('schedule', schedule)
  debug('firstDocument', firstDocument.documentId)

  return (
    <Card paddingLeft={4} paddingRight={2} paddingY={2} radius={2} shadow={1}>
      <Flex align="center" justify="space-between">
        <Text muted size={1}>
          {firstDocument.documentId}
        </Text>

        <Inline space={3}>
          <Text size={2}>
            <ClockIcon />
          </Text>
          <Text size={1}>{formattedDateTime}</Text>
        </Inline>

        <Box>
          <Inline space={2}>
            <UserAvatar userId={schedule?.author} withTooltip />
            <MenuButton
              button={<Button icon={EllipsisVerticalIcon} mode="bleed" tone="default" />}
              id="contextMenu"
              menu={
                <Menu>
                  <MenuItem
                    icon={EditIcon}
                    onClick={handleEdit}
                    text="Edit schedule"
                    tone="default"
                  />
                  <MenuItem
                    icon={PublishIcon}
                    onClick={handlePublishImmediately}
                    text="Publish now"
                    tone="default"
                  />
                  <MenuItem icon={TrashIcon} onClick={handleDelete} text="Delete" tone="critical" />
                </Menu>
              }
              placement="left"
              popover={{
                portal: true,
              }}
            />
          </Inline>
        </Box>
      </Flex>
    </Card>
  )
}

export default ScheduleItem
