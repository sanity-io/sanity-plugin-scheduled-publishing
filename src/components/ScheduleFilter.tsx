import {StateLink} from '@sanity/base/router'
import {Flex, Tab, Text} from '@sanity/ui'
import React from 'react'
import {SCHEDULE_FILTER_DICTIONARY} from '../constants'
import {ScheduleState} from '../types'

interface Props {
  count: number
  selected?: boolean
  state: ScheduleState
}

const ScheduleFilter = (props: Props) => {
  const {count, selected, state} = props

  const title = SCHEDULE_FILTER_DICTIONARY[state]

  return (
    <Tab
      aria-controls="filters"
      // @ts-ignore
      as={StateLink}
      id={state}
      padding={3}
      selected={selected}
      state={{state}}
    >
      <Flex align="baseline" justify="space-between">
        <Text size={2} weight="medium">
          {title}
        </Text>
        <Text size={1}>{count}</Text>
      </Flex>
    </Tab>
  )
}

export default ScheduleFilter
