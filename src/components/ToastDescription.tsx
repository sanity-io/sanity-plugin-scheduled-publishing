import {CalendarIcon} from '@sanity/icons'
import {Inline, Stack, Text} from '@sanity/ui'
import React from 'react'

interface Props {
  body?: string
  title: string
}

const ToastDescription = (props: Props) => {
  const {body, title} = props
  return (
    <Stack paddingY={1} space={3}>
      <Inline space={2}>
        <CalendarIcon />
        <Text size={2} weight="semibold">
          Scheduled Publishing
        </Text>
      </Inline>
      {title && (
        <Text size={1} weight="medium">
          {title}
        </Text>
      )}
      {body && <Text size={1}>{body}</Text>}
    </Stack>
  )
}

export default ToastDescription
