import {HOCRouter, withRouterHOC} from '@sanity/base/router'
import {Box, Card, Flex, Inline, Text} from '@sanity/ui'
import React, {useEffect} from 'react'
import styled from 'styled-components'
import {SCHEDULE_FILTER_DICTIONARY, SCHEDULE_STATES, TOOL_HEADER_HEIGHT} from '../constants'
import usePollSchedules from '../hooks/usePollSchedules'
import {ScheduleState} from '../types'
import {debugWithName} from '../utils/debug'
import ScheduleFilters from './ScheduleFilters'
import Schedules from './Schedules'
import TimeZoneButton from './TimeZoneButton'
import ToolCalendar from './ToolCalendar'

const debug = debugWithName('Tool')

const Column = styled(Flex)`
  flex-direction: column;
  &:not(:first-child) {
    border-left: 1px solid var(--card-border-color);
  }
`
interface Props {
  router: HOCRouter
}

function Tool(props: Props) {
  const {router} = props

  // Poll for document schedules
  // TODO: handle error + isLoading states
  const {schedules} = usePollSchedules()

  const scheduleState: ScheduleState = router.state.state || 'scheduled'
  const scheduleStateTitle = SCHEDULE_FILTER_DICTIONARY[scheduleState]

  // Filter schedules by selected router state + sort conditionally
  const filteredSchedules = schedules
    .filter((schedule) => schedule.state === scheduleState)
    .sort((a, b) => {
      switch (scheduleState) {
        // Upcoming items are displayed in chronological order
        case 'scheduled':
          return a.executeAt >= b.executeAt ? 1 : -1
        // Everything else should be displayed in reverse order
        default:
          return a.executeAt >= b.executeAt ? -1 : 1
      }
    })

  debug('scheduleState', scheduleState)

  useEffect(() => {
    // Redirect to first schedule state on invalid routes
    if (!SCHEDULE_STATES.includes(scheduleState)) {
      router.navigate({state: SCHEDULE_STATES[0]})
    }
  }, [scheduleState])

  return (
    <Card display="flex" height="fill" overflow="auto">
      {/* LHS Column */}
      <Column
        style={{
          position: 'sticky',
          top: 0,
          width: '350px',
        }}
      >
        <ToolCalendar />
        <ScheduleFilters scheduleState={scheduleState} schedules={schedules} />
      </Column>
      {/* RHS Column */}
      <Column flex={1}>
        <Flex
          align="center"
          paddingLeft={4}
          paddingRight={3}
          style={{
            borderBottom: '1px solid var(--card-border-color)',
            minHeight: `${TOOL_HEADER_HEIGHT}px`,
          }}
        >
          <Flex align="center" flex={1} justify="space-between">
            <Inline space={3}>
              <Text weight="medium">{scheduleStateTitle}</Text>
              <Text muted>{filteredSchedules.length}</Text>
            </Inline>
            <TimeZoneButton />
          </Flex>
        </Flex>
        <Box style={{overflowX: 'hidden', overflowY: 'auto'}} padding={4}>
          <Schedules schedules={filteredSchedules} />
        </Box>
      </Column>
    </Card>
  )
}

export default withRouterHOC(Tool)
