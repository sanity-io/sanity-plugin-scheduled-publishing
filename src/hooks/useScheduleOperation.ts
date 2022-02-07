import {useToast} from '@sanity/ui'
import axios from 'axios'
import {format} from 'date-fns'
import client from '../client'
import {Schedule} from '../types'
import {debugWithName} from '../utils/debug'
import getAxiosErrorMessage from '../utils/getAxiosErrorMessage'

const debug = debugWithName('useScheduleOperation')

// @ts-expect-error
const {dataset, projectId, url} = client.config()
const scheduleBaseUrl = `${url}/schedules/${projectId}/${dataset}`

function _create({date, documentId}: {date: string; documentId: string}) {
  debug('_create:', documentId)

  // Round date to nearest second (mutate)
  const roundedDate = new Date(date)
  roundedDate.setSeconds(0)
  roundedDate.setMilliseconds(0)

  return axios.post<Schedule>(
    scheduleBaseUrl,
    {
      documents: [{documentId}],
      executeAt: roundedDate,
      name: roundedDate,
    },
    {withCredentials: true}
  )
}

function _delete({scheduleId}: {scheduleId: string}) {
  debug('_delete:', scheduleId)
  return axios.delete<void>(
    `${scheduleBaseUrl}/${scheduleId}`, //
    {withCredentials: true}
  )
}

function _update({
  documentSchedule,
  scheduleId,
}: {
  documentSchedule: Partial<Schedule>
  scheduleId: string
}) {
  debug('_update:', scheduleId, documentSchedule)
  return axios.patch<void>(
    `${scheduleBaseUrl}/${scheduleId}`, //
    documentSchedule,
    {withCredentials: true}
  )
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
      const {data} = await _create({date, documentId})

      if (displayToast) {
        toast.push({
          closable: true,
          description: format(new Date(data.executeAt), `'Publishing on' iiii d MMMM yyyy 'at' p`),
          status: 'success',
          title: 'Schedule created',
        })
      }
    } catch (err) {
      if (displayToast) {
        toast.push({
          closable: true,
          description: getAxiosErrorMessage(err),
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
          description: getAxiosErrorMessage(err),
          status: 'error',
          title: 'Unable to delete schedule',
        })
      }
    }
  }

  async function updateSchedule({
    date,
    displayToast = true,
    scheduleId,
  }: {
    date: string
    displayToast?: boolean
    scheduleId: string
  }) {
    try {
      await _update({documentSchedule: {executeAt: date}, scheduleId})

      if (displayToast) {
        toast.push({
          closable: true,
          description: format(new Date(date), `'Publishing on' iiii d MMMM yyyy 'at' p`),
          status: 'success',
          title: 'Schedule updated',
        })
      }
    } catch (err) {
      if (displayToast) {
        toast.push({
          closable: true,
          description: getAxiosErrorMessage(err),
          status: 'error',
          title: 'Unable to update schedule',
        })
      }
    }
  }

  return {
    createSchedule,
    deleteSchedule,
    updateSchedule,
  }
}
