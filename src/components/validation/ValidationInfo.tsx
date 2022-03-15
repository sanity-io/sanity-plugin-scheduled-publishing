import React, {ReactNode, useCallback} from 'react'
import {Button, Card, Container, Menu, MenuButton, Stack} from '@sanity/ui'
import {Marker, ObjectSchemaType, Path, SchemaType} from '@sanity/types'
import {useValidationState} from '../../utils/validationUtils'
import {ErrorOutlineIcon, WarningOutlineIcon} from '@sanity/icons'
import {useId} from '@reach/auto-id'
import {ValidationList} from '@sanity/base/components'
import {HOCRouter, withRouterHOC} from '@sanity/base/router'
import * as PathUtils from '@sanity/util/paths'
import {usePublishedId} from '../../hooks/usePublishedId'

interface ValidationProps {
  documentId?: string
  markers: Marker[]
  type: SchemaType
  menuHeader?: ReactNode
}

const POPOVER_PROPS = {
  portal: true,
  constrainSize: true,
  preventOverflow: true,
  width: 0,
}

export const ValidationInfo = withRouterHOC(ValidationInfoWithRouter)

function ValidationInfoWithRouter(props: ValidationProps & {router: HOCRouter}) {
  const {type, markers, menuHeader, router, documentId} = props
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
    <Card tone="default">
      <MenuButton
        id={id || ''}
        button={
          <Card tone={hasError ? 'critical' : 'default'} style={{visibility}}>
            <Button
              tone={hasError ? 'critical' : 'caution'}
              style={{background: 'none'}}
              title="Show validation issues"
              mode="bleed"
              data-testid="schedule-validation-list-button"
              icon={hasError ? ErrorOutlineIcon : WarningOutlineIcon}
            />
          </Card>
        }
        menu={
          <Menu padding={3}>
            <Container width={0}>
              <Stack space={3}>
                {menuHeader ?? null}
                <ValidationList
                  documentType={type as ObjectSchemaType}
                  markers={markers}
                  onFocus={onFocus}
                />
              </Stack>
            </Container>
          </Menu>
        }
        popover={POPOVER_PROPS}
        placement="bottom-end"
      />
    </Card>
  )
}
