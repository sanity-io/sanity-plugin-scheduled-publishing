import {useToast} from '@sanity/ui'
import axios from 'axios'
import client from '../client'
import {Schedule} from '../types'
import {debugWithName} from '../utils/debug'
import formatDateTz from '../utils/formatDateTz'
import getAxiosErrorMessage from '../utils/getAxiosErrorMessage'
import useTimeZone from './useTimeZone'

const debug = debugWithName('useScheduleOperation')

// @ts-expect-error
const {dataset, projectId, url} = client.config()

function _create({date, documentId}: {date: string; documentId: string}) {
  debug('_create:', documentId)

  // Round date to nearest second (mutate)
  const roundedDate = new Date(date)
  roundedDate.setSeconds(0)
  roundedDate.setMilliseconds(0)

  return axios.post<Schedule>(
    `${url}/schedules/${projectId}/${dataset}`,
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
    `${url}/schedules/${projectId}/${dataset}/${scheduleId}`, //
    {withCredentials: true}
  )
}

function _publish({documentIds}: {documentIds: string[]}) {
  debug('_publish:', documentIds)

  return axios.post<{transactionId: string}>(
    `${url}/publish/${projectId}/${dataset}`,
    documentIds.map((documentId) => ({documentId})),
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
    `${url}/schedules/${projectId}/${dataset}/${scheduleId}`,
    documentSchedule,
    {withCredentials: true}
  )
}

export default function useScheduleOperation() {
  const toast = useToast()
  const {timeZone} = useTimeZone()

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
          description: formatDateTz({
            date: data.executeAt,
            includeTimeZone: true,
            prefix: 'Publishing on ',
            timeZone,
          }),
          duration: 30000, // 30s
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

  // TODO: this currently deletes the previous schedule, since it's not yet possible to update a schedule's state
  // from 'scheduled' to 'succeeded'. Update this endpoint when the above has been rectified by CL.
  async function publishSchedule({
    displayToast = true,
    schedule,
  }: {
    displayToast?: boolean
    schedule: Schedule
  }) {
    try {
      await _publish({documentIds: schedule?.documents?.map((document) => document.documentId)})
      await deleteSchedule({displayToast: false, schedule})

      if (displayToast) {
        toast.push({
          closable: true,
          status: 'success',
          title: 'Schedule executed',
        })
      }
    } catch (err) {
      if (displayToast) {
        toast.push({
          closable: true,
          description: getAxiosErrorMessage(err),
          status: 'error',
          title: 'Unable to publish schedule',
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
          description: formatDateTz({
            date,
            includeTimeZone: true,
            prefix: 'Publishing on ',
            timeZone,
          }),
          duration: 30000, // 30s
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
    publishSchedule,
    updateSchedule,
  }
}
