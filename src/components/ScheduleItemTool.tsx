import {IntentLink} from '@sanity/base/components'
import {WarningOutlineIcon} from '@sanity/icons'
import {SanityDocument, ValidationMarker} from '@sanity/types'
import {Box, Card, Flex, Inline} from '@sanity/ui'
import {validateDocument} from '@sanity/validation'
import {SanityDefaultPreview} from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import React, {forwardRef, useCallback, useEffect, useMemo, useState} from 'react'
import useDialogScheduleEdit from '../hooks/useDialogScheduleEdit'
import {Schedule} from '../types'
import {getPreviewStateObservable, PaneItemPreviewState} from '../utils/paneItemHelpers'
import DateWithTooltip from './DateWithTooltip'
import DateWithTooltipElementQuery from './DateWithTooltipElementQuery'
import ScheduleContextMenu from './ScheduleContextMenu'
import {DraftStatus} from './studio/DocumentStatus/DraftStatus'
import {PublishedStatus} from './studio/DocumentStatus/PublishedStatus'
import User from './User'

interface Props {
  schedule: Schedule
}

function useDocumentValidation(document?: SanityDocument | null): ValidationStatus {
  const [isValidating, setIsValidating] = useState(false)
  const [markers, setMarkers] = useState<ValidationMarker[]>([])

  const validate = useCallback(
    async function (doc?: SanityDocument | null) {
      setIsValidating(true)
      if (doc?._id) {
        const newMarkers = await validateDocument(doc, schema)
        setMarkers(newMarkers)
      } else {
        setMarkers([])
      }
      setIsValidating(false)
    },
    [setMarkers]
  )

  useEffect(() => {
    validate(document)
  }, [document])

  return {
    isValidating,
    markers,
  }
}

const ScheduleItemTool = (props: Props) => {
  const {schedule} = props

  // Whilst schedules can contain multiple documents, this plugin specifically limits schedules to one document only
  const firstDocument = schedule.documents?.[0]

  // TODO: correctly infer type from schedule when exposed
  const schemaType = useMemo(() => schema.get('article'), [])

  const {DialogScheduleEdit, dialogProps, dialogScheduleEditShow} = useDialogScheduleEdit(schedule)
  const [paneItemPreview, setPaneItemPreview] = useState<PaneItemPreviewState>({})

  const {draft, published, isLoading} = paneItemPreview

  const validation = useDocumentValidation(draft || published)
  console.log(`Schedule ${schedule.id}`, {
    markers: validation.markers,
    document: draft || published,
  })

  const visibleDocument = draft || published
  const invalidDocument = !visibleDocument && !isLoading
  const isCompleted = schedule.state === 'succeeded'
  const isScheduled = schedule.state === 'scheduled'

  const LinkComponent = useMemo(
    () =>
      forwardRef((linkProps: any, ref: any) => (
        <IntentLink
          {...linkProps}
          intent="edit"
          params={{
            type: schemaType.name,
            id: firstDocument?.documentId,
          }}
          ref={ref}
        />
      )),
    [IntentLink]
  )

  // Effects
  useEffect(() => {
    const subscription = getPreviewStateObservable(
      schemaType,
      firstDocument.documentId,
      ''
    ).subscribe((state) => {
      setPaneItemPreview(state)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return (
    <>
      {/* Dialogs */}
      {DialogScheduleEdit && <DialogScheduleEdit {...dialogProps} />}

      <DateWithTooltipElementQuery>
        <Card padding={1} radius={2} shadow={1}>
          <Flex align="center" justify="space-between">
            <Card
              __unstable_focusRing
              as={visibleDocument ? LinkComponent : undefined}
              data-as={visibleDocument ? 'a' : undefined}
              flex={1}
              padding={1}
              radius={2}
              tabIndex={0}
            >
              <Flex align="center" justify="space-between">
                {/* Preview */}
                <Box style={{flexBasis: 'auto', flexGrow: 1}}>
                  {invalidDocument ? (
                    <SanityDefaultPreview
                      layout="default"
                      media={<WarningOutlineIcon />}
                      subtitle={<em>It may have been since been deleted</em>}
                      title={<em>Document not found</em>}
                    />
                  ) : (
                    <SanityDefaultPreview
                      icon={schemaType?.icon}
                      isPlaceholder={isLoading}
                      layout="default"
                      value={visibleDocument}
                    />
                  )}
                </Box>

                {/* Schedule date */}
                <Box marginLeft={4} style={{flexShrink: 0, minWidth: '250px'}}>
                  <DateWithTooltip date={props.schedule.executeAt} useElementQueries />
                </Box>

                {/* Avatar */}
                <Box marginX={3} style={{flexShrink: 0}}>
                  <User id={schedule?.author} />
                </Box>

                {/* Document status */}
                <Box marginX={3} style={{flexShrink: 0}}>
                  {!isLoading && (
                    <Inline space={4}>
                      <PublishedStatus document={published} />
                      <DraftStatus document={draft} />
                    </Inline>
                  )}
                </Box>
              </Flex>
            </Card>

            {/* Context menu */}
            <Box marginLeft={1} style={{flexShrink: 0}}>
              <ScheduleContextMenu
                actions={
                  invalidDocument
                    ? {
                        delete: true,
                      }
                    : {
                        clear: isCompleted,
                        delete: !isCompleted,
                        edit: isScheduled,
                        execute: isScheduled,
                      }
                }
                onEdit={dialogScheduleEditShow}
                schedule={schedule}
              />
            </Box>
          </Flex>
        </Card>
      </DateWithTooltipElementQuery>
    </>
  )
}

export default ScheduleItemTool
