import {useToast} from '@sanity/ui'
import {format} from 'date-fns'
import client, {dataset, projectId} from '../client'
import {Schedule} from '../types'
import {debugWithName} from '../utils/debug'
import getErrorMessage from '../utils/getErrorMessage'

const debug = debugWithName('useScheduleOperation')

function _create({date, documentId}: {date: string; documentId: string}): Promise<Schedule> {
  return client.request({
    body: {
      documents: [{documentId}],
      executeAt: date, // ISO date
      name: date,
    },
    method: 'POST',
    uri: `/schedules/${projectId}/${dataset}`,
  })
}

function _delete({scheduleId}: {scheduleId: string}) {
  debug('_delete:', scheduleId)
  return client.request({
    method: 'DELETE',
    uri: `/schedules/${projectId}/${dataset}/${scheduleId}`,
  })
}

function _update({
  documentSchedule,
  scheduleId,
}: {
  documentSchedule: Partial<Schedule>
  scheduleId: string
}): Promise<void> {
  return client.request({
    body: documentSchedule,
    method: 'PATCH',
    uri: `/schedules/${projectId}/${dataset}/${scheduleId}`,
  })
}

export default function useScheduleOperation() {
  const toast = useToast()

  async function createSchedule({
    date,
    displayToast = true,
    documentId,
  }: {
    date: string
    displayToast?: boolean
    documentId: string
  }) {
    try {
      const schedule = await _create({date, documentId})

      if (displayToast) {
        toast.push({
          closable: true,
          description: format(
            new Date(schedule.executeAt),
            `'Publishing on' iiii d MMMM yyyy 'at' p`
          ),
          status: 'success',
          title: 'Schedule created',
        })
      }
    } catch (err) {
      if (displayToast) {
        toast.push({
          closable: true,
          description: getErrorMessage(err),
          status: 'error',
          title: 'Unable to create schedule',
        })
      }
    }
  }

  async function deleteSchedule({
    displayToast = true,
    schedule,
  }: {
    displayToast?: boolean
    schedule: Schedule
  }) {
    try {
      if (schedule.state === 'scheduled') {
        await _update({
          documentSchedule: {state: 'cancelled'},
          scheduleId: schedule.id,
        })
      }
      await _delete({scheduleId: schedule?.id})

      if (displayToast) {
        toast.push({
          closable: true,
          status: 'success',
          title: 'Schedule deleted',
        })
      }
    } catch (err) {
      if (displayToast) {
        toast.push({
          closable: true,
          description: getErrorMessage(err),
          status: 'error',
          title: 'Unable to delete schedule',
        })
      }
    }
  }

  return {
    createSchedule,
    deleteSchedule,
  }
}
