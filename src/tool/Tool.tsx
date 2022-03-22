import {HOCRouter, withRouterHOC} from '@sanity/base/router'
import {white} from '@sanity/color'
import {Box, Card, Flex, Text} from '@sanity/ui'
import {parse} from 'date-fns'
import React, {useEffect, useMemo, useRef} from 'react'
import styled from 'styled-components'
import ErrorCallout from '../components/errorCallout/ErrorCallout'
import ButtonTimeZone from '../components/timeZoneButton/TimeZoneButton'
import ButtonTimeZoneElementQuery from '../components/timeZoneButton/TimeZoneButtonElementQuery'
import {SCHEDULE_FILTERS, TOOL_HEADER_HEIGHT} from '../constants'
import usePollSchedules from '../hooks/usePollSchedules'
import useTimeZone from '../hooks/useTimeZone'
import {Schedule, ScheduleState} from '../types'
import {SchedulesProvider} from './contexts/schedules'
import {ScheduleFilters} from './scheduleFilters'
import {Schedules} from './schedules'
import SchedulesContextMenu from './schedulesContextMenu/SchedulesContextMenu'
import {ToolCalendar} from './toolCalendar'

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
const DATE_SLUG_FORMAT = 'yyyy-MM-dd' // date-fns format

function Tool(props: Props) {
  const {router} = props

  const {error, isInitialLoading, schedules = NO_SCHEDULE} = usePollSchedules()

  const lastScheduleState = useRef()

  const scheduleState: ScheduleState = router.state.state
  const selectedDate = router.state.date
    ? parse(router.state.date, DATE_SLUG_FORMAT, new Date())
    : undefined

  // Store last active schedule state
  useEffect(() => {
    if (router.state.state) {
      lastScheduleState.current = router.state.state
    }
  }, [router.state.state])

  // Default to first filter type ('upcoming') if no existing schedule state or
  // selected date can be inferred from current route.
  useFallbackNavigation(router, scheduleState, selectedDate)

  const {formatDateTz} = useTimeZone()

  const schedulesContext = useMemo(
    () => ({
      schedules,
      scheduleState,
      selectedDate,
    }),
    [schedules, scheduleState, selectedDate]
  )

  const handleClearDate = () => {
    router.navigate({state: lastScheduleState?.current || SCHEDULE_FILTERS[0]})
  }

  const handleSelectDate = (date?: Date) => {
    if (date) {
      router.navigate({date: formatDateTz({date, format: DATE_SLUG_FORMAT})})
    } else {
      router.navigate({state: lastScheduleState?.current || SCHEDULE_FILTERS[0]})
    }
  }

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
          <ToolCalendar onSelect={handleSelectDate} selectedDate={selectedDate} />
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
                <ScheduleFilters onClearDate={handleClearDate} selectedDate={selectedDate} />

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

function useFallbackNavigation(router: HOCRouter, filter?: ScheduleState, selectedDate?: Date) {
  useEffect(() => {
    if (!filter && !selectedDate) {
      router.navigate({state: SCHEDULE_FILTERS[0]}, {replace: true})
    }
  }, [router, filter])
}

export default withRouterHOC(Tool)
