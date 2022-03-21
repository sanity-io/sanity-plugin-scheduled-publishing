import {SchemaType} from '@sanity/types'
import {Box, Card, Flex, Inline, Text} from '@sanity/ui'
import React, {ElementType, ReactNode, useState} from 'react'
import {DOCUMENT_HAS_ERRORS_TEXT, DOCUMENT_HAS_WARNINGS_TEXT} from '../../constants'
import {Schedule} from '../../types'
import {PaneItemPreviewState} from '../../utils/paneItemHelpers'
import {EMPTY_VALIDATION_STATUS, useValidationState} from '../../utils/validationUtils'
import {getLastExecuteDate} from '../../utils/scheduleUtils'
import {ValidationInfo} from '../validation/ValidationInfo'
import DateWithTooltip from './dateWithTooltip/DateWithTooltip'
import {DraftStatus} from './documentStatus/DraftStatus'
import {PublishedStatus} from './documentStatus/PublishedStatus'
import User from './User'
import {ValidateScheduleDoc} from '../validation/SchedulesValidation'

interface Props {
  children?: ReactNode
  contextMenu?: ReactNode
  // eslint-disable-next-line no-undef
  linkComponent?: ElementType | keyof JSX.IntrinsicElements
  onClick?: () => void
  previewState?: PaneItemPreviewState
  publishedDocumentId?: string
  schedule: Schedule
  schemaType?: SchemaType
  useElementQueries?: boolean
}

const PreviewWrapper = (props: Props) => {
  const {
    children,
    contextMenu,
    linkComponent,
    onClick,
    previewState,
    publishedDocumentId,
    schedule,
    schemaType,
    useElementQueries,
  } = props

  const [validationStatus, setValidationStatus] = useState(EMPTY_VALIDATION_STATUS)
  const {markers} = validationStatus
  const {hasError, validationTone} = useValidationState(markers)

  return (
    <Card padding={1} radius={2} shadow={1} tone={validationTone}>
      <Flex align="center" gap={1} justify="space-between">
        <Card
          __unstable_focusRing
          as={linkComponent ? linkComponent : undefined}
          data-as={onClick || linkComponent ? 'a' : undefined}
          flex={1}
          onClick={onClick}
          padding={1}
          radius={2}
          tabIndex={0}
          tone={validationTone}
        >
          <Flex align="center" justify="space-between">
            {children && <Box style={{flexBasis: 'auto', flexGrow: 1}}>{children}</Box>}

            {/* Schedule date */}
            <Box
              marginLeft={children ? [3, 3, 4] : 2}
              style={{
                flexShrink: 0,
                maxWidth: '250px',
                width: children ? '35%' : 'auto',
              }}
            >
              <DateWithTooltip
                date={getLastExecuteDate(schedule)}
                useElementQueries={useElementQueries}
              />
            </Box>

            <Flex align="center" style={{flexShrink: 0}}>
              {/* Avatar */}
              <Box display={['none', 'none', 'block']} marginX={3} style={{flexShrink: 0}}>
                <User id={schedule?.author} />
              </Box>

              {/* Document status */}
              <Box marginX={[2, 2, 3]} style={{flexShrink: 0}}>
                <Inline space={4}>
                  <PublishedStatus document={previewState?.published} />
                  <DraftStatus document={previewState?.draft} />
                </Inline>
              </Box>
            </Flex>
          </Flex>
        </Card>

        {/* Validation status */}
        <Box>
          <ValidateScheduleDoc schedule={schedule} updateValidation={setValidationStatus} />
          <ValidationInfo
            markers={markers}
            type={schemaType}
            documentId={publishedDocumentId}
            menuHeader={
              <Box padding={2}>
                <Text size={1}>
                  {hasError ? DOCUMENT_HAS_ERRORS_TEXT : DOCUMENT_HAS_WARNINGS_TEXT}
                </Text>
              </Box>
            }
          />
        </Box>

        {/* Context menu */}
        {contextMenu && <Box style={{flexShrink: 0}}>{contextMenu}</Box>}
      </Flex>
    </Card>
  )
}

export default PreviewWrapper
