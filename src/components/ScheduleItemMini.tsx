import {UserAvatar} from '@sanity/base/components'
import {ClockIcon, TrashIcon} from '@sanity/icons'
import {Box, Button, Card, Flex, Inline, Menu, MenuButton, MenuItem, Text} from '@sanity/ui'
import {format} from 'date-fns'
import React from 'react'
import useScheduleOperation from '../hooks/useScheduleOperation'
import {Schedule} from '../types'

interface Props {
  onComplete?: () => void
  schedule: Schedule
}

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

  return (
    <Card paddingLeft={4} paddingRight={2} paddingY={2} radius={2} shadow={1}>
      <Flex align="center" justify="space-between">
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
              button={<Button icon={TrashIcon} mode="bleed" tone="default" />}
              id="delete"
              menu={
                <Menu>
                  <MenuItem onClick={handleDelete} text="Confirm delete" tone="critical" />
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
