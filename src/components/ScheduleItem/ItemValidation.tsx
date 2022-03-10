import React from 'react'
import {ErrorOutlineIcon, WarningOutlineIcon} from '@sanity/icons'
import {Box, Card, CardTone, Flex, Menu, Stack, Text, Tooltip} from '@sanity/ui'
import {ObjectSchemaType, SchemaType} from '@sanity/types'
import {ValidationList} from '@sanity/base/components'
import {ValidationStatus} from '../../types'

interface Props {
  validationStatus: ValidationStatus
  type: SchemaType
  hasError: boolean
  hasWarning: boolean
  tone: CardTone
}

export function ItemValidation({hasError, hasWarning, tone, validationStatus, type}: Props) {
  // use visibility so we can occupy the space equally for all states
  const visibility = hasError || hasWarning ? 'visible' : 'hidden'
  const warningOnly = !hasError && hasWarning
  return (
    <Box style={{visibility}}>
      <Tooltip
        portal
        content={
          <Card tone={tone} style={{maxWidth: 400}}>
            <Stack space={2}>
              <Box paddingX={3} paddingTop={3}>
                <Text>
                  {warningOnly
                    ? 'This document has validation warnings.'
                    : 'This document has validation errors that should be resolved before the publishing date.'}
                </Text>
              </Box>
              <Flex align="flex-start">
                <Menu open>
                  <ValidationList
                    documentType={type as ObjectSchemaType}
                    markers={validationStatus.markers}
                  />
                </Menu>
              </Flex>
            </Stack>
          </Card>
        }
      >
        <Card tone={warningOnly ? 'caution' : 'critical'}>
          <Text size={2} accent>
            {warningOnly ? <WarningOutlineIcon /> : <ErrorOutlineIcon />}
          </Text>
        </Card>
      </Tooltip>
    </Box>
  )
}
