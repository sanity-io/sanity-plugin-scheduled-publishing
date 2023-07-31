import React, {ReactNode, useCallback, useId} from 'react'
import {Button, CardTone, Container, Menu, MenuButton, Stack} from '@sanity/ui'
import {ValidationMarker, ObjectSchemaType, Path, SchemaType} from 'sanity'
import {useRouter} from 'sanity/router'
import {useValidationState} from '../../utils/validationUtils'
import {ErrorOutlineIcon, WarningOutlineIcon} from '@sanity/icons'
// eslint-disable-next-line no-restricted-imports
import * as PathUtils from '@sanity/util/paths'
import {usePublishedId} from '../../hooks/usePublishedId'
import {ValidationList} from './ValidationList'

interface ValidationProps {
  documentId?: string
  markers: ValidationMarker[]
  type?: SchemaType
  menuHeader?: ReactNode
}

const POPOVER_PROPS = {
  portal: true,
  constrainSize: true,
  preventOverflow: true,
  tone: 'default' as CardTone,
  width: 0,
}

export function ValidationInfo(props: ValidationProps) {
  const {type, markers, menuHeader, documentId} = props
  const router = useRouter()
  const {hasError, hasWarning} = useValidationState(markers)
  // use visibility so we can occupy the space equally for all states
  const visibility = hasError || hasWarning ? 'visible' : 'hidden'
  const id = useId() || ''
  const publishId = usePublishedId(documentId)

  const onFocus = useCallback(
    (path: Path) => {
      if (!publishId) {
        return
      }
      router.navigateIntent('edit', {
        id: publishId,
        path: encodeURIComponent(PathUtils.toString(path)),
      })
    },
    [router, publishId]
  )

  return (
    <MenuButton
      id={id || ''}
      button={
        <Button
          title="Show validation issues"
          mode="bleed"
          data-testid="schedule-validation-list-button"
          icon={hasError ? ErrorOutlineIcon : WarningOutlineIcon}
          style={{visibility}}
          tone={hasError ? 'critical' : 'default'}
        />
      }
      menu={
        <Menu padding={1}>
          <Container width={0}>
            <Stack space={1}>
              {menuHeader ?? null}
              <ValidationList
                documentType={type as ObjectSchemaType}
                validation={markers}
                onFocus={onFocus}
              />
            </Stack>
          </Container>
        </Menu>
      }
      popover={POPOVER_PROPS}
      placement="bottom-end"
    />
  )
}
