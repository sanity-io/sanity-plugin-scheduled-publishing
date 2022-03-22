import {CloseIcon} from '@sanity/icons'
import type {CardTone} from '@sanity/ui'
import {Badge, Box, Card, Flex, Stack, Text, Tooltip} from '@sanity/ui'
import {format, isWeekend} from 'date-fns'
import React, {useCallback, useMemo} from 'react'
import {SCHEDULE_STATE_DICTIONARY} from '../../constants'
import useTimeZone from '../../hooks/useTimeZone'
import type {Schedule} from '../../types'
import {getLastExecuteDate} from '../../utils/scheduleUtils'
import {useSchedules} from '../contexts/schedules'
import Pip from './Pip'

interface CalendarDayProps {
  date: Date // clock time
  focused?: boolean
  onSelect: (date?: Date) => void
  isCurrentMonth?: boolean
  isToday: boolean
  selected?: boolean
}

export function CalendarDay(props: CalendarDayProps) {
  const {date, focused, isCurrentMonth, isToday, onSelect, selected} = props

  const {schedulesByDate} = useSchedules()

  const schedules = schedulesByDate(date)

  const handleClick = useCallback(() => {
    if (selected) {
      onSelect(undefined)
    } else {
      onSelect(date)
    }
  }, [date, onSelect])

  let tone: CardTone
  if (isToday || selected) {
    tone = 'primary'
  } else if (isWeekend(date)) {
    // tone = 'transparent'
    tone = 'default'
  } else {
    tone = 'default'
  }

  const hasSchedules = schedules.length > 0

  // Parition schedules by state
  const {completed, failed, upcoming} = useMemo(() => {
    return {
      completed: schedules.filter((s) => s.state === 'succeeded'),
      failed: schedules.filter((s) => s.state === 'cancelled'),
      upcoming: schedules.filter((s) => s.state === 'scheduled'),
    }
  }, [schedules])

  return (
    <div aria-selected={selected} data-ui="CalendarDay">
      <Tooltip
        content={<TooltipContent date={date} schedules={schedules} />}
        disabled={!hasSchedules}
        portal
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
          radius={2}
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
            {selected ? <CloseIcon /> : date.getDate()}
          </Text>

          {/* Pips */}
          <Box
            style={{
              bottom: 2,
              left: 2,
              position: 'absolute',
              right: 2,
            }}
          >
            <Flex align="center" gap={1} justify="center">
              {completed.length > 0 && <Pip selected={selected} />}
              {upcoming.length > 0 && <Pip selected={selected} />}
              {failed.length > 0 && <Pip mode="failed" selected={selected} />}
            </Flex>
          </Box>
        </Card>
      </Tooltip>
    </div>
  )
}

interface TooltipContentProps {
  date: Date
  schedules?: Schedule[]
}

function TooltipContent(props: TooltipContentProps) {
  const {date, schedules = []} = props
  const {formatDateTz} = useTimeZone()

  return (
    <Box padding={3}>
      <Box marginBottom={3}>
        <Text muted size={1} weight="regular">
          {format(date, 'd MMMM yyyy')}
        </Text>
      </Box>
      <Stack space={2}>
        {schedules?.map((schedule) => (
          <Flex align="center" gap={3} justify="space-between" key={schedule.id}>
            <Box>
              <Text size={1} weight="semibold">
                {formatDateTz({date: new Date(getLastExecuteDate(schedule)), format: 'p'})}
              </Text>
            </Box>
            <Badge
              fontSize={0}
              mode="outline"
              tone={SCHEDULE_STATE_DICTIONARY[schedule.state].badgeTone}
            >
              {SCHEDULE_STATE_DICTIONARY[schedule.state].title}
            </Badge>
          </Flex>
        ))}
      </Stack>
    </Box>
  )
}
