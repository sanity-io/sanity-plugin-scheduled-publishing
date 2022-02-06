import {Card, CardTone, Flex, Stack, Text} from '@sanity/ui'
import React, {ComponentType, createElement} from 'react'

interface Props {
  description?: string
  icon?: ComponentType
  title?: string
  tone?: CardTone
}

const Callout = (props: Props) => {
  const {description, icon, title, tone} = props

  return (
    <Card padding={4} radius={2} shadow={1} tone={tone}>
      <Flex>
        <Text size={2}>{icon && createElement(icon)}</Text>
        <Stack marginLeft={4} space={2}>
          {title && (
            <Text size={1} weight="semibold">
              {title}
            </Text>
          )}
          {description && <Text size={1}>{description}</Text>}
        </Stack>
      </Flex>
    </Card>
  )
}

export default Callout
