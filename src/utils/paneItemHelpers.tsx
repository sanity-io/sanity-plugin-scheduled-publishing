// Source: https://github.com/sanity-io/sanity/blob/next/packages/@sanity/desk-tool/src/components/paneItem/helpers.tsx

// TODO: fix TS errors, consider manually declaring individual sanity parts

import {WarningOutlineIcon} from '@sanity/icons'
import {SanityDocument, SchemaType} from '@sanity/types'
import {observeForPreview} from 'part:@sanity/base/preview'
import {getDraftId, getPublishedId} from 'part:@sanity/base/util/draft-utils'
import React from 'react'
import {combineLatest, Observable, of} from 'rxjs'
import {map, startWith} from 'rxjs/operators'

export interface PaneItemPreviewState {
  isLoading?: boolean
  draft?: SanityDocument | null
  published?: SanityDocument | null
}

export interface PreviewValue {
  id?: string
  subtitle?: React.ReactNode
  title?: React.ReactNode
  media?: React.ReactNode | React.ComponentType
  icon?: boolean
  type?: string
  displayOptions?: {showIcon?: boolean}
  schemaType?: {name?: string}
}

const isLiveEditEnabled = (schemaType: any) => schemaType.liveEdit === true

export const getMissingDocumentFallback = (item: SanityDocument): PreviewValue => ({
  title: (
    <span style={{fontStyle: 'italic'}}>
      {item.title ? String(item.title) : 'Missing document'}
    </span>
  ),
  subtitle: (
    <span style={{fontStyle: 'italic'}}>
      {item.title ? `Missing document ID: ${item._id}` : `Document ID: ${item._id}`}
    </span>
  ),
  media: WarningOutlineIcon,
})

export function getPreviewStateObservable(
  schemaType: SchemaType,
  documentId: string,
  title: unknown
): Observable<PaneItemPreviewState> {
  const draft$ = isLiveEditEnabled(schemaType)
    ? of({snapshot: null})
    : observeForPreview({_id: getDraftId(documentId)}, schemaType)

  const published$ = observeForPreview({_id: getPublishedId(documentId)}, schemaType)

  return combineLatest([draft$, published$]).pipe(
    // @ts-ignore
    map(([draft, published]) => ({
      draft: draft.snapshot ? {title, ...(draft.snapshot as any)} : null,
      isLoading: false,
      // @ts-ignore
      published: published.snapshot ? {title, ...(published.snapshot as any)} : null,
    })),
    startWith({draft: null, isLoading: true, published: null})
  )
}
