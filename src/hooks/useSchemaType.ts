import {Schedule} from '../types'
import {useMemo} from 'react'
import {SchemaType, useSchema} from 'sanity'
import {getScheduledDocument} from '../utils/paneItemHelpers'

export function useScheduleSchemaType(schedule: Schedule): SchemaType | undefined {
  const firstDocument = getScheduledDocument(schedule)
  const schema = useSchema()
  const schemaName = firstDocument.documentType

  return useMemo(() => {
    if (!schemaName) {
      return undefined
    }
    return schema.get(schemaName) as SchemaType
  }, [schemaName, schema])
}

export function useSchemaType(schemaName: string): SchemaType {
  const schema = useSchema()
  return useMemo(() => schema.get(schemaName) as SchemaType, [schemaName, schema])
}
