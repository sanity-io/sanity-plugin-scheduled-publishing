import {ScheduledDocumentInput} from './components/documentWrapper/ScheduledDocumentInput'
import {InputProps} from 'sanity'
import React, {ComponentType} from 'react'

export const DocumentBannerInput: ComponentType<InputProps> = (props) => {
  const {schemaType} = props
  const rootType = getRootType(schemaType)
  if (rootType.name === 'document') {
    return <ScheduledDocumentInput {...props}>{props.renderDefault(props)}</ScheduledDocumentInput>
  }
  return props.renderDefault(props)
}

function getRootType(type: any): any {
  if (!type.type) {
    return type
  }
  return getRootType(type.type)
}
