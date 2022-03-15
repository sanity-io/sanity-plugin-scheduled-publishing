import {useToast} from '@sanity/ui'
import axios from 'axios'
import pluralize from 'pluralize'
import React from 'react'
import client from '../client'
import ToastDescription from '../components/toastDescription/ToastDescription'
import {Schedule} from '../types'
import {debugWithName} from '../utils/debug'
import formatDateTz from '../utils/formatDateTz'
import getAxiosErrorMessage from '../utils/getAxiosErrorMessage'
import useTimeZone from './useTimeZone'

const debug = debugWithName('useScheduleOperation')

// @ts-expect-error
const {dataset, projectId, url} = client.config()

// Custom events
export enum ScheduleEvents {
  create = 'scheduleCreate',
  delete = 'scheduleDelete',
  deleteMultiple = 'scheduleDeleteMultiple',
  execute = 'scheduleExecute',
  update = 'scheduleUpdate',
}

export type ScheduleCreateEvent = {
  date: string
  documentId: string
}

export type ScheduleDeleteEvent = {
  scheduleId: string
}

export type ScheduleDeleteMultipleEvent = {
  scheduleIds: string[]
}

export type ScheduleExecuteEvent = {
  schedule: Schedule
}

export type ScheduleUpdateEvent = {
  date: string
  scheduleId: string
}

// Add our custom events to `WindowEventMap`, providing typing when using `addEventListener`
declare global {
  interface WindowEventMap {
    [ScheduleEvents.create]: CustomEvent<ScheduleCreateEvent>
    [ScheduleEvents.delete]: CustomEvent<ScheduleDeleteEvent>
    [ScheduleEvents.deleteMultiple]: CustomEvent<ScheduleDeleteMultipleEvent>
    [ScheduleEvents.execute]: CustomEvent<ScheduleExecuteEvent>
    [ScheduleEvents.update]: CustomEvent<ScheduleUpdateEvent>
  }
}

type UnpackCustomEventPayload<T> = T extends CustomEvent<infer U> ? U : never

// Proxy that generates type safe CustomEvents.
// We infer our CustomEvent's `detail` using `UnpackCustomEventPayload`
export const scheduleCustomEvent = <
  T extends ScheduleEvents,
  D extends UnpackCustomEventPayload<WindowEventMap[T]>
>(
  name: T,
  // override `detail` in `CustomEventInit` with our own custom payload
  payload: Omit<CustomEventInit<D>, 'detail'> & {
    detail: D
  }
): CustomEvent<D> => new CustomEvent(name, payload)

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

