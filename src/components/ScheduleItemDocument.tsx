import {ClockIcon} from '@sanity/icons'
import {Box, Card, Flex, Inline, Text} from '@sanity/ui'
import React from 'react'
import {useDocumentActionProps} from '../contexts/documentActionProps'
import useDialogScheduleEdit from '../hooks/useDialogScheduleEdit'
import {Schedule} from '../types'
import DateWithTooltip from './DateWithTooltip'
import ScheduleContextMenu from './ScheduleContextMenu'
import User from './User'

interface Props {
  schedule: Schedule
}

const ScheduleItemDocument = (props: Props) => {
  const {schedule} = props

  const {DialogScheduleEdit, dialogProps, dialogScheduleEditShow} = useDialogScheduleEdit(schedule)
  const {onComplete} = useDocumentActionProps()

  return (
    <>
      {/* Dialogs */}
      {DialogScheduleEdit && <DialogScheduleEdit {...dialogProps} />}

      <Card padding={1} radius={2} shadow={1}>
        <Flex align="center" justify="space-between">
          <Card
            __unstable_focusRing
            data-as="a"
            flex={1}
            onClick={dialogScheduleEditShow}
            padding={1}
            radius={2}
            shadow={1}
            tabIndex={0}
          >
            <Flex
              align="center"
              gap={2}
              justify="space-between"
              paddingX={2}
              style={{height: '35px'}}
            >
              {/* Schedule date */}
              <Inline space={3}>
                <Text size={2}>
                  <ClockIcon />
                </Text>
                <DateWithTooltip date={props.schedule.executeAt} />
              </Inline>

              {/* Avatar */}
              <User id={schedule?.author} />
            </Flex>
          </Card>

          {/* Context menu */}
          <Box marginLeft={1} style={{flexShrink: 0}}>
            <ScheduleContextMenu
              actions={{
                delete: true,
                edit: true,
              }}
              onDelete={onComplete}
              onEdit={dialogScheduleEditShow}
              schedule={schedule}
            />
          </Box>
        </Flex>
      </Card>
    </>
  )
}

export default ScheduleItemDocument
