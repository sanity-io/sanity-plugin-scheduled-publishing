import {SanityProps} from './helperTypes'
import React, {forwardRef, Ref, useMemo} from 'react'
import {NestedFormBuilder} from './NestedFormBuilder'
import {ObjectSchemaType} from '@sanity/types'
import {ScheduleBanner} from './ScheduleBanner'

export const scheduledMarkerFieldName = 'hasScheduleWrapper'
export const validationMarkerField = '_validationError'

export const ScheduledDocumentInput = forwardRef(function ScheduledDocumentInput(
  props: SanityProps<{_id?: string; [validationMarkerField]?: boolean}>,
  ref: Ref<any>
) {
  if (props.type.jsonType !== 'object') {
    throw new Error(`jsonType of schema must be object, but was ${props.type.jsonType}`)
  }

  const type = useTypeWithMarkerField(props.type)
  const {value, markers} = props

  return (
    <>
      {value?._id ? <ScheduleBanner id={value._id} markers={markers} type={type} /> : null}
      <NestedFormBuilder {...props} ref={ref} type={type} />
    </>
  )
})

function useTypeWithMarkerField(type: ObjectSchemaType): ObjectSchemaType {
  return useMemo(() => typeWithMarkerField(type), [type])
}

function typeWithMarkerField(type: ObjectSchemaType): ObjectSchemaType {
  const t = {
    ...type,
    [scheduledMarkerFieldName]: true,
  }
  const typeOfType =
    'type' in type && type.type ? typeWithMarkerField(type.type as ObjectSchemaType) : undefined
  return {
    ...t,
    type: typeOfType,
  }
}

