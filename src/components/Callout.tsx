import {WarningOutlineIcon} from '@sanity/icons'
import {Card, Inline, Text} from '@sanity/ui'
import React from 'react'

interface Props {
  text: string
}

const Callout = (props: Props) => {
  const {text} = props
  return (
    <Card padding={3} radius={2} shadow={1} tone="caution">
      <Inline space={3}>
        <Text size={1}>
          <WarningOutlineIcon />
        </Text>
        <Text size={1}>{text}</Text>
      </Inline>
    </Card>
  )
}

export default Callout
