import {CheckmarkCircleIcon} from '@sanity/icons'
import {Box, Button, Flex} from '@sanity/ui'
import React, {useEffect, useMemo} from 'react'
import {useVirtual} from 'react-virtual'
import useScheduleOperation from '../../hooks/useScheduleOperation'
import {Schedule, ScheduleSort} from '../../types'
import {getLastExecuteDate} from '../../utils/scheduleUtils'
import {useSchedules} from '../contexts/schedules'
import {ListItem, VirtualListItem} from './VirtualListItem'

function getLocalizedDate(date: string) {
  return new Date(date).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })
}

const VirtualList = () => {
  const {activeSchedules, scheduleState, sortBy} = useSchedules()
  const {virtualList, totalSize, containerRef} = useVirtualizedSchedules(activeSchedules, sortBy)
  const {deleteSchedules} = useScheduleOperation()

  const handleClearSchedules = () => {
    deleteSchedules({schedules: activeSchedules || []})
  }

  // Reset virtual list scroll position on state changes
  useEffect(() => {
    containerRef?.current?.scrollTo(0, 0)
  }, [scheduleState, sortBy])

  return (
    <Box
      paddingBottom={6}
      paddingX={4}
      paddingTop={4}
      ref={containerRef}
      style={{
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Box
        style={{
          height: `${totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualList.map((item) => {
          return <VirtualListItem key={item.key} item={item} />
        })}
      </Box>
      {/* Clear completed schedules */}
      {scheduleState === 'succeeded' && (
        <Flex justify="center" marginTop={6}>
          <Button
            icon={CheckmarkCircleIcon}
            mode="ghost"
            onClick={handleClearSchedules}
            text="Clear all completed schedules"
          />
        </Flex>
      )}
    </Box>
  )
}

export default VirtualList

function useVirtualizedSchedules(activeSchedules: Schedule[], sortBy?: ScheduleSort) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  const listSourceItems = useMemo(() => {
    const items: (Schedule | string)[] = []

    activeSchedules.forEach((schedule, index) => {
      if (sortBy == 'executeAt') {
        // Get localised date string for current and previous schedules (e.g. 'February 2025')
        const previousSchedule = activeSchedules[index - 1]
        const previousExecuteDate = getLastExecuteDate(previousSchedule)
        const datePrevious =
          index > 0 && previousExecuteDate ? getLocalizedDate(previousExecuteDate) : null

        const currentExecuteDate = getLastExecuteDate(schedule)
        const dateCurrent = currentExecuteDate ? getLocalizedDate(currentExecuteDate) : null

        if (dateCurrent !== datePrevious) {
          items.push(dateCurrent ? dateCurrent : 'No date specified')
        }
      }
      items.push(schedule)
    })

    return items
  }, [activeSchedules, sortBy])

  const {virtualItems, totalSize} = useVirtual({
    size: listSourceItems.length,
    parentRef: containerRef,
    overscan: 5,
  })

  const virtualList: ListItem[] = useMemo(
    () =>
      virtualItems.map((virtualRow) => {
        const item = listSourceItems[virtualRow.index]
        return {
          content: item,
          key: typeof item === 'string' ? item : item.id,
          virtualRow,
        }
      }),
    [virtualItems, listSourceItems]
  )

  return {
    virtualList,
    totalSize,
    containerRef,
  }
}
