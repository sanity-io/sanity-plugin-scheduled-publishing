import DialogScheduleEdit from '../components/dialogs/DialogScheduleEdit'
import {Schedule} from '../types'
import {useDialogVisible} from './useDialogVisibile'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function useDialogScheduleEdit(schedule: Schedule) {
  const {visible, show, hide} = useDialogVisible()

  const dialogProps = {
    onClose: hide,
    schedule,
    visible,
  }

  return {
    DialogScheduleEdit: visible ? DialogScheduleEdit : null,
    dialogProps,
    dialogScheduleEditShow: show,
    hide,
  }
}

export default useDialogScheduleEdit
