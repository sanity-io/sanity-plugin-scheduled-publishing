import {WarningOutlineIcon} from '@sanity/icons'
import {Card, Flex} from '@sanity/ui'
import {SanityDefaultPreview} from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import React, {PropsWithChildren, useMemo} from 'react'
import usePreviewState from '../../hooks/usePreviewState'
import {Schedule, ValidationStatus} from '../../types'
import DateWithTooltipElementQuery from '../DateWithTooltipElementQuery'
import ScheduleContextMenu from '../ScheduleContextMenu'
import DocumentPreview from './DocumentPreview'
import ToolPreview from './ToolPreview'
import {useScheduleSchemaType} from '../../hooks/useSchemaType'
import {getScheduledDocument} from '../../utils/paneItemHelpers'
import {SchemaType} from '@sanity/types'

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
    const hasSchemaType = Boolean(schemaType?.name && schema.get(schemaType.name))
    if (!hasSchemaType) {
      return <NoSchemaItem schemaType={schemaType} />
    }
    if (invalidDocument) {
      return <InvalidDocument schedule={schedule} />
    }

    if (type === 'document') {
      return (
        <PreviewWrapper>
          <DocumentPreview
            schedule={schedule}
            schemaType={schemaType}
            validationStatus={validationStatus}
          />
        </PreviewWrapper>
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
    return <PreviewWrapper />
  }, [previewState, schedule, schemaType, validationStatus])

  return <DateWithTooltipElementQuery>{preview}</DateWithTooltipElementQuery>
}

function NoSchemaItem({schemaType}: {schemaType: SchemaType}) {
  return (
    <PreviewWrapper>
      <Card padding={1}>
        <SanityDefaultPreview
          icon={WarningOutlineIcon}
          layout="default"
          value={{
            title: (
              <em>
                No schema found for type <code>{schemaType.name}</code>
              </em>
            ),
          }}
        />
      </Card>
    </PreviewWrapper>
  )
}

function InvalidDocument({schedule}: {schedule: Schedule}) {
  return (
    <PreviewWrapper>
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
    </PreviewWrapper>
  )
}

function PreviewWrapper(props: PropsWithChildren<unknown>) {
  return (
    <Card padding={1} radius={2} shadow={1}>
      <Flex align="center" justify="space-between">
        {props.children}
      </Flex>
    </Card>
  )
}
