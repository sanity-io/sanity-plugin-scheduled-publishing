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
      {/*
      HACK: Sanity UI will attempt to focus the first 'focusable' descendant of any dialog.
      Typically this is fine, but since our first focusable element is a button with a tooltip, this
      default behaviour causes the tooltip to appear whenever the dialog is opened, which we don't want!

      To get around this, we include a pseudo-hidden input to ensure our tooltip-enabled button remains
      unfocused on initial mount.
      */}
      <input style={{opacity: 0}} tabIndex={-1} type="button" />
      <Box style={{position: 'absolute', right: '-1.5em'}}>
        <TimeZoneButton />
      </Box>
    </Flex>
  )
}

export default DialogHeader
