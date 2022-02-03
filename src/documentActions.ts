import defaultResolve, {
  PublishAction as DefaultPublishAction,
} from 'part:@sanity/base/document-actions'
import {DocumentActionProps, DocumentActionComponent} from '@sanity/base'
import PublishAction from './documentActions/PublishAction'
import ScheduleAction from './documentActions/ScheduleAction'

type Action = DocumentActionComponent

export default function resolveDocumentActions(props: DocumentActionProps): Action[] {
  const defaultActions: Action[] = defaultResolve(props)

  // Remove default publish action
  const filteredActions = defaultActions.filter((action) => action !== DefaultPublishAction)

  // Add our custom actions
  return [PublishAction, ScheduleAction, ...filteredActions]
}
