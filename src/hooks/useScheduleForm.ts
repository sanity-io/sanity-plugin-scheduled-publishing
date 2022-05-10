import type {ValidationMarker} from '@sanity/types'
import {useCallback, useMemo, useState} from 'react'
import type {Schedule, ScheduleFormData} from '../types'
import useTimeZone from './useTimeZone'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useScheduleForm(schedule?: Schedule) {
  const {getCurrentZoneDate, utcToCurrentZoneDate} = useTimeZone()

  const [isDirty, setIsDirty] = useState(false)
  const [markers, setMarkers] = useState<ValidationMarker[]>([])
  const [formData, setFormData] = useState<ScheduleFormData | null>(
    schedule && schedule?.executeAt
      ? {
          date: schedule.executeAt,
        }
      : null
  )

  const errors = useMemo(
    () => markers.filter((marker) => marker.type === 'validation' && marker.level === 'error'),
    [markers]
  )

  // Only allow dates in the future (`selectedDate` is UTC)
  const customValidation = useCallback(
    (selectedDate: Date) => utcToCurrentZoneDate(selectedDate) > getCurrentZoneDate(),
    [getCurrentZoneDate, utcToCurrentZoneDate]
  )

  const handleFormChange = useCallback(
    (form: ScheduleFormData) => {
      const equalDates =
        schedule?.executeAt &&
        new Date(schedule.executeAt).getTime() === new Date(form?.date).getTime()

      const isValid = customValidation(new Date(form?.date))
      setMarkers(
        isValid
          ? []
          : [
              {
                item: {message: 'Date must be in the future.', paths: []},
                level: 'error',
                path: [],
                type: 'validation',
              },
            ]
      )
      setFormData(form)
      setIsDirty(!equalDates)
    },
    [customValidation, schedule?.executeAt]
  )

  return {
    customValidation,
    errors,
    formData,
    isDirty,
    markers,
    onFormChange: handleFormChange,
  }
}
