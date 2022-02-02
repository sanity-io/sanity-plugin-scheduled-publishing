import {Box, Card} from '@sanity/ui'
import React from 'react'
import styled from 'styled-components'
import {debugWithName} from '../utils/debug'
import Calendar from './Calendar'
import ScheduleFilters from './ScheduleFilters'
import Schedules from './Schedules'

const debug = debugWithName('tool')

const Column = styled(Box)`
  flex-direction: column;
  &:not(:first-child) {
    border-left: 1px solid var(--card-border-color);
  }
`

function Tool() {
  return (
    <>
      <Card display="flex" height="fill" overflow="auto">
        {/* LHS Column */}
        <Column
          style={{
            // background: 'yellow',
            width: '350px',
          }}
        >
          <Calendar />
          <ScheduleFilters />
        </Column>
        {/* RHS Column */}
        <Column display="flex" flex={1}>
          <Schedules />
        </Column>
      </Card>
    </>
  )
}

export default Tool
