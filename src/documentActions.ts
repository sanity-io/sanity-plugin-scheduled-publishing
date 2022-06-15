import {DocumentActionComponent} from 'sanity/desk'
import {ScheduleAction} from './documentActions/schedule'

type Action = DocumentActionComponent

export default function resolveDocumentActions(existingActions: Action[]): Action[] {
  // Add schedule action after default publish action
  const index = existingActions.findIndex((a) => a.action === 'publish')
  if (index < 0) {
    return [ScheduleAction, ...existingActions]
  }
  return [
    ...existingActions.slice(0, index + 1),
    ScheduleAction,
    ...existingActions.slice(index + 1),
  ]
}
