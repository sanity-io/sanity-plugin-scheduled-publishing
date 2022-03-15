import {HOCRouter, withRouterHOC} from '@sanity/base/router'
import {white} from '@sanity/color'
import {CheckmarkIcon, EllipsisVerticalIcon, SortIcon} from '@sanity/icons'
import {Box, Button, Card, Flex, Label, Menu, MenuButton, MenuItem, Text} from '@sanity/ui'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import styled from 'styled-components'
import {SCHEDULE_FILTERS, TOOL_HEADER_HEIGHT} from '../constants'
import usePollSchedules from '../hooks/usePollSchedules'
import {useValidations} from '../hooks/useValidations'
import {Schedule, ScheduleSort, ScheduleState} from '../types'
import {debugWithName} from '../utils/debug'
import ButtonTimeZone from '../components/timeZoneButton/TimeZoneButton'
import ButtonTimeZoneElementQuery from '../components/timeZoneButton/TimeZoneButtonElementQuery'
import ErrorCallout from '../components/errorCallout/ErrorCallout'
import {ScheduleFilters} from './scheduleFilters'
import {Schedules} from '../components/schedules'
import {ToolCalendar} from './toolCalendar'
import {SchedulesValidation} from '../components/validation/SchedulesValidation'

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

  const [sortBy, setSortBy] = useState<ScheduleSort>('executeAt')
  const [validations, updateValidation] = useValidations()

  const {error, isInitialLoading, schedules = NO_SCHEDULE} = usePollSchedules()

  const scheduleState: ScheduleState = router.state.state || 'scheduled'
  debug('scheduleState', scheduleState)

  const sortedSchedules = useSortedSchedules(schedules, scheduleState)

  useFallbackNavigation(router, scheduleState)

  const handleSortByCreateAt = useCallback(() => setSortBy('createdAt'), [])
  const handleSortByExecuteAt = useCallback(() => setSortBy('executeAt'), [])
  return (
    <Card display="flex" flex={1} height="fill" overflow="auto">
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
      <Column flex={1} overflow="auto">
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
              <ScheduleFilters
                scheduleState={scheduleState}
                schedules={schedules}
                validations={validations}
              />
              <Flex align="center" gap={1}>
                <ButtonTimeZone useElementQueries />
                <MenuButton
                  button={
                    <Button
                      icon={EllipsisVerticalIcon}
                      mode="bleed"
                      paddingX={2}
                      paddingY={3}
                      tone="default"
                    />
                  }
                  id="sort"
                  menu={
                    <Menu style={{minWidth: '250px'}}>
                      <Box paddingX={3} paddingY={2}>
                        <Label muted size={1}>
                          Sort
                        </Label>
                      </Box>
                      <MenuItem
                        icon={SortIcon}
                        iconRight={sortBy === 'createdAt' ? CheckmarkIcon : undefined}
                        onClick={handleSortByCreateAt}
                        text="Sort by time added"
                      />
                      <MenuItem
                        icon={SortIcon}
                        iconRight={sortBy === 'executeAt' ? CheckmarkIcon : undefined}
                        onClick={handleSortByExecuteAt}
                        text="Sort by time scheduled"
                      />
                    </Menu>
                  }
                />
              </Flex>
            </Flex>
          </Flex>
        </ButtonTimeZoneElementQuery>
        <Box style={{overflowX: 'hidden', overflowY: 'auto'}} padding={4}>
          {/* Loading */}
          {isInitialLoading && <Text muted>Loading...</Text>}

          {/* Error */}
          {error && (
            <Box marginBottom={4}>
              <ErrorCallout
                description="More information in the developer console."
                title="Something went wrong, unable to retrieve schedules."
              />
            </Box>
          )}

          {/* Loaded schedules */}
          {sortedSchedules && (
            <>
              <SchedulesValidation schedules={schedules} updateValidation={updateValidation} />
              <Schedules
                schedules={sortedSchedules}
                scheduleState={scheduleState}
                sortBy={sortBy}
                validations={validations}
              />
            </>
          )}
        </Box>
      </Column>
    </Card>
  )
}

function useSortedSchedules(schedules: Schedule[], filter: ScheduleState): Schedule[] {
  return useMemo(() => {
    return schedules.sort((a, b) => {
      switch (filter) {
        // Upcoming items are displayed in chronological order
        case 'scheduled':
          return a.executeAt >= b.executeAt ? 1 : -1
        // Everything else should be displayed in reverse order
        default:
          return a.executeAt >= b.executeAt ? -1 : 1
      }
    })
  }, [schedules, filter])
}

function useFallbackNavigation(router: HOCRouter, filter: ScheduleState) {
  useEffect(() => {
    if (!SCHEDULE_FILTERS.includes(filter)) {
      router.navigate({state: SCHEDULE_FILTERS[0]})
    }
  }, [router, filter])
}

export default withRouterHOC(Tool)
