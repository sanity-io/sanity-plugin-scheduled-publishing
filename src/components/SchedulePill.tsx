import {UserAvatar} from '@sanity/base/components'
import {ClockIcon, TrashIcon} from '@sanity/icons'
import {
  Box,
  Button,
  Card,
  Flex,
  Inline,
  Menu,
  MenuButton,
  MenuItem,
  Text,
  useToast,
} from '@sanity/ui'
import {format} from 'date-fns'
import React from 'react'
import {deleteSchedule} from '../actions/schedule'
import {Schedule} from '../types'

interface Props {
  onComplete?: () => void
  schedule: Schedule
}

const SchedulePill = (props: Props) => {
  const {onComplete, schedule} = props

  // Example: Fri 24 Dec 2021 6:00 AM
  const formattedDateTime = format(new Date(props.schedule.executeAt), 'iii d MMM yyyy p')

  const toast = useToast()

  const handleDelete = () => {
    deleteSchedule({schedule})
      .then(() => {
        // Dispatch toast
        toast.push({
          closable: true,
          status: 'success',
          title: 'Schedule deleted',
        })
        // Close dialog
        if (onComplete) {
          onComplete()
        }
      })
      .catch((err) => {
        // TODO: handle error
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

export default SchedulePill
