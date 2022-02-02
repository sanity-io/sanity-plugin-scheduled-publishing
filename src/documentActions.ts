import defaultResolve, {
  PublishAction as DefaultPublishAction,
} from 'part:@sanity/base/document-actions'
import PublishAction from './documentActions/PublishAction'
import ScheduleAction from './documentActions/ScheduleAction'

export default function resolveDocumentActions(props) {
  const defaultActions = defaultResolve(props)

  // Remove default publish action
  const filteredActions = defaultActions.filter((action) => action !== DefaultPublishAction)

  // Add our custom actions
  return [PublishAction, ScheduleAction, ...filteredActions]
}
