import {HOCRouter, withRouterHOC} from '@sanity/base/router'
import {CheckmarkCircleIcon} from '@sanity/icons'
import {Box, Button, Card, Flex} from '@sanity/ui'
import React, {useEffect} from 'react'
import styled from 'styled-components'
import {SCHEDULE_STATES, TOOL_HEADER_HEIGHT} from '../constants'
import usePollSchedules from '../hooks/usePollSchedules'
import {ScheduleState} from '../types'
import {debugWithName} from '../utils/debug'
import ScheduleFilters from './ScheduleFilters'
import Schedules from './Schedules'
import TimeZoneButton from './TimeZoneButton'
import ToolCalendar from './ToolCalendar'

const debug = debugWithName('Tool')

const Column = styled(Box)`
  flex-direction: column;
  &:not(:last-child) {
    border-right: 1px solid var(--card-border-color);
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
        display={['none', null, null, 'flex']}
        style={{
          position: 'sticky',
          top: 0,
          width: '350px',
        }}
      >
        <ToolCalendar />
      </Column>
      {/* RHS Column */}
      <Column flex={1}>
        <Flex
          align="center"
          paddingLeft={3}
          paddingRight={3}
          style={{
            borderBottom: '1px solid var(--card-border-color)',
            minHeight: `${TOOL_HEADER_HEIGHT}px`,
          }}
        >
          <Flex align="center" flex={1} justify="space-between">
            <ScheduleFilters scheduleState={scheduleState} schedules={schedules} />
            <TimeZoneButton />
          </Flex>
        </Flex>
        <Box style={{overflowX: 'hidden', overflowY: 'auto'}} padding={4}>
          <Schedules schedules={filteredSchedules} />
        </Box>

        {/* Clear completed schedules */}
        {scheduleState === 'succeeded' && filteredSchedules.length > 0 && (
          <Flex justify="center" marginBottom={5} marginTop={6}>
            <Button
              disabled
              icon={CheckmarkCircleIcon}
              mode="ghost"
              text="Clear all completed schedules"
            />
          </Flex>
        )}
      </Column>
    </Card>
  )
}

export default withRouterHOC(Tool)
