import {useRouter} from '@sanity/base/router'
import {CheckmarkIcon, SelectIcon} from '@sanity/icons'
import {Box, Button, Label, Menu, MenuButton, MenuItem, TabList} from '@sanity/ui'
import React from 'react'
import {SCHEDULE_FILTERS, SCHEDULE_FILTER_DICTIONARY} from '../../constants'
import {useFilteredSchedules} from '../../hooks/useFilteredSchedules'
import {ScheduledDocValidations} from '../../types'
import {useSchedules} from '../contexts/schedules'
import ScheduleFilter from './ScheduleFilter'

interface Props {
  validations: ScheduledDocValidations
}

export const ScheduleFilters = (props: Props) => {
  const {validations} = props

  const {navigate} = useRouter()
  const {schedules, scheduleState} = useSchedules()

  const handleMenuClick = (state: Record<string, unknown>) => {
    navigate(state)
  }

  const currentSchedules = useFilteredSchedules(schedules, scheduleState)

  return (
    <>
      {/* Small breakpoints: Menu button */}
      <Box display={['block', 'block', 'none']}>
        <MenuButton
          button={
            <Button
              fontSize={1}
              iconRight={SelectIcon}
              mode="ghost"
              text={`${SCHEDULE_FILTER_DICTIONARY[scheduleState]} (${
                currentSchedules?.length || 0
              })`}
              tone="default"
            />
          }
          id="state"
          menu={
            <Menu style={{minWidth: '175px'}}>
              <Box paddingX={3} paddingY={2}>
                <Label muted size={1}>
                  Scheduled state
                </Label>
              </Box>
              {SCHEDULE_FILTERS.map((filter) => (
                <MenuItem
                  iconRight={filter === scheduleState ? CheckmarkIcon : undefined}
                  key={filter}
                  onClick={handleMenuClick.bind(undefined, {state: filter})}
                  text={SCHEDULE_FILTER_DICTIONARY[filter]}
                />
              ))}
            </Menu>
          }
          placement="bottom"
        />
      </Box>

      {/* Larger breakpoints: Horizontal tabs */}
      <Box display={['none', 'none', 'block']}>
        <TabList space={2}>
          {SCHEDULE_FILTERS.map((filter) => (
            <ScheduleFilter
              key={filter}
              schedules={schedules}
              selected={scheduleState === filter}
              state={filter}
              validations={filter === 'scheduled' ? validations : undefined}
            />
          ))}
        </TabList>
      </Box>
    </>
  )
}
