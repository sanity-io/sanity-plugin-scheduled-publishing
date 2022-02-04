import React from 'react'
import TimezoneInput from './TimezoneInput'
import {Box, Flex} from '@sanity/ui'

interface Props {
  title: string
}

const DialogHeader = (props: Props) => {
  const {title} = props
  return (
    <Flex align="center">
      {title}
      <Box style={{position: 'absolute', right: '-1.5em'}}>
        <TimezoneInput />
      </Box>
    </Flex>
  )
}

export default DialogHeader
