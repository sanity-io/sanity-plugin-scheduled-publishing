import {Schedule} from '../../types'
import React, {CSSProperties, useEffect, useMemo, useState} from 'react'
import {Card, Flex, Label} from '@sanity/ui'
import {ScheduleItem} from '../../components/scheduleItem'
import {VirtualItem} from 'react-virtual'
import {SanityDefaultPreview} from 'sanity'

export interface ListItem {
  content: Schedule | string
  key: string
  virtualRow: VirtualItem
}

interface Props {
  item: ListItem
}

/** First month header is not as high, to reduce whitespace */
const MONTH_HEADER_PX = 30

/** Accounts for row height and spacing between rows */
const ITEM_HEIGHT_PX = 59

/** Putting this too low will result in 429 too many requests when scrolling in big lists */
const SCHEDULE_RENDER_DELAY_MS = 200

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
      transform: `translateY(${virtualRow.start}px)`,
    }),
    [virtualRow]
  )

  if (typeof content === 'string') {
    return (
      <div
        ref={virtualRow.measureRef}
        style={{
          ...style,
          height: virtualRow.index === 0 ? MONTH_HEADER_PX : MONTH_HEADER_PX * 2,
        }}
      >
        <MonthHeading content={content} />
      </div>
    )
  }

  return (
    <div ref={virtualRow.measureRef} style={{...style, height: ITEM_HEIGHT_PX}}>
      <DelayedScheduleItem schedule={content} />
    </div>
  )
}

/**
 * ScheduleItem is a bit on the heavy side for rendering speed. This component defers rendering ScheduleItem
 * until "some time after" mounting, so scrolling in the virtualized Schedule-list gives better UX.
 */
function DelayedScheduleItem({schedule}: {schedule: Schedule}) {
  const [delayedScheduleItem, setDelayedScheduleItem] = useState(<PlaceholderScheduleItem />)

  useEffect(() => {
    let canUpdate = true
    const timeout = setTimeout(() => {
      if (!canUpdate) {
        return
      }
      setDelayedScheduleItem(<ScheduleItem schedule={schedule} type="tool" />)
    }, SCHEDULE_RENDER_DELAY_MS)

    return () => {
      canUpdate = false
      clearTimeout(timeout)
    }
  }, [schedule])

  return delayedScheduleItem
}

function MonthHeading({content}: {content: string}) {
  return (
    <Flex
      align="flex-end"
      paddingBottom={4}
      style={{
        bottom: 0,
        position: 'absolute',
      }}
    >
      <Label muted size={1}>
        {content}
      </Label>
    </Flex>
  )
}

function PlaceholderScheduleItem() {
  return (
    <Card padding={1} radius={2} shadow={1}>
      <Card padding={1}>
        <SanityDefaultPreview isPlaceholder />
      </Card>
    </Card>
  )
}
