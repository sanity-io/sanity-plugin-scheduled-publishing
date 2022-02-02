import defaultResolve from 'part:@sanity/base/document-badges'
import ScheduledBadge from './documentBadges/ScheduledBadge'

export default function resolveDocumentBadges(props) {
  return [...defaultResolve(props), ScheduledBadge]
}
