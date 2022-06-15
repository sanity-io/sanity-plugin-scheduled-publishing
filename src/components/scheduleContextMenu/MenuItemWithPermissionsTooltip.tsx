import {InsufficientPermissionsMessage} from 'sanity/_unstable'
import {CurrentUser} from 'sanity'
import {Box, MenuItem, SelectableTone, Tooltip} from '@sanity/ui'
import React, {ComponentType, ReactNode} from 'react'

interface Props {
  currentUser?: CurrentUser
  hasPermission?: boolean
  icon: ComponentType | ReactNode
  onClick: () => void
  permissionsOperationLabel?: string
  title: string
  tone?: SelectableTone
}

const MenuItemWithPermissionsTooltip = (props: Props) => {
  const {currentUser, hasPermission, icon, onClick, permissionsOperationLabel, title, tone} = props
  return (
    <Tooltip
      content={
        <Box paddingX={2} paddingY={1}>
          <InsufficientPermissionsMessage
            currentUser={currentUser}
            operationLabel={permissionsOperationLabel}
          />
        </Box>
      }
      disabled={hasPermission}
      placement="left"
      portal
    >
      {/* Wrapper element to allow disabled menu items to trigger tooltips */}
      <div>
        <MenuItem
          disabled={!hasPermission}
          icon={icon}
          onClick={onClick}
          text={title}
          tone={tone}
        />
      </div>
    </Tooltip>
  )
}

export default MenuItemWithPermissionsTooltip