function _deleteMultiple({scheduleIds}: {scheduleIds: string[]}) {
  debug('_deleteMultiple:', scheduleIds)
  const requests = scheduleIds.map((scheduleId) => _delete({scheduleId}))
  return Promise.allSettled(requests)
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

      window.dispatchEvent(
        scheduleCustomEvent(ScheduleEvents.create, {
          detail: {
            date,
            documentId,
          },
        })
      )

      if (displayToast) {
        toast.push({
          closable: true,
          description: (
            <ToastDescription
              body={formatDateTz({
                date: data.executeAt,
                includeTimeZone: true,
                prefix: 'Publishing on ',
                timeZone,
              })}
              title="Schedule created"
            />
          ),
          duration: 15000, // 15s
          status: 'success',
        })
      }
    } catch (err) {
      if (displayToast) {
        toast.push({
          closable: true,
          description: (
            <ToastDescription body={getAxiosErrorMessage(err)} title="Unable to create schedule" />
          ),
          duration: 15000, // 15s
          status: 'error',
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

      window.dispatchEvent(
        scheduleCustomEvent(ScheduleEvents.delete, {
          detail: {
            scheduleId: schedule?.id,
          },
        })
      )

      if (displayToast) {
        toast.push({
          closable: true,
          description: <ToastDescription title="Schedule deleted" />,
          status: 'success',
        })
      }
    } catch (err) {
      if (displayToast) {
        toast.push({
          closable: true,
          description: (
            <ToastDescription body={getAxiosErrorMessage(err)} title="Unable to delete schedule" />
          ),
          duration: 15000, // 15s
          status: 'error',
        })
      }
    }
  }

  async function deleteSchedules({
    displayToast = true,
    schedules,
  }: {
    displayToast?: boolean
    schedules: Schedule[]
  }) {
    try {
      const scheduleIds = schedules.map((schedule) => schedule.id)
      const response = await _deleteMultiple({scheduleIds})

      const {fulfilledIds, rejectedReasons} = response.reduce<{
        fulfilledIds: string[]
        rejectedReasons: string[]
      }>(
        (acc, v, index) => {
          if (v.status === 'fulfilled') {
            acc.fulfilledIds.push(schedules[index].id)
          }

          if (v.status === 'rejected') {
            acc.rejectedReasons.push(`[${schedules[index].id}]: ${v.reason}`)
          }

          return acc
        },
        {fulfilledIds: [], rejectedReasons: []}
      )
      const numFulfilledIds = fulfilledIds.length
      const numRejectedReasons = rejectedReasons.length

      if (fulfilledIds?.length > 0) {
        window.dispatchEvent(
          scheduleCustomEvent(ScheduleEvents.deleteMultiple, {
            detail: {scheduleIds: fulfilledIds},
          })
        )
      }

      if (displayToast) {
        if (fulfilledIds?.length > 0) {
          toast.push({
            closable: true,
            description: (
              <ToastDescription title={`${pluralize('schedule', numFulfilledIds, true)} deleted`} />
            ),
            status: 'success',
          })
        }
        if (rejectedReasons?.length > 0) {
          toast.push({
            closable: true,
            description: (
              <ToastDescription
                body={rejectedReasons?.toString()}
                title={`Unable to delete ${pluralize('schedule', numRejectedReasons, true)}`}
              />
            ),
            duration: 15000, // 15s
            status: 'error',
          })
        }
      }
    } catch (err) {
      if (displayToast) {
        toast.push({
          closable: true,
          description: (
            <ToastDescription body={getAxiosErrorMessage(err)} title="Unable to delete schedules" />
          ),
          duration: 15000, // 15s
          status: 'error',
        })
      }
    }
  }

  // TODO: this currently deletes the previous schedule, since it's not yet possible to update a schedule's state
  // from 'scheduled' to 'succeeded'. Update this endpoint when the above has been rectified by CL.
  async function executeSchedule({
    displayToast = true,
    schedule,
  }: {
    displayToast?: boolean
    schedule: Schedule
  }) {
    try {
      await _publish({documentIds: schedule?.documents?.map((document) => document.documentId)})
      await deleteSchedule({displayToast: false, schedule})

      window.dispatchEvent(scheduleCustomEvent(ScheduleEvents.execute, {detail: {schedule}}))

      if (displayToast) {
        toast.push({
          closable: true,
          description: <ToastDescription title="Document published" />,
          status: 'success',
        })
      }
    } catch (err) {
      if (displayToast) {
        toast.push({
          closable: true,
          description: (
            <ToastDescription body={getAxiosErrorMessage(err)} title="Unable to publish schedule" />
          ),
          duration: 15000, // 15s
          status: 'error',
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

      window.dispatchEvent(scheduleCustomEvent(ScheduleEvents.update, {detail: {date, scheduleId}}))

      if (displayToast) {
        toast.push({
          closable: true,
          description: (
            <ToastDescription
              body={formatDateTz({
                date,
                includeTimeZone: true,
                prefix: 'Publishing on ',
                timeZone,
              })}
              title="Schedule updated"
            />
          ),
          duration: 15000, // 15s
          status: 'success',
        })
      }
    } catch (err) {
      if (displayToast) {
        toast.push({
          closable: true,
          description: (
            <ToastDescription body={getAxiosErrorMessage(err)} title="Unable to update schedule" />
          ),
          duration: 15000, // 15s
          status: 'error',
        })
      }
    }
  }

  return {
    createSchedule,
    deleteSchedule,
    deleteSchedules,
    executeSchedule,
    updateSchedule,
  }
}
