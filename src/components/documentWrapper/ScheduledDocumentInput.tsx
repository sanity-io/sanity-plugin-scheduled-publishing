import React, {PropsWithChildren, useMemo} from 'react'
import {ScheduleBanner} from './ScheduleBanner'
import {InputProps, ValidationMarker} from 'sanity'

export function ScheduledDocumentInput(props: PropsWithChildren<InputProps>) {
  const {value, validation, children} = props
  const doc: {_id?: string} = value as unknown as {_id: string}

  const markers: ValidationMarker[] = useMemo(
    () =>
      validation.map((v) => ({
        level: v.level,
        path: v.path,
        item: {message: v.message},
      })),
    [validation]
  )

  return (
    <>
      {doc?._id ? <ScheduleBanner id={doc._id} markers={markers} /> : null}
      {children}
    </>
  )
}
