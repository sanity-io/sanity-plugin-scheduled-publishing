import sanityClient from 'part:@sanity/base/client'
import {DocumentSchedule} from '../types'
import {debugWithName} from '../utils/debug'

const {dataset, projectId} = sanityClient.config()

const debug = debugWithName('actions:schedule')

export const createSchedule = ({
  date,
  documentId,
}: {
  date: string
  documentId: string
}): Promise<DocumentSchedule> => {
  debug('createSchedule:', documentId)

  return sanityClient.request({
    body: {
      documents: [{documentId}],
      executeAt: date, // ISO date
      name: date,
    },
    method: 'POST',
    uri: `/schedules/${projectId}/${dataset}`,
  })
}

const _delete = ({scheduleId}: {scheduleId: string}) => {
  debug('delete:', scheduleId)
  return sanityClient.request({
    method: 'DELETE',
    uri: `/schedules/${projectId}/${dataset}/${scheduleId}`,
  })
}

export const deleteSchedule = ({schedule}: {schedule: DocumentSchedule}): Promise<void> => {
  if (schedule.state === 'scheduled') {
    return updateSchedule({
      documentSchedule: {state: 'cancelled'},
      scheduleId: schedule?.id,
    }) //
      .then(() => _delete({scheduleId: schedule?.id}))
  }

  return _delete({scheduleId: schedule?.id})
}

export const updateSchedule = ({
  documentSchedule,
  scheduleId,
}: {
  documentSchedule: Partial<DocumentSchedule>
  scheduleId: string
}): Promise<void> => {
  debug(`updateSchedule ${scheduleId}:`, documentSchedule)

  return sanityClient.request({
    body: documentSchedule,
    method: 'PATCH',
    uri: `/schedules/${projectId}/${dataset}/${scheduleId}`,
  })
}
