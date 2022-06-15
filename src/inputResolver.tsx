import {ScheduledDocumentInput} from './components/documentWrapper/ScheduledDocumentInput'
import {InputProps, RenderInputCallback} from 'sanity/lib/dts/src/form'
import React, {ReactNode} from 'react'

export const resolveInput = (props: InputProps, next: RenderInputCallback): ReactNode => {
  const {schemaType} = props
  const rootType = getRootType(schemaType)
  if (rootType.name === 'document') {
    return <ScheduledDocumentInput {...props}>{next(props)}</ScheduledDocumentInput>
  }
  return undefined
}

function getRootType(type: any): any {
  if (!type.type) {
    return type
  }
  return getRootType(type.type)
}
