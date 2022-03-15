import {StateLink} from '@sanity/base/router'
import {red, white} from '@sanity/color'
import {Box, Flex, Tab, Text} from '@sanity/ui'
import React, {useMemo} from 'react'
import {SCHEDULE_FILTER_DICTIONARY} from '../../constants'
import {Schedule, ScheduledDocValidations, ScheduleState} from '../../types'
import {useFilteredSchedules} from '../../hooks/useFilteredSchedules'
import {ErrorOutlineIcon} from '@sanity/icons'

interface Props {
  schedules: Schedule[]
  selected?: boolean
  state: ScheduleState
  validations?: ScheduledDocValidations
}

const ScheduleFilter = (props: Props) => {
  const {selected, schedules, state, validations, ...rest} = props

  const count = useFilteredSchedules(schedules, state).length
  const showValidationError: boolean = useMemo(
    () =>
      !!validations &&
      Object.values(validations).some((v) => v.markers.some((m) => (m.level = 'error'))),
    [validations, state]
  )

  const title = SCHEDULE_FILTER_DICTIONARY[state]

  const hasItems = count > 0

  const critical = showValidationError || state === 'cancelled'
  const criticalCount = state === 'cancelled' && hasItems

  return (
    <Tab
      // @ts-expect-error actually, this as property works but is missing in the typings
      as={StateLink}
      id={state}
      paddingX={1}
      paddingY={2}
      selected={selected}
      state={{state}}
      tone={critical ? 'critical' : 'default'}
      {...rest}
    >
      <Flex align="center" paddingX={1}>
        <Text size={2} weight="medium">
          {title}
        </Text>
        {/*
        HACK: when there are no items, we still render in with hidden visibility to
        preserve correct tab height / vertical padding.
        */}
        <Box
          marginLeft={count > 0 ? 2 : 0}
          style={{
            background: criticalCount ? red[500].hex : 'transparent',
            color: criticalCount ? white.hex : 'inherit',
            border: 'none',
            boxShadow: 'none',
            borderRadius: '2px',
            visibility: hasItems ? 'visible' : 'hidden',
            padding: hasItems ? '0.25em 0.4em' : '0.25em 0',
            width: hasItems ? 'auto' : 0,
          }}
        >
          <Text size={1} style={{color: criticalCount ? white.hex : 'inherit'}}>
            {count}
          </Text>
        </Box>
        {showValidationError && (
          <Box marginX={1}>
            <Text size={1}>
              <ErrorOutlineIcon />
            </Text>
          </Box>
        )}
      </Flex>
    </Tab>
  )
}

export default ScheduleFilter
