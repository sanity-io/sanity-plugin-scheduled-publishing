import {SchemaType} from '@sanity/types'
import {useEffect, useState} from 'react'
import {getPreviewStateObservable, PaneItemPreviewState} from '../utils/paneItemHelpers'

export default function usePreviewState(
  documentId: string,
  schemaType?: SchemaType
): PaneItemPreviewState {
  const [paneItemPreview, setPaneItemPreview] = useState<PaneItemPreviewState>({})

  useEffect(() => {
    if (!schemaType) {
      return undefined
    }
    const subscription = getPreviewStateObservable(schemaType, documentId, '').subscribe(
      (state) => {
        setPaneItemPreview(state)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [schemaType])

  return paneItemPreview
}
