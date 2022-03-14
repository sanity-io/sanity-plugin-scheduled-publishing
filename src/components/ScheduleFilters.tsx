import {useRouter} from '@sanity/base/router'
import {CheckmarkIcon, SelectIcon} from '@sanity/icons'
import {Box, Button, Label, Menu, MenuButton, MenuItem, TabList} from '@sanity/ui'
import React from 'react'
import {SCHEDULE_FILTER_DICTIONARY, SCHEDULE_STATES} from '../constants'
import {Schedule, ScheduleState} from '../types'
import ScheduleFilter from './ScheduleFilter'

interface Props {
  schedules: Schedule[] | undefined
  scheduleState: ScheduleState
}

// TODO: refactor, filters should be receiving a much smaller snapshot of data

const ScheduleFilters = (props: Props) => {
  const {scheduleState, schedules} = props

  const {navigate} = useRouter()

  const handleMenuClick = (state: Record<string, unknown>) => {
    navigate(state)
  }

  const currentSchedules = schedules?.filter((schedule) => schedule.state === scheduleState)

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
              {SCHEDULE_STATES.map((filter) => (
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
          {SCHEDULE_STATES.map((filter) => (
            <ScheduleFilter
              count={schedules?.filter((schedule) => schedule.state === filter).length || 0}
              critical={filter === 'cancelled'}
              key={filter}
              selected={scheduleState === filter}
              state={filter}
            />
          ))}
        </TabList>
      </Box>
    </>
  )
}

export default ScheduleFilters
