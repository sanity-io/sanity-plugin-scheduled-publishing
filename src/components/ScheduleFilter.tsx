import {Flex, Tab, Text} from '@sanity/ui'
import React from 'react'

interface Props {
  id: string
  selected?: boolean
}

const ScheduleFilter = (props: Props) => {
  const {id, selected} = props
  return (
    <Tab aria-controls="filters" id={id} padding={3} selected={selected}>
      <Flex align="baseline" justify="space-between">
        <Text size={2} weight="medium">
          Filter name
        </Text>
        <Text size={1}>xx</Text>
      </Flex>
    </Tab>
  )
}

export default ScheduleFilter
