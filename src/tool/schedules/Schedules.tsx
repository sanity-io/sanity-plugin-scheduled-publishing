import {CheckmarkCircleIcon} from '@sanity/icons'
import {Box, Button, Flex} from '@sanity/ui'
import React, {useCallback, useMemo} from 'react'
import useScheduleOperation from '../../hooks/useScheduleOperation'
import {useSchedules} from '../contexts/schedules'
import EmptySchedules from './EmptySchedules'
import {useVirtual} from 'react-virtual'
import {FIRST_MONTH_HEADER_PX, ITEM_HEIGHT_PX, ListItem, VirtualListItem} from './VirtualListItem'
import {Schedule, ScheduleSort, ScheduleState} from '../../types'
import {getLastExecuteDate} from '../../utils/scheduleUtils'

function getLocalizedDate(date: string) {
  return new Date(date).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })
}

// Limit concurrent listeners
const MAX_VISIBLE_ITEMS = 20
const HEADERS_AND_PADDING = 142 //px

export const Schedules = () => {
  const {deleteSchedules} = useScheduleOperation()
  const {activeSchedules, scheduleState, sortBy} = useSchedules()

  const {virtualList, totalSize, containerRef} = useVirtualizedSchedules(
    activeSchedules,
    scheduleState,
    sortBy
  )
  const handleClearSchedules = () => {
    deleteSchedules({schedules: activeSchedules || []})
  }

  return (
    <Box
      paddingX={2}
      ref={containerRef}
      height="fill"
      style={{
        marginTop: activeSchedules.length ? 0 : undefined,
        overflowY: 'auto',
        height: `calc(100vh - ${HEADERS_AND_PADDING}px)`,
        maxHeight: ITEM_HEIGHT_PX * MAX_VISIBLE_ITEMS,
      }}
    >
      <Box
        style={{
          height: `${totalSize}px`,
          position: 'relative',
        }}
      >
        {activeSchedules.length === 0 ? (
          <Box marginY={2}>
            <EmptySchedules scheduleState={scheduleState} />
          </Box>
        ) : (
          <Box>
            {virtualList.map((item) => (
              <VirtualListItem key={item.virtualRow.index} item={item} />
            ))}

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
        )}
      </Box>
    </Box>
  )
}

function useVirtualizedSchedules(
  activeSchedules: Schedule[],
  scheduledState: ScheduleState,
  sortBy?: ScheduleSort
) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  const listSourceItems = useMemo(() => {
    const items: (Schedule | string)[] = []

    activeSchedules.forEach((schedule, index) => {
      if (sortBy == 'executeAt') {
        // Get localised date string for current and previous schedules (e.g. 'February 2025')
        const previousSchedule = activeSchedules[index - 1]
        const datePrevious =
          index > 0 ? getLocalizedDate(getLastExecuteDate(previousSchedule)) : null
        const dateCurrent = getLocalizedDate(getLastExecuteDate(schedule))
        if (dateCurrent !== datePrevious) {
          items.push(dateCurrent)
        }
      }
      items.push(schedule)
    })

    return items
  }, [activeSchedules, sortBy])

  const scheduleCount = activeSchedules.length
  const {virtualItems, totalSize} = useVirtual({
    size: scheduleCount,
    parentRef: containerRef,

    estimateSize: useCallback(
      (index: number) =>
        /* Spagetti warning: First month header is not as high, to reduce whitespace */
        scheduledState === 'scheduled' && index === 0 ? FIRST_MONTH_HEADER_PX : ITEM_HEIGHT_PX,
      []
    ),
    overscan: 0,
  })

  const virtualList: ListItem[] = useMemo(
    () =>
      virtualItems.map((virtualRow) => ({
        content: listSourceItems[virtualRow.index],
        virtualRow,
      })),
    [virtualItems, listSourceItems]
  )

  return {
    virtualList,
    totalSize,
    containerRef,
  }
}
