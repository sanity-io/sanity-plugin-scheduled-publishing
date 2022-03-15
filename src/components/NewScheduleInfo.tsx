import {Card, Flex, Stack, Text} from '@sanity/ui'
import React from 'react'
import {usePublishedId} from '../hooks/usePublishedId'
import {useSchemaType} from '../hooks/useSchemaType'
import {useValidationStatus} from '@sanity/react-hooks'
import {useValidationState} from '../utils/validationUtils'
import {ValidationInfo} from './validation/ValidationInfo'
import {DOCUMENT_HAS_ERRORS_TEXT} from '../constants'

interface Props {
  id: string
  schemaType: string
}

export function NewScheduleInfo({id, schemaType}: Props) {
  return (
    <Stack space={4}>
      <Text size={1}>
        Schedule this document to be published at any time in the future.
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
  const {hasError} = useValidationState(validationStatus.markers)

  if (!hasError) {
    return null
  }

  return (
    <Card padding={2} radius={1} shadow={1} tone="critical">
      <Flex gap={1} align="center">
        <ValidationInfo markers={validationStatus.markers} type={schema} documentId={publishedId} />
        <Text size={1}>{DOCUMENT_HAS_ERRORS_TEXT}</Text>
      </Flex>
    </Card>
  )
}
