import {useDocumentPairPermissions} from 'sanity/_unstable'
import {CalendarIcon, CheckmarkCircleIcon, PublishIcon, TrashIcon} from '@sanity/icons'
import {SchemaType, useCurrentUser} from 'sanity'
import React from 'react'
import MenuItemWithPermissionsTooltip from './MenuItemWithPermissionsTooltip'
import useScheduleOperation from '../../hooks/useScheduleOperation'
import {getScheduledDocument} from '../../utils/paneItemHelpers'
import {Schedule} from '../../types'

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

const ContextMenuItems = (props: Props) => {
  const {actions, onDelete, onEdit, schedule, schemaType} = props

  const firstDocument = getScheduledDocument(schedule)

  const currentUser = useCurrentUser()
  const [permissions, isPermissionsLoading] = useDocumentPairPermissions({
    id: firstDocument.documentId,
    type: schemaType?.name,
    permission: 'publish',
  })
  const {deleteSchedule, publishSchedule} = useScheduleOperation()

  const insufficientPermissions = !isPermissionsLoading && !permissions?.granted

  // Callbacks
  const handleEdit = () => {
    onEdit?.()
  }

  const handleDelete = () => {
    deleteSchedule({schedule}).then(() => onDelete?.())
  }

  const handleExecute = () => {
    publishSchedule({schedule})
  }

  if (!currentUser) {
    return null
  }

  return (
    <>
      {actions?.edit && (
        <MenuItemWithPermissionsTooltip
          currentUser={currentUser}
          hasPermission={!insufficientPermissions}
          icon={CalendarIcon}
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
    </>
  )
}

export default ContextMenuItems
