import {DocumentActionComponent} from 'sanity'
import {DocumentActionDescription} from 'sanity'
import {DocumentActionProps} from 'sanity'
import {DocumentBadgeComponent} from 'sanity'
import {Plugin as Plugin_2} from 'sanity'
import {PropsWithChildren} from 'react'

declare type Action = DocumentActionComponent

export declare function EditScheduleForm(props: PropsWithChildren<Props>): JSX.Element

declare interface Props {
  onChange?: (formData: ScheduleFormData) => void
  value?: ScheduleFormData | null
}

export declare function resolveDocumentActions(existingActions: Action[]): Action[]

export declare function resolveDocumentBadges(
  existingBadges: DocumentBadgeComponent[]
): DocumentBadgeComponent[]

export declare interface Schedule {
  author: string
  action: ScheduleAction_2
  createdAt: string
  dataset: string
  description: string
  documents: {
    documentId: string
    documentType?: string
  }[]
  executeAt: string | null
  executedAt?: string
  id: string
  name: string
  projectId: string
  state: ScheduleState
  stateReason: string
}

export declare const ScheduleAction: (props: DocumentActionProps) => DocumentActionDescription

declare type ScheduleAction_2 = 'publish' | 'unpublish'

export declare const ScheduledBadge: DocumentBadgeComponent

export declare const scheduledPublishing: Plugin_2<void>

declare interface ScheduleFormData {
  date: string
}

declare type ScheduleState = 'cancelled' | 'scheduled' | 'succeeded'

export {}
