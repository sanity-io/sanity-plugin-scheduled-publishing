import {Card, Flex, Stack, Text, Switch} from '@sanity/ui'
import React, {useEffect} from 'react'
import {usePublishedId} from '../../hooks/usePublishedId'
import {useSchemaType} from '../../hooks/useSchemaType'
import {useValidationStatus} from 'sanity'
import {useValidationState} from '../../utils/validationUtils'
import {ValidationInfo} from '../../components/validation/ValidationInfo'
import {DOCUMENT_HAS_ERRORS_TEXT} from '../../constants'
import {ScheduleAction} from '../../types'

interface Props {
  id: string
  schemaType: string
  onActionTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  actionType: ScheduleAction
}

export function NewScheduleInfo({id, schemaType, onActionTypeChange, actionType}: Props) {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      input#actionTypeToggle {
        --switch-bg-color: #6a7ea1;
      }
    `
    document.head.appendChild(style)
  }, [])

  return (
    <Stack space={4}>
      <Text size={1} weight="semibold">
        Toggle Publish/Unpublish
      </Text>

      <Flex align="center" gap={2}>
        <Text size={1} muted={actionType === 'unpublish'}>
          Publish
        </Text>
        <Switch
          id="actionTypeToggle"
          checked={actionType === 'unpublish'}
          onChange={onActionTypeChange}
        />
        <Text size={1} muted={actionType === 'publish'}>
          Unpublish
        </Text>
      </Flex>

      <Text size={1}>
        Schedule this document to be {actionType === 'publish' ? 'published' : 'unpublished'} at any
        time in the future.
        <br />
        Any edits in the meantime will be added to the scheduled document.
      </Text>

      <Text size={1}>Visit the Schedules page to get an overview of all schedules.</Text>

      <ValidationWarning id={id} type={schemaType} />
    </Stack>
  )
}

function ValidationWarning({id, type}: {id: string; type: string}) {
  const publishedId = usePublishedId(id)
  const schema = useSchemaType(type)
  const validationStatus = useValidationStatus(publishedId, type)
  const {hasError} = useValidationState(validationStatus.validation)

  if (!hasError) {
    return null
  }

  return (
    <Card padding={2} radius={1} shadow={1} tone="critical">
      <Flex gap={1} align="center">
        <ValidationInfo
          markers={validationStatus.validation}
          type={schema}
          documentId={publishedId}
        />
        <Text size={1}>{DOCUMENT_HAS_ERRORS_TEXT}</Text>
      </Flex>
    </Card>
  )
}
