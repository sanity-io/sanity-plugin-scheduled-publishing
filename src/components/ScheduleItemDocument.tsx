import {ClockIcon, EditIcon, EllipsisVerticalIcon, TrashIcon} from '@sanity/icons'
import {Box, Button, Card, Flex, Inline, Menu, MenuButton, MenuItem, Text} from '@sanity/ui'
import React from 'react'
import {useDocumentActionProps} from '../contexts/documentActionProps'
import useDialogScheduleEdit from '../hooks/useDialogScheduleEdit'
import useScheduleOperation from '../hooks/useScheduleOperation'
import {Schedule} from '../types'
import {debugWithName} from '../utils/debug'
import DateWithTooltip from './DateWithTooltip'
import User from './User'

interface Props {
  schedule: Schedule
}

const debug = debugWithName('ScheduleItemDocument')

const ScheduleItemDocument = (props: Props) => {
  const {schedule} = props

  const {DialogScheduleEdit, dialogProps, dialogScheduleEditShow} = useDialogScheduleEdit(schedule)
  const {onComplete} = useDocumentActionProps()
  const {deleteSchedule} = useScheduleOperation()

  const handleDelete = () => {
    debug('handleDelete')
    deleteSchedule({schedule}).then(() => {
      // Close dialog
      if (onComplete) {
        onComplete()
      }
    })
  }

  return (
    <>
      {/* Dialogs */}
      {DialogScheduleEdit && <DialogScheduleEdit {...dialogProps} />}

      <Card paddingLeft={4} paddingRight={2} paddingY={2} radius={2} shadow={1}>
        <Flex align="center" justify="space-between">
          {/* Schedule date */}
          <Box>
            <Inline space={4}>
              <Text size={2}>
                <ClockIcon />
              </Text>
              <DateWithTooltip date={props.schedule.executeAt} />
            </Inline>
          </Box>

          {/* Avatar + Context menu */}
          <Box marginLeft={2} style={{flexShrink: 0}}>
            <Inline space={2}>
              <User id={schedule?.author} />
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
                id="delete"
                menu={
                  <Menu>
                    <MenuItem
                      icon={EditIcon}
                      onClick={dialogScheduleEditShow}
                      text="Edit schedule"
                      tone="default"
                    />
                    <MenuItem
                      icon={TrashIcon}
                      onClick={handleDelete}
                      text="Delete schedule"
                      tone="critical"
                    />
                  </Menu>
                }
                placement="left"
                popover={{portal: true}}
              />
            </Inline>
          </Box>
        </Flex>
      </Card>
    </>
  )
}

export default ScheduleItemDocument
