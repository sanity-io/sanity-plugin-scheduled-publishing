import {StateLink} from '@sanity/base/router'
import {white} from '@sanity/color'
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
      padding={1}
      selected={selected}
      state={{state}}
      tone={critical ? 'critical' : 'default'}
    >
      <Inline paddingLeft={1} space={critical && count > 0 ? 3 : 2}>
        <Text size={2} weight="medium">
          {title}
        </Text>
        {count > 0 && (
          <Badge
            mode={critical ? 'default' : 'outline'}
            padding={2}
            radius={2}
            style={{
              background: critical ? undefined : 'transparent',
              border: 'none',
              boxShadow: 'none',
            }}
            tone={critical ? 'critical' : 'default'}
          >
            <Text size={1} style={{color: critical ? white.hex : 'inherit'}}>
              {count}
            </Text>
          </Badge>
        )}
      </Inline>
    </Tab>
  )
}

export default ScheduleFilter
