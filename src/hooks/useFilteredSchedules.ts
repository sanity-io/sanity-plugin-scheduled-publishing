import {Schedule, ScheduledDocValidations} from '../types'
import {ScheduleFilterType} from '../constants'
import {useMemo} from 'react'
import {getValidationState, getValidationStatus} from '../utils/validation-utils'

const NO_VALIDATIONS: ScheduledDocValidations = {}

export function useFilteredSchedules(
  schedules: Schedule[],
  filter: ScheduleFilterType,
  validations: ScheduledDocValidations = NO_VALIDATIONS
): Schedule[] {
  return useMemo(() => {
    return schedules.filter(
      (schedule) =>
        schedule.state === filter ||
        (schedule.state === 'scheduled' &&
          filter === 'errors' &&
          getValidationState(getValidationStatus(schedule, validations)).hasError)
    )
  }, [schedules, filter, validations])
}
