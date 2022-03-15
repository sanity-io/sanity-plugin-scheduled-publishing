import defaultResolve from 'part:@sanity/base/document-actions'
import {DocumentActionProps, DocumentActionComponent} from '@sanity/base'
import {ScheduleAction} from './documentActions/schedule'

type Action = DocumentActionComponent

export default function resolveDocumentActions(props: DocumentActionProps): Action[] {
  const defaultActions: Action[] = defaultResolve(props)

  // Add schedule action after default publish action
  return [
    ...defaultActions.slice(0, 1), //
    ScheduleAction,
    ...defaultActions.slice(1),
  ]
}
