import {WarningOutlineIcon} from '@sanity/icons'
import {Card, Flex} from '@sanity/ui'
import {SanityDefaultPreview} from 'part:@sanity/base/preview'
import React, {PropsWithChildren, useMemo} from 'react'
import usePreviewState from '../../hooks/usePreviewState'
import {Schedule, ValidationStatus} from '../../types'
import DateWithTooltipElementQuery from './dateWithTooltip/DateWithTooltipElementQuery'
import {ScheduleContextMenu} from '../scheduleContextMenu'
import DocumentPreview from './DocumentPreview'
import ToolPreview from './ToolPreview'
import {useScheduleSchemaName, useScheduleSchemaType} from '../../hooks/useSchemaType'
import {getScheduledDocument} from '../../utils/paneItemHelpers'

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
    if (!schemaType) {
      return <NoSchemaItem schedule={schedule} />
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

function NoSchemaItem({schedule}: {schedule: Schedule}) {
  const schemaName = useScheduleSchemaName(schedule)
  return (
    <PreviewWrapper>
      <Card padding={1}>
        <SanityDefaultPreview
          icon={WarningOutlineIcon}
          layout="default"
          value={{
            subtitle: <em>It may have been deleted</em>,
            title: (
              <em>
                Document schema not found
                {schemaName && (
                  <>
                    {' '}
                    for type <code>{schemaName}</code>
                  </>
                )}
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
            subtitle: <em>It may have been deleted</em>,
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
