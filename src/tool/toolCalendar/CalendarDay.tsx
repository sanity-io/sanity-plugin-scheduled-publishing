import type {BadgeTone, CardTone} from '@sanity/ui'
import {Badge, Box, Card, Flex, Stack, Text, Tooltip} from '@sanity/ui'
import {isWeekend} from 'date-fns'
import React, {useCallback} from 'react'
import useTimeZone from '../../hooks/useTimeZone'
import type {Schedule} from '../../types'
import formatDateTz from '../../utils/formatDateTz'
import {useSchedules} from '../contexts/schedules'
import Pip from './Pip'

interface CalendarDayProps {
  date: Date
  focused?: boolean
  onSelect: (date: Date) => void
  isCurrentMonth?: boolean
  isToday: boolean
  selected?: boolean
}

export function CalendarDay(props: CalendarDayProps) {
  const {date, focused, isCurrentMonth, isToday, onSelect, selected} = props

  const {schedulesByDate} = useSchedules()
  const {zoneDateToUtc} = useTimeZone()

  const {completed, failed, invalid, upcoming} = schedulesByDate(zoneDateToUtc(date))

  const handleClick = useCallback(() => {
    onSelect(date)
  }, [date, onSelect])

  let tone: CardTone
  if (isToday || selected) {
    tone = 'primary'
  } else if (isWeekend(date)) {
    tone = 'transparent'
  } else {
    tone = 'default'
  }

  const hasSchedules = completed.length + failed.length + invalid.length + upcoming.length > 0

  return (
    <div aria-selected={selected} data-ui="CalendarDay">
      <Tooltip
        content={
          <TooltipContent
            completed={completed}
            failed={failed}
            invalid={invalid}
            upcoming={upcoming}
          />
        }
        disabled={!hasSchedules}
      >
        <Card
          aria-label={date.toDateString()}
          aria-pressed={selected}
          as="button"
          __unstable_focusRing
          data-weekday
          data-focused={focused ? 'true' : ''}
          role="button"
          tabIndex={-1}
          onClick={handleClick}
          paddingX={3}
          paddingY={4}
          selected={selected}
          style={{position: 'relative'}}
          tone={tone}
        >
          <Text
            size={1}
            style={{
              opacity: !selected && !isCurrentMonth ? 0.35 : 1,
              textAlign: 'center',
            }}
          >
            {date.getDate()}
          </Text>

          {/* Pips */}
          <Box
            style={{
              bottom: '6px',
              left: 0,
              position: 'absolute',
              width: '100%',
            }}
          >
            <Flex align="center" gap={1} justify="center">
              {completed.length + upcoming.length > 0 && <Pip selected={selected} />}
              {failed.length + invalid.length > 0 && <Pip mode="failed" selected={selected} />}
            </Flex>
          </Box>
        </Card>
      </Tooltip>
    </div>
  )
}

interface TooltipContentProps {
  completed?: Schedule[]
  failed?: Schedule[]
  invalid?: Schedule[]
  upcoming?: Schedule[]
}

function TooltipContent(props: TooltipContentProps) {
  const {completed = [], failed = [], invalid = [], upcoming = []} = props

  return (
    <Box padding={2}>
      <Stack space={4}>
        <ScheduleGroup schedules={completed} title="Completed" tone="positive" />
        <ScheduleGroup schedules={upcoming} title="Upcoming" tone="primary" />
        <ScheduleGroup schedules={failed} title="Failed" tone="critical" />
        <ScheduleGroup schedules={invalid} title="Invalid" tone="critical" />
      </Stack>
    </Box>
  )
}

interface ScheduleGroupProps {
  schedules: Schedule[]
  title: string
  tone: BadgeTone
}

function ScheduleGroup(props: ScheduleGroupProps) {
  const {schedules, title, tone = 'default'} = props
  const {timeZone} = useTimeZone()

  if (!schedules || schedules.length === 0) {
    return null
  }

  return (
    <Box>
      <Flex>
        <Badge fontSize={0} mode="outline" tone={tone}>
          {title}
        </Badge>
      </Flex>
      <Stack marginTop={3} space={3}>
        {schedules?.map((schedule) => (
          <Text key={schedule.id} size={1}>
            {formatDateTz({date: schedule.executeAt, mode: 'medium', timeZone})}
          </Text>
        ))}
      </Stack>
    </Box>
  )
}
