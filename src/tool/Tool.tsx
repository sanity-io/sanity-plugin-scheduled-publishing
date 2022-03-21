import {HOCRouter, withRouterHOC} from '@sanity/base/router'
import {white} from '@sanity/color'
import {Box, Card, Flex, Text} from '@sanity/ui'
import React, {useEffect, useMemo} from 'react'
import styled from 'styled-components'
import ErrorCallout from '../components/errorCallout/ErrorCallout'
import ButtonTimeZone from '../components/timeZoneButton/TimeZoneButton'
import ButtonTimeZoneElementQuery from '../components/timeZoneButton/TimeZoneButtonElementQuery'
import {SCHEDULE_FILTERS, TOOL_HEADER_HEIGHT} from '../constants'
import usePollSchedules from '../hooks/usePollSchedules'
import {Schedule, ScheduleState} from '../types'
import {debugWithName} from '../utils/debug'
import {SchedulesProvider} from './contexts/schedules'
import {ScheduleFilters} from './scheduleFilters'
import {Schedules} from './schedules'
import SchedulesContextMenu from './schedulesContextMenu/SchedulesContextMenu'
import {ToolCalendar} from './toolCalendar'

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

const NO_SCHEDULE: Schedule[] = []

function Tool(props: Props) {
  const {router} = props

  const {error, isInitialLoading, schedules = NO_SCHEDULE} = usePollSchedules()

  const scheduleState: ScheduleState = router.state.state || 'scheduled'
  debug('scheduleState', scheduleState)

  useFallbackNavigation(router, scheduleState)

  const schedulesContext = useMemo(() => ({schedules, scheduleState}), [schedules, scheduleState])

  return (
    <SchedulesProvider value={schedulesContext}>
      <Card
        display="flex"
        flex={1}
        height="fill"
        overflow="hidden"
        style={{
          bottom: 0,
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
        }}
      >
        {/* LHS Column */}
        <Column
          display={['none', null, null, 'flex'] as any}
          style={{
            position: 'sticky',
            top: 0,
            width: '350px',
          }}
        >
          <ToolCalendar />
        </Column>
        {/* RHS Column */}
        <Column display="flex" flex={1} overflow="hidden">
          <ButtonTimeZoneElementQuery
            style={{
              background: white.hex,
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            {/* Header */}
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
                {/* Filters */}
                <ScheduleFilters />

                {/* Time zone select + context menu */}
                <Flex align="center" gap={1}>
                  <ButtonTimeZone useElementQueries />
                  <SchedulesContextMenu />
                </Flex>
              </Flex>
            </Flex>
          </ButtonTimeZoneElementQuery>
          <Flex direction="column" flex={1}>
            {/* Error */}
            {error && (
              <Box paddingTop={4} paddingX={4}>
                <ErrorCallout
                  description="More information in the developer console."
                  title="Something went wrong, unable to retrieve schedules."
                />
              </Box>
            )}

            <Box flex={1}>
              {isInitialLoading ? (
                <Box padding={4}>
                  <Text muted>Loading...</Text>
                </Box>
              ) : (
                // Loaded schedules
                <Schedules />
              )}
            </Box>
          </Flex>
        </Column>
      </Card>
    </SchedulesProvider>
  )
}

function useFallbackNavigation(router: HOCRouter, filter: ScheduleState) {
  useEffect(() => {
    if (!SCHEDULE_FILTERS.includes(filter)) {
      router.navigate({state: SCHEDULE_FILTERS[0]})
    }
  }, [router, filter])
}

export default withRouterHOC(Tool)
