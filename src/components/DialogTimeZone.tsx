import {Box, Dialog} from '@sanity/ui'
import React from 'react'
import TimeZoneSelect from './TimeZoneSelect'

interface Props {
  onClose?: () => void
}

const DialogTimeZone = (props: Props) => {
  const {onClose} = props
  return (
    <Dialog header="Select time zone" id="time-zone" onClose={onClose} width={1}>
      <Box padding={4}>
        <TimeZoneSelect />
      </Box>
    </Dialog>
  )
}

export default DialogTimeZone
