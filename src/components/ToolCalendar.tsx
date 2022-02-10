import {ChevronLeftIcon, ChevronRightIcon} from '@sanity/icons'
import {Box, Button, Flex, Text} from '@sanity/ui'
import {zonedTimeToUtc} from 'date-fns-tz'
import React, {useState} from 'react'
import styled from 'styled-components'
import {TOOL_HEADER_HEIGHT} from '../constants'
import useTimeZone from '../hooks/useTimeZone'
import {TimeZonedCalendar} from './DateInputs/base/calendar/TimeZonedCalendar'

const ButtonContainer = styled(Flex)`
  border-bottom: 1px solid var(--card-border-color);
  border-top: 1px solid var(--card-border-color);
`

const ToolCalendar = () => {
  const {timeZone} = useTimeZone()
  const [date, setDate] = useState<Date>(zonedTimeToUtc(new Date(), timeZone.name))
  return (
    <Box>
      <Flex
        align="center"
        paddingLeft={4}
        style={{
          borderBottom: '1px solid var(--card-border-color)',
          minHeight: `${TOOL_HEADER_HEIGHT}px`,
          position: 'sticky',
          top: 0,
        }}
      >
        <Flex align="center" flex={1} justify="space-between">
          <Text weight="medium">Month Year</Text>
          <Flex>
            <Button
              icon={ChevronLeftIcon}
              mode="bleed"
              radius={0}
              style={{height: '55px', width: '55px'}}
            />
            <Button
              icon={ChevronRightIcon}
              mode="bleed"
              radius={0}
              style={{height: '55px', width: '55px'}}
            />
          </Flex>
        </Flex>
      </Flex>
      <TimeZonedCalendar
        selectTime // temporary for testing time zones
        selectedDate={date}
        onSelect={setDate}
      />
      <ButtonContainer flex={1}>
        <Button
          fontSize={1}
          mode="bleed"
          padding={4}
          radius={0}
          style={{width: '100%'}}
          text="Today"
          onClick={() => {
            setDate(zonedTimeToUtc(new Date(), timeZone.name))
          }}
        />
      </ButtonContainer>
    </Box>
  )
}

export default ToolCalendar
