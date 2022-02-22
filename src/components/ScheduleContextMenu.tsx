import {
  useCurrentUser,
  unstable_useDocumentPairPermissions as useDocumentPairPermissions,
} from '@sanity/base/hooks'
import {
  CheckmarkCircleIcon,
  EditIcon,
  EllipsisVerticalIcon,
  PublishIcon,
  TrashIcon,
} from '@sanity/icons'
import {Button, Menu, MenuButton} from '@sanity/ui'
import schema from 'part:@sanity/base/schema'
import React, {useMemo} from 'react'
import useScheduleOperation from '../hooks/useScheduleOperation'
import {Schedule} from '../types'
import MenuItemWithPermissionsTooltip from './MenuItemWithPermissionsTooltip'

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
}

const ScheduleContextMenu = (props: Props) => {
  const {actions, onDelete, onEdit, schedule} = props

  // TODO: correctly infer type from schedule when exposed
  const schemaType = useMemo(() => schema.get('article'), [])

  // Whilst schedules can contain multiple documents, this plugin specifically limits schedules to one document only
  const firstDocument = schedule.documents?.[0]

  // Studio hooks
  const {value: currentUser} = useCurrentUser()
  const [permissions, isPermissionsLoading] = useDocumentPairPermissions({
    id: firstDocument.documentId,
    type: schemaType.name,
    permission: 'publish',
  })

  const {deleteSchedule, executeSchedule} = useScheduleOperation()

  const insufficientPermissions = !isPermissionsLoading && !permissions?.granted

  // Callbacks
  const handleEdit = () => {
    onEdit?.()
  }

  const handleDelete = () => {
    deleteSchedule({schedule}).then(() => onDelete?.())
  }

  const handleExecute = () => {
    executeSchedule({schedule})
  }

  return (
    <MenuButton
      button={
        <Button icon={EllipsisVerticalIcon} mode="bleed" paddingX={2} paddingY={3} tone="default" />
      }
      id="contextMenu"
      menu={
        <Menu>
          {actions?.edit && (
            <MenuItemWithPermissionsTooltip
              currentUser={currentUser}
              hasPermission={!insufficientPermissions}
              icon={EditIcon}
              onClick={handleEdit}
              permissionsOperationLabel="edit schedules"
              title="Edit schedule"
            />
          )}
          {actions?.execute && (
            <MenuItemWithPermissionsTooltip
              currentUser={currentUser}
              hasPermission={!insufficientPermissions}
              icon={PublishIcon}
              onClick={handleExecute}
              permissionsOperationLabel="execute schedules"
              title="Publish now"
            />
          )}
          {actions?.delete && (
            <MenuItemWithPermissionsTooltip
              currentUser={currentUser}
              hasPermission={!insufficientPermissions}
              icon={TrashIcon}
              onClick={handleDelete}
              permissionsOperationLabel="delete schedules"
              title="Delete schedule"
              tone="critical"
            />
          )}
          {actions?.clear && (
            <MenuItemWithPermissionsTooltip
              currentUser={currentUser}
              hasPermission={!insufficientPermissions}
              icon={CheckmarkCircleIcon}
              onClick={handleDelete}
              permissionsOperationLabel="delete schedules"
              title="Clear completed schedule"
            />
          )}
        </Menu>
      }
      placement="left"
      popover={{portal: true}}
    />
  )
}

export default ScheduleContextMenu
