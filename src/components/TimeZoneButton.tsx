import React, {useState} from 'react'
import {EarthAmericasIcon} from '@sanity/icons'
import {Box, Button, Text, Tooltip} from '@sanity/ui'
import DialogTimeZone from './DialogTimeZone'
import useTimeZone from '../hooks/useTz'

const TimeZoneButton = () => {
  const {timeIsLocal, timeZone} = useTimeZone()
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
              {timeIsLocal
                ? 'View dates in another time zone'
                : `All dates shown in ${timeZone.alternativeName} (GMT ${
                    // "-03:00 Brasilia Time - São Paulo..." => "-03:00"
                    timeZone.currentTimeFormat.split(' ')[0]
                  })`}
            </Text>
          </Box>
        }
        portal
      >
        <Button
          fontSize={1}
          icon={EarthAmericasIcon}
          // mode="ghost"
          mode="bleed"
          onClick={handleDialogShow}
          text={timeIsLocal ? 'Select time zone' : timeZone.alternativeName}
        />
      </Tooltip>
    </>
  )
}

export default TimeZoneButton
