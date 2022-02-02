import React, {useState} from 'react'
import {EarthAmericasIcon} from '@sanity/icons'
import {Button} from '@sanity/ui'
import DialogTimeZone from './DialogTimeZone'

const TimeZoneButton = () => {
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

      <Button
        fontSize={1}
        icon={EarthAmericasIcon}
        // mode="ghost"
        mode="bleed"
        onClick={handleDialogShow}
        text="Europe/London (GMT+00:00)"
      />
    </>
  )
}

export default TimeZoneButton
