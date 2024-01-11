import {useStateLink} from 'sanity/router'
import {Button, Inline, Text} from '@sanity/ui'
import React from 'react'
import {SCHEDULE_STATE_DICTIONARY} from '../../constants'
import {Schedule, ScheduleState} from '../../types'
import {useFilteredSchedules} from '../../hooks/useFilteredSchedules'

interface Props {
  schedules: Schedule[]
  selected?: boolean
  state: ScheduleState
}

const ScheduleFilter = (props: Props) => {
  const {selected, schedules, state} = props

  const count = useFilteredSchedules(schedules, state).length

  const hasItems = count > 0

  const critical = state === 'cancelled'

  const {href, onClick} = useStateLink({
    state: {state},
  })

  return (
    <Button
      as="a"
      href={href}
      mode="bleed"
      onClick={onClick}
      selected={selected}
      tone={critical ? 'critical' : 'default'}
    >
      <Inline space={2}>
        <Text size={2} weight="medium">
          {SCHEDULE_STATE_DICTIONARY[state].title}
        </Text>
        {hasItems && <Text size={1}>{count}</Text>}
      </Inline>
    </Button>
  )
}

export default ScheduleFilter
