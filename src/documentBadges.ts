import defaultResolve from 'part:@sanity/base/document-badges'
import {DocumentBadgeComponent, DocumentActionProps} from '@sanity/base'
import {ScheduledBadge} from './documentBadges/scheduled/ScheduledBadge'

export default function resolveDocumentBadges(
  props: DocumentActionProps
): DocumentBadgeComponent[] {
  return [...defaultResolve(props), ScheduledBadge]
}
