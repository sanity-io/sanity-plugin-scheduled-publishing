import {useCallback, useState} from 'react'
import DialogTimeZone from '../components/DialogTimeZone'

function useDialogTimeZone() {
  const [dialogVisible, setDialogVisible] = useState(false)

  const hide = useCallback(() => {
    setDialogVisible(false)
  }, [])
  const show = useCallback(() => {
    setDialogVisible(true)
  }, [])

  const dialogProps = {
    onClose: hide,
    visible: dialogVisible,
  }

  return {
    DialogTimeZone: dialogVisible ? DialogTimeZone : null,
    dialogProps,
    dialogTimeZoneShow: show,
    hide,
  }
}

export default useDialogTimeZone
