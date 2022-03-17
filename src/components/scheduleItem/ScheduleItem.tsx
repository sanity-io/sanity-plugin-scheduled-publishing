import React, {useMemo} from 'react'
import usePreviewState from '../../hooks/usePreviewState'
import {useScheduleSchemaType} from '../../hooks/useSchemaType'
import {Schedule, ValidationStatus} from '../../types'
import {getScheduledDocument} from '../../utils/paneItemHelpers'
import DateWithTooltipElementQuery from './dateWithTooltip/DateWithTooltipElementQuery'
import DocumentPreview from './DocumentPreview'
import NoSchemaItem from './NoSchemaItem'
import ToolPreview from './ToolPreview'

interface Props {
  schedule: Schedule
  validationStatus: ValidationStatus
  type: 'document' | 'tool'
}

export const ScheduleItem = (props: Props) => {
  const {schedule, type, validationStatus} = props

  const firstDocument = getScheduledDocument(schedule)

  const schemaType = useScheduleSchemaType(schedule)
  const previewState = usePreviewState(firstDocument?.documentId, schemaType)

  const visibleDocument = previewState.draft || previewState.published
  const invalidDocument = !visibleDocument && !previewState.isLoading

  const preview = useMemo(() => {
    if (!schemaType || invalidDocument) {
      return <NoSchemaItem schedule={schedule} />
    }

    if (type === 'document') {
      return (
        <DocumentPreview
          schedule={schedule}
          schemaType={schemaType}
          validationStatus={validationStatus}
        />
      )
    }

    if (type === 'tool') {
      return (
        <ToolPreview
          previewState={previewState}
          schedule={schedule}
          schemaType={schemaType}
          validationStatus={validationStatus}
        />
      )
    }

    return null
  }, [previewState, schedule, schemaType, validationStatus])

  return <DateWithTooltipElementQuery>{preview}</DateWithTooltipElementQuery>
}
