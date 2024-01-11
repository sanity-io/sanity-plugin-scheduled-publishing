import {EarthAmericasIcon} from '@sanity/icons'
import {Box, Button, Text, Tooltip} from '@sanity/ui'
import React from 'react'
import useDialogTimeZone from '../../hooks/useDialogTimeZone'
import useTimeZone from '../../hooks/useTimeZone'

export interface ButtonTimeZoneProps {
  useElementQueries?: boolean
}

const ButtonTimeZone = (props: ButtonTimeZoneProps) => {
  const {useElementQueries} = props

  const {timeZone} = useTimeZone()
  const {DialogTimeZone, dialogProps, dialogTimeZoneShow} = useDialogTimeZone()

  return (
    <>
      {/* Dialog */}
      {DialogTimeZone && <DialogTimeZone {...dialogProps} />}

      <Tooltip
        content={
          <Box padding={2}>
            <Text muted size={1}>
              Displaying schedules in {timeZone.alternativeName} (GMT{timeZone.offset})
            </Text>
          </Box>
        }
        portal
      >
        <div>
          {/*
          If `useElementQueries` is enabled, dates will be conditionally toggled at different element
          breakpoints - provided this `<ButtonTimeZone>` is wrapped in a `<ButtonTimeZoneElementQuery>` component.
        */}
          {useElementQueries ? (
            <>
              <Box className="button-small">
                <Button
                  fontSize={1}
                  icon={EarthAmericasIcon}
                  mode="bleed"
                  onClick={dialogTimeZoneShow}
                  text={`${timeZone.abbreviation}`}
                />
              </Box>
              <Box className="button-large">
                <Button
                  fontSize={1}
                  icon={EarthAmericasIcon}
                  mode="bleed"
                  onClick={dialogTimeZoneShow}
                  text={`${timeZone.alternativeName} (${timeZone.namePretty})`}
                />
              </Box>
            </>
          ) : (
            <Button
              fontSize={1}
              icon={EarthAmericasIcon}
              mode="bleed"
              onClick={dialogTimeZoneShow}
              text={`${timeZone.alternativeName} (${timeZone.namePretty})`}
            />
          )}
        </div>
      </Tooltip>
    </>
  )
}

export default ButtonTimeZone
