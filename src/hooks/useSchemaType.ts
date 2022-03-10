import {Schedule} from '../types'
import {useMemo} from 'react'
import schema from 'part:@sanity/base/schema'
import {SchemaType} from '@sanity/types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-expect-error schedule unused until we chan resolve schema using schedule
export function useSchemaType(schedule: Schedule): SchemaType {
  // TODO: correctly infer type from schedule when exposed
  const schemaName = 'article'
  return useMemo(() => schema.get(schemaName), [])
}
