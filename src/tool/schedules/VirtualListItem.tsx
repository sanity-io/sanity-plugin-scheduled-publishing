import {Schedule} from '../../types'
import React, {CSSProperties, useEffect, useMemo, useState} from 'react'
import {Box, Card, Flex, Label} from '@sanity/ui'
import {ScheduleItem} from '../../components/scheduleItem'
import {VirtualItem} from 'react-virtual'
import {SanityDefaultPreview} from 'part:@sanity/base/preview'

export interface ListItem {
  content: Schedule | string
  virtualRow: VirtualItem
}

interface Props {
  item: ListItem
}

/** First month header is not as high, to reduce whitespace */
export const FIRST_MONTH_HEADER_PX = 39

/** Accounts for row height and spacing between rows */
export const ITEM_HEIGHT_PX = 59

/** Putting this too low will result in 429 too many requests when scrolling in big lists */
const SCHEDULE_RENDER_DELAY_MS = 200

const alignPlaceholder: CSSProperties = {marginTop: 4, marginLeft: 4}
const deferredItemSize: CSSProperties = {height: ITEM_HEIGHT_PX - 16}

export function VirtualListItem(props: Props) {
  const {
    item: {content, virtualRow},
  } = props
  const style: CSSProperties = useMemo(
    () => ({
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: `${virtualRow.size}px`,
      transform: `translateY(${virtualRow.start}px)`,
    }),
    [virtualRow]
  )

  if (typeof content === 'string') {
    return <MonthHeading style={style} content={content} />
  }

  return <DelayedScheduleItem style={style} schedule={content} />
}

/**
 * ScheduleItem is a bit on the heavy side for rendering speed. This component defers rendering ScheduleItem
 * until "some time after" mounting, so scrolling in the virtualized Schedule-list gives better UX.
 */
function DelayedScheduleItem({schedule, style}: {schedule: Schedule; style: CSSProperties}) {
  const [delayedScheduleItem, setDelayedScheduleItem] = useState(
    <PlaceholderScheduleItem style={style} />
  )

  useEffect(() => {
    let canUpdate = true
    const timeout = setTimeout(() => {
      if (!canUpdate) {
        return
      }
      setDelayedScheduleItem(
        <div style={style}>
          <ScheduleItem schedule={schedule} type="tool" />
        </div>
      )
    }, SCHEDULE_RENDER_DELAY_MS)

    return () => {
      canUpdate = false
      clearTimeout(timeout)
    }
  }, [schedule])

  return delayedScheduleItem
}

function MonthHeading({content, style}: {content: string; style: CSSProperties}) {
  return (
    <Flex style={style} align="flex-end">
      <Box paddingBottom={3}>
        <Label muted size={1}>
          {content}
        </Label>
      </Box>
    </Flex>
  )
}

function PlaceholderScheduleItem({style}: {style: CSSProperties}) {
  return (
    <div style={style}>
      <Card padding={1} radius={2} shadow={1} style={deferredItemSize}>
        <div style={alignPlaceholder}>
          <SanityDefaultPreview isPlaceholder />
        </div>
      </Card>
    </div>
  )
}
