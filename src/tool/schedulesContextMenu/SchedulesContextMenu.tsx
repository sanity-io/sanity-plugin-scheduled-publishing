import {CheckmarkIcon, EllipsisVerticalIcon, SortIcon} from '@sanity/icons'
import {Box, Button, Label, Menu, MenuButton, MenuItem} from '@sanity/ui'
import React from 'react'
import {useSchedules} from '../contexts/schedules'

const SchedulesContextMenu = () => {
  const {setSortBy, sortBy} = useSchedules()

  // Callbacks
  const handleSortByCreateAt = () => setSortBy('createdAt')
  const handleSortByExecuteAt = () => setSortBy('executeAt')

  return (
    <MenuButton
      button={
        <Button icon={EllipsisVerticalIcon} mode="bleed" paddingX={2} paddingY={3} tone="default" />
      }
      id="sort"
      menu={
        <Menu style={{minWidth: '250px'}}>
          <Box paddingX={3} paddingY={2}>
            <Label muted size={1}>
              Sort
            </Label>
          </Box>
          <MenuItem
            icon={SortIcon}
            iconRight={sortBy === 'createdAt' ? CheckmarkIcon : undefined}
            onClick={handleSortByCreateAt}
            text="Sort by time added"
          />
          <MenuItem
            icon={SortIcon}
            iconRight={sortBy === 'executeAt' ? CheckmarkIcon : undefined}
            onClick={handleSortByExecuteAt}
            text="Sort by time scheduled"
          />
        </Menu>
      }
    />
  )
}

export default SchedulesContextMenu
