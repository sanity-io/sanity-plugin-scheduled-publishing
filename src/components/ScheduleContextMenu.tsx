import {
  useCurrentUser,
  unstable_useDocumentPairPermissions as useDocumentPairPermissions,
} from '@sanity/base/hooks'
import {EditIcon, EllipsisVerticalIcon, PublishIcon, TrashIcon} from '@sanity/icons'
import {Button, Menu, MenuButton} from '@sanity/ui'
import schema from 'part:@sanity/base/schema'
import React, {useMemo} from 'react'
import useDialogScheduleEdit from '../hooks/useDialogScheduleEdit'
import useScheduleOperation from '../hooks/useScheduleOperation'
import {Schedule} from '../types'
import MenuItemWithPermissionsTooltip from './MenuItemWithPermissionsTooltip'

interface Props {
  actions?: {
    delete?: boolean
    edit?: boolean
    execute?: boolean
  }
  onDelete?: () => void
  schedule: Schedule
}

const ScheduleContextMenu = (props: Props) => {
  const {actions, onDelete, schedule} = props

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

  const {deleteSchedule, publishSchedule} = useScheduleOperation()
  const {dialogScheduleEditShow} = useDialogScheduleEdit(schedule)

  const insufficientPermissions = !isPermissionsLoading && !permissions?.granted

  // Callbacks
  const handlePublish = () => {
    publishSchedule({schedule})
  }

  const handleDelete = () => {
    deleteSchedule({schedule}).then(() => onDelete?.())
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
              onClick={dialogScheduleEditShow}
              permissionsOperationLabel="edit schedules"
              title="Edit schedule"
            />
          )}
          {actions?.execute && (
            <MenuItemWithPermissionsTooltip
              currentUser={currentUser}
              hasPermission={!insufficientPermissions}
              icon={PublishIcon}
              onClick={handlePublish}
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
        </Menu>
      }
      placement="left"
      popover={{portal: true}}
    />
  )
}

export default ScheduleContextMenu
