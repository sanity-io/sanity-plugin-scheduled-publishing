import {SelectIcon} from '@sanity/icons'
import {Box, Button, Text, Tooltip} from '@sanity/ui'
import React, {useState} from 'react'
import useTimeZone from '../hooks/useTimeZone'
import DialogTimeZone from './DialogTimeZone'

const TimeZoneButton = () => {
  const {timeZone} = useTimeZone()
  const [dialogVisible, setDialogVisible] = useState(false)

  const handleDialogHide = () => {
    setDialogVisible(false)
  }

  const handleDialogShow = () => {
    setDialogVisible(true)
  }

  return (
    <>
      {/* Dialog */}
      {dialogVisible && <DialogTimeZone onClose={handleDialogHide} />}

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
          iconRight={SelectIcon}
          mode="bleed"
          onClick={handleDialogShow}
          text={`${timeZone.alternativeName} (${timeZone.namePretty})`}
        />
      </Tooltip>
    </>
  )
}

export default TimeZoneButton
