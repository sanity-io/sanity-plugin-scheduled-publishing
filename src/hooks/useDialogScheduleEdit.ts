import {useCallback, useState} from 'react'
import DialogScheduleEdit from '../components/DialogScheduleEdit'
import {Schedule} from '../types'

function useDialogScheduleEdit(schedule: Schedule) {
  const [dialogVisible, setDialogVisible] = useState(false)

  const hide = useCallback(() => {
    setDialogVisible(false)
  }, [])
  const show = useCallback(() => {
    setDialogVisible(true)
  }, [])

  const dialogProps = {
    onClose: hide,
    schedule,
    visible: dialogVisible,
  }

  return {
    DialogScheduleEdit: dialogVisible ? DialogScheduleEdit : null,
    dialogProps,
    dialogScheduleEditShow: show,
    hide,
  }
}

export default useDialogScheduleEdit
