import {Schedule} from '../types'
import {useMemo} from 'react'
import schema from 'part:@sanity/base/schema'
import {SchemaType} from '@sanity/types'

// @ts-expect-error schedule unused until we chan resolve schema using schedule
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useScheduleSchemaType(schedule: Schedule): SchemaType {
  // TODO: correctly infer type from schedule when exposed
  const schemaName = 'article'
  return useSchemaType(schemaName)
}

export function useSchemaType(schemaName: string): SchemaType {
  return useMemo(() => schema.get(schemaName), [schemaName])
}
