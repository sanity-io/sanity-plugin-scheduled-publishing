import {Marker, SchemaType} from '@sanity/types'
import {Box, Card, Flex, Inline, Text} from '@sanity/ui'
import {SanityDefaultPreview} from 'part:@sanity/base/preview'
import React, {ElementType, ReactNode} from 'react'
import {DOCUMENT_HAS_ERRORS_TEXT, DOCUMENT_HAS_WARNINGS_TEXT} from '../../constants'
import {Schedule} from '../../types'
import {PaneItemPreviewState} from '../../utils/paneItemHelpers'
import {useValidationState} from '../../utils/validationUtils'
import {ValidationInfo} from '../validation/ValidationInfo'
import DateWithTooltip from './dateWithTooltip/DateWithTooltip'
import {DraftStatus} from './documentStatus/DraftStatus'
import {PublishedStatus} from './documentStatus/PublishedStatus'
import User from './User'

interface Props {
  children?: ReactNode
  contextMenu?: ReactNode
  // eslint-disable-next-line no-undef
  linkComponent?: ElementType | keyof JSX.IntrinsicElements
  markers?: Marker[]
  onClick?: () => void
  previewState?: PaneItemPreviewState
  publishedDocumentId?: string
  schedule: Schedule
  schemaType?: SchemaType
}

const PreviewWrapper = (props: Props) => {
  const {
    children,
    contextMenu,
    linkComponent,
    markers = [],
    onClick,
    previewState,
    publishedDocumentId,
    schedule,
    schemaType,
  } = props

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
                width: '35%',
              }}
            >
              <DateWithTooltip date={schedule.executeAt} useElementQueries />
            </Box>

            {!children && (
              <Box style={{visibility: 'hidden'}}>
                <SanityDefaultPreview />
              </Box>
            )}

            <Flex align="center">
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
