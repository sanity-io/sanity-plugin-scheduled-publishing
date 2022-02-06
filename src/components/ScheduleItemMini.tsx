import {UserAvatar} from '@sanity/base/components'
import {ClockIcon, EditIcon, EllipsisVerticalIcon, TrashIcon} from '@sanity/icons'
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

const debug = debugWithName('ScheduleItemMini')

const ScheduleItemMini = (props: Props) => {
  const {onComplete, schedule} = props

  // Example: Fri 24 Dec 2021 at 6:00 AM
  const formattedDateTime = format(new Date(props.schedule.executeAt), `iii d MMM yyyy 'at' p`)

  const {deleteSchedule} = useScheduleOperation()

  const handleDelete = () => {
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

  return (
    <Card paddingLeft={4} paddingRight={2} paddingY={2} radius={2} shadow={1}>
      <Flex align="center" justify="space-between">
        <Inline space={4}>
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
              id="delete"
              menu={
                <Menu>
                  <MenuItem icon={EditIcon} onClick={handleEdit} text="Edit" tone="default" />
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

export default ScheduleItemMini
