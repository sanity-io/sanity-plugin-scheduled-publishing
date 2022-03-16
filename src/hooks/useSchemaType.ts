import {Schedule} from '../types'
import {useMemo} from 'react'
import schema from 'part:@sanity/base/schema'
import {SchemaType} from '@sanity/types'
import {getScheduledDocument} from '../utils/paneItemHelpers'

export function useScheduleSchemaName(schedule: Schedule): string | undefined {
  const firstDocument = getScheduledDocument(schedule)
  return firstDocument?.documentType
}

export function useScheduleSchemaType(schedule: Schedule): SchemaType | undefined {
  const firstDocument = getScheduledDocument(schedule)
  return firstDocument.documentType ? useSchemaType(firstDocument.documentType) : undefined
}

export function useSchemaType(schemaName: string): SchemaType {
  return useMemo(() => schema.get(schemaName), [schemaName])
}
