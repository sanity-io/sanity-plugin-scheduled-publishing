import {StateLink} from '@sanity/base/router'
import {red, white} from '@sanity/color'
import {Box, Flex, Tab, Text} from '@sanity/ui'
import React from 'react'
import {SCHEDULE_FILTER_DICTIONARY} from '../constants'
import {ScheduleState} from '../types'

interface Props {
  count: number
  critical?: boolean
  selected?: boolean
  state: ScheduleState
}

const ScheduleFilter = (props: Props) => {
  const {count, critical, selected, state} = props

  const title = SCHEDULE_FILTER_DICTIONARY[state]

  const hasItems = count > 0

  return (
    <Tab
      aria-controls="filters"
      // @ts-ignore
      as={StateLink}
      id={state}
      paddingX={1}
      paddingY={2}
      selected={selected}
      state={{state}}
      tone={critical ? 'critical' : 'default'}
    >
      <Flex align="center" paddingX={1}>
        <Text size={2} weight="medium">
          {title}
        </Text>
        {/*
        HACK: when there are no items, continue to render count (with 0 opacity) in order to
        preseve correct tab height / vertical padding.
        */}
        <Box
          marginLeft={count > 0 ? 2 : 0}
          style={{
            background: critical && hasItems ? red[500].hex : 'transparent',
            color: critical && hasItems ? white.hex : 'inherit',
            border: 'none',
            boxShadow: 'none',
            borderRadius: '2px',
            opacity: hasItems ? 1 : 0,
            padding: hasItems ? '0.25em 0.4em' : '0.25em 0',
            width: hasItems ? 'auto' : 0,
          }}
        >
          <Text size={1} style={{color: critical && hasItems ? white.hex : 'inherit'}}>
            {count}
          </Text>
        </Box>
      </Flex>
    </Tab>
  )
}

export default ScheduleFilter
