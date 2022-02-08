import {Box, Flex} from '@sanity/ui'
import React from 'react'
import TimeZoneButton from './TimeZoneButton'

interface Props {
  title: string
}

const DialogHeader = (props: Props) => {
  const {title} = props
  return (
    <Flex align="center">
      {title}
      <Box style={{position: 'absolute', right: '-1.5em'}}>
        <TimeZoneButton />
      </Box>
    </Flex>
  )
}

export default DialogHeader
