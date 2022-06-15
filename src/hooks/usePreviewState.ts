import {SchemaType} from 'sanity'
import {useEffect, useState} from 'react'
import {getPreviewStateObservable, PaneItemPreviewState} from '../utils/paneItemHelpers'
import {useDocumentPreviewStore} from 'sanity/_unstable'

export default function usePreviewState(
  documentId: string,
  schemaType?: SchemaType
): PaneItemPreviewState {
  const documentPreviewStore = useDocumentPreviewStore()
  const [paneItemPreview, setPaneItemPreview] = useState<PaneItemPreviewState>({})

  useEffect(() => {
    if (!schemaType) {
      return undefined
    }
    const subscription = getPreviewStateObservable(
      documentPreviewStore,
      schemaType,
      documentId,
      ''
    ).subscribe((state) => {
      setPaneItemPreview(state)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [documentPreviewStore, schemaType, documentId])

  return paneItemPreview
}
