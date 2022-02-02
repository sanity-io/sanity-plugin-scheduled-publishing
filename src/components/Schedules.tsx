import {Flex, Inline, Text} from '@sanity/ui'
import React from 'react'
import TimeZoneButton from './TimeZoneButton'
import ToolHeader from './ToolHeader'

const Schedules = () => {
  return (
    <>
      <ToolHeader paddingX={4}>
        <Flex align="center" flex={1} justify="space-between">
          <Inline space={3}>
            <Text weight="medium">Filter name</Text>
            <Text muted>xx</Text>
          </Inline>
          <TimeZoneButton />
        </Flex>
      </ToolHeader>
      <Flex align="center" flex={1} justify="center">
        Schedules
      </Flex>
    </>
  )
}

export default Schedules
