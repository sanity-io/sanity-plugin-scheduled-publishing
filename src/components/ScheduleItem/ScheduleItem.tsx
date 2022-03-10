import {WarningOutlineIcon} from '@sanity/icons'
import {Card, Flex} from '@sanity/ui'
import {SanityDefaultPreview} from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import React, {useMemo} from 'react'
import usePreviewState from '../../hooks/usePreviewState'
import {Schedule} from '../../types'
import DateWithTooltipElementQuery from '../DateWithTooltipElementQuery'
import ScheduleContextMenu from '../ScheduleContextMenu'
import DocumentPreview from './DocumentPreview'
import ToolPreview from './ToolPreview'

interface Props {
  schedule: Schedule
  type: 'document' | 'tool'
}

export const ScheduleItem = (props: Props) => {
  const {schedule, type} = props

  // Whilst schedules can contain multiple documents, this plugin specifically limits schedules to one document only
  const firstDocument = schedule.documents?.[0]

  // TODO: correctly infer type from schedule when exposed
  const schemaName = 'article'
  const schemaType = useMemo(() => schema.get(schemaName), [])

  const previewState = usePreviewState(firstDocument?.documentId, schemaType)

  const visibleDocument = previewState.draft || previewState.published
  const invalidDocument = !visibleDocument && !previewState.isLoading

  // Generate preview component based on wheter this document and schema exists
  const preview = useMemo(() => {
    const hasSchemaType = Boolean(schemaType?.name && schema.get(schemaType.name))

    // Fallback if no valid schema is found
    if (!hasSchemaType) {
      return (
        <Card padding={1}>
          <SanityDefaultPreview
            icon={WarningOutlineIcon}
            layout="default"
            value={{
              title: (
                <em>
                  No schema found for type <code>{schemaName}</code>
                </em>
              ),
            }}
          />
        </Card>
      )
    }

    // Fallback if document is not defined
    if (invalidDocument) {
      return (
        <>
          <Card padding={1}>
            <SanityDefaultPreview
              icon={WarningOutlineIcon}
              layout="default"
              value={{
                subtitle: <em>It may have been since been deleted</em>,
                title: <em>Document not found</em>,
              }}
            />
          </Card>
          <ScheduleContextMenu actions={{delete: true}} schedule={schedule} />
        </>
      )
    }

    if (type === 'document') {
      return <DocumentPreview schedule={schedule} />
    }

    if (type === 'tool') {
      return <ToolPreview previewState={previewState} schedule={schedule} schemaType={schemaType} />
    }

    return null
  }, [previewState])

  return (
    <DateWithTooltipElementQuery>
      <Card padding={1} radius={2} shadow={1}>
        <Flex align="center" justify="space-between">
          {preview}
        </Flex>
      </Card>
    </DateWithTooltipElementQuery>
  )
}
