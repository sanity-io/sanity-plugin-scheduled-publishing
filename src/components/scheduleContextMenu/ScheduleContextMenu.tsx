import {EllipsisVerticalIcon} from '@sanity/icons'
import {SchemaType} from '@sanity/types'
import {Button, Menu, MenuButton} from '@sanity/ui'
import React from 'react'
import {Schedule} from '../../types'
import ContextMenuItems from './ContextMenuItems'

interface Props {
  actions?: {
    clear?: boolean
    delete?: boolean
    edit?: boolean
    execute?: boolean
  }
  onDelete?: () => void
  onEdit?: () => void
  schedule: Schedule
  schemaType: SchemaType
}

export const ScheduleContextMenu = (props: Props) => {
  const {actions, onDelete, onEdit, schedule, schemaType} = props

  return (
    <MenuButton
      button={
        <Button icon={EllipsisVerticalIcon} mode="bleed" paddingX={2} paddingY={3} tone="default" />
      }
      id="contextMenu"
      menu={
        <Menu>
          <ContextMenuItems
            actions={actions}
            onDelete={onDelete}
            onEdit={onEdit}
            schedule={schedule}
            schemaType={schemaType}
          />
        </Menu>
      }
      placement="left"
      popover={{portal: true, tone: 'default'}}
    />
  )
}
