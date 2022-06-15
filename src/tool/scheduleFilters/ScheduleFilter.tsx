import {StateLink} from 'sanity/_unstable'
import {red, white} from '@sanity/color'
import {Box, Flex, Tab, Text} from '@sanity/ui'
import React from 'react'
import {SCHEDULE_STATE_DICTIONARY} from '../../constants'
import {Schedule, ScheduleState} from '../../types'
import {useFilteredSchedules} from '../../hooks/useFilteredSchedules'

interface Props {
  schedules: Schedule[]
  selected?: boolean
  state: ScheduleState
}

const ScheduleFilter = (props: Props) => {
  const {selected, schedules, state, ...rest} = props

  const count = useFilteredSchedules(schedules, state).length

  const hasItems = count > 0

  const critical = state === 'cancelled'
  const criticalCount = state === 'cancelled' && hasItems

  return (
    <Tab
      // @ts-expect-error actually, this as property works but is missing in the typings
      as={StateLink}
      id={state}
      paddingX={1}
      paddingY={2}
      selected={selected}
      state={{state}}
      tone={critical ? 'critical' : 'default'}
      {...rest}
    >
      <Flex align="center" paddingX={1}>
        <Text size={2} weight="medium">
          {SCHEDULE_STATE_DICTIONARY[state].title}
        </Text>
        {/*
        HACK: when there are no items, we still render in with hidden visibility to
        preserve correct tab height / vertical padding.
        */}
        <Box
          marginLeft={count > 0 ? 2 : 0}
          style={{
            background: criticalCount ? red[500].hex : 'transparent',
            color: criticalCount ? white.hex : 'inherit',
            border: 'none',
            boxShadow: 'none',
            borderRadius: '2px',
            visibility: hasItems ? 'visible' : 'hidden',
            padding: hasItems ? '0.25em 0.4em' : '0.25em 0',
            width: hasItems ? 'auto' : 0,
          }}
        >
          <Text size={1} style={{color: criticalCount ? white.hex : 'inherit'}}>
            {count}
          </Text>
        </Box>
      </Flex>
    </Tab>
  )
}

export default ScheduleFilter
