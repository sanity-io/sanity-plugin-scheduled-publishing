import {PublishIcon} from '@sanity/icons'
import {Box, Dialog} from '@sanity/ui'
import React, {useCallback} from 'react'
import useScheduleForm from '../hooks/useScheduleForm'
import useScheduleOperation from '../hooks/useScheduleOperation'
import {Schedule} from '../types'
import DialogFooter from './DialogFooter'
import DialogScheduleFormContent from './DialogScheduleFormContent'

interface Props {
  onClose: () => void
  schedule: Schedule
}

const DialogScheduleEdit = (props: Props) => {
  const {onClose, schedule} = props

  const {updateSchedule} = useScheduleOperation()
  const {formData, isDirty, onFormChange} = useScheduleForm(schedule)

  // Callbacks
  const handleScheduleUpdate = useCallback(() => {
    if (!formData?.date) {
      return
    }
    // Update schedule then close self
    updateSchedule({
      date: formData.date,
      scheduleId: schedule.id,
    }).then(onClose)
  }, [formData?.date])

  return (
    <Dialog
      footer={
        <Box paddingX={4} paddingY={3}>
          <DialogFooter
            buttonText="Update"
            disabled={!isDirty}
            icon={PublishIcon}
            onAction={handleScheduleUpdate}
            onComplete={onClose}
            tone="primary"
          />
        </Box>
      }
      header="Edit schedule"
      id="time-zone"
      onClose={onClose}
      width={0}
    >
      <Box padding={4}>
        <DialogScheduleFormContent onChange={onFormChange} type="edit" value={formData} />
      </Box>
    </Dialog>
  )
}

export default DialogScheduleEdit
