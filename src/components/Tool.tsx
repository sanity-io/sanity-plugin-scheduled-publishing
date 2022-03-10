import {HOCRouter, withRouterHOC} from '@sanity/base/router'
import {white} from '@sanity/color'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {CheckmarkIcon, EllipsisVerticalIcon, ErrorOutlineIcon, SortIcon} from '@sanity/icons'
import {Box, Button, Card, Flex, Label, Menu, MenuButton, MenuItem, Text} from '@sanity/ui'
import styled from 'styled-components'
import {SCHEDULE_FILTERS, ScheduleFilterType, TOOL_HEADER_HEIGHT} from '../constants'
import usePollSchedules from '../hooks/usePollSchedules'
import {Schedule, ScheduledDocValidations, ScheduleSort, ValidationStatus} from '../types'
import {debugWithName} from '../utils/debug'
import ButtonTimeZone from './ButtonTimeZone'
import ButtonTimeZoneElementQuery from './ButtonTimeZoneElementQuery'
import ScheduleFilters from './ScheduleFilters'
import Schedules from './Schedules'
import {ToolCalendar} from './ToolCalendar'
import {SchedulesValidation} from './SchedulesValidation'

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
  const [validations, setValidations] = useState<ScheduledDocValidations>({})

  const {error, isInitialLoading, schedules = NO_SCHEDULE} = usePollSchedules()

  const scheduleState: ScheduleFilterType = router.state.state || 'scheduled'
  debug('scheduleState', scheduleState)

  const filteredSchedules = useSortedSchedules(schedules, scheduleState)

  useFallbackNavigation(router, scheduleState)

  const handleSortByCreateAt = useCallback(() => setSortBy('createdAt'), [])
  const handleSortByExecuteAt = useCallback(() => setSortBy('executeAt'), [])
  const updateValidation = (s: Schedule, vs: ValidationStatus) =>
    setValidations((current) => ({...current, [s.id]: vs}))

  // @ts-ignore
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
            <Card overflow="hidden" padding={4} radius={2} shadow={1} tone="critical">
              <Flex align="center" gap={4}>
                <Text size={3}>
                  <ErrorOutlineIcon />
                </Text>
                <Text size={2}>Unable to load schedules: {error.message}</Text>
              </Flex>
            </Card>
          )}

          {/* Loaded schedules */}
          {filteredSchedules && (
            <>
              <SchedulesValidation schedules={schedules} updateValidation={updateValidation} />
              <Schedules
                schedules={filteredSchedules}
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

function useSortedSchedules(schedules: Schedule[], filter: ScheduleFilterType): Schedule[] {
  return useMemo(() => {
    return schedules.sort((a, b) => {
      switch (filter) {
        // Upcoming items are displayed in chronological order
        case 'scheduled':
        case 'errors':
          return a.executeAt >= b.executeAt ? 1 : -1
        // Everything else should be displayed in reverse order
        default:
          return a.executeAt >= b.executeAt ? -1 : 1
      }
    })
  }, [schedules, filter])
}

function useFallbackNavigation(router: HOCRouter, filter: ScheduleFilterType) {
  useEffect(() => {
    if (!SCHEDULE_FILTERS.includes(filter)) {
      router.navigate({state: SCHEDULE_FILTERS[0]})
    }
  }, [router, filter])
}

export default withRouterHOC(Tool)
