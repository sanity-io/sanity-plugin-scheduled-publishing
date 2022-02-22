import {StateLink} from '@sanity/base/router'
import {Badge, Inline, Tab, Text} from '@sanity/ui'
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

  return (
    <Tab
      aria-controls="filters"
      // @ts-ignore
      as={StateLink}
      id={state}
      paddingLeft={2}
      paddingRight={critical ? 1 : 2}
      paddingY={1}
      selected={selected}
      state={{state}}
      tone={critical ? 'critical' : 'default'}
    >
      <Inline space={3}>
        <Text size={2} weight="medium">
          {title}
        </Text>
        {critical ? (
          <Badge padding={2} radius={2} tone="critical">
            <Text size={1} style={{color: 'white'}}>
              {count}
            </Text>
          </Badge>
        ) : (
          <Text muted size={1}>
            {count}
          </Text>
        )}
      </Inline>
    </Tab>
  )
}

export default ScheduleFilter
