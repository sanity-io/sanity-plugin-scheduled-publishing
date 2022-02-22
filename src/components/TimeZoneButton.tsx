import {Box, Button, Text, Tooltip} from '@sanity/ui'
import React from 'react'
import useDialogTimeZone from '../hooks/useDialogTimeZone'
import useTimeZone from '../hooks/useTimeZone'

const TimeZoneButton = () => {
  const {timeZone} = useTimeZone()
  const {DialogTimeZone, dialogProps, dialogTimeZoneShow} = useDialogTimeZone()

  return (
    <>
      {/* Dialog */}
      {DialogTimeZone && <DialogTimeZone {...dialogProps} />}

      <Tooltip
        content={
          <Box padding={2}>
            <Text muted size={1}>
              Displaying schedules in {timeZone.alternativeName} (GMT{timeZone.offset})
            </Text>
          </Box>
        }
        portal
      >
        <Button
          fontSize={1}
          mode="bleed"
          onClick={dialogTimeZoneShow}
          text={`${timeZone.alternativeName} (${timeZone.namePretty})`}
        />
      </Tooltip>
    </>
  )
}

export default TimeZoneButton
