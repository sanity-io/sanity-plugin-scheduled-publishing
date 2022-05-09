import {black, hues} from '@sanity/color'
import {SearchIcon} from '@sanity/icons'
import {Autocomplete, Box, Card, Dialog, Flex, Inline, Stack, Text} from '@sanity/ui'
import React, {useMemo, useState} from 'react'
import useTimeZone, {allTimeZones, getLocalTimeZone} from '../../hooks/useTimeZone'
import {NormalizedTimeZone} from '../../types'
import DialogFooter from './DialogFooter'

interface Props {
  onClose?: () => void
}

const DialogTimeZone = (props: Props) => {
  const {onClose} = props

  const {setTimeZone, timeZone} = useTimeZone()
  const [selectedTz, setSelectedTz] = useState<NormalizedTimeZone | undefined>(timeZone)

  // Callbacks
  const handleTimeZoneChange = (value: string) => {
    const tz = allTimeZones.find((v) => v.value === value)
    setSelectedTz(tz)
  }

  const handleTimeZoneSelectLocal = () => {
    setSelectedTz(getLocalTimeZone())
  }

  const handleTimeZoneUpdate = () => {
    if (selectedTz) {
      setTimeZone(selectedTz)
    }
    onClose?.()
  }

  const isDirty = selectedTz?.name !== timeZone.name
  const isLocalTzSelected = useMemo(() => {
    return selectedTz?.name === getLocalTimeZone().name
  }, [selectedTz])

  return (
    <Dialog
      footer={
        <Box paddingX={4} paddingY={3}>
          <DialogFooter
            buttonText="Update time zone"
            disabled={!isDirty || !selectedTz}
            onAction={handleTimeZoneUpdate}
            onComplete={onClose}
            tone="primary"
          />
        </Box>
      }
      header="Select time zone"
      id="time-zone"
      onClose={onClose}
      width={1}
    >
      <Stack padding={4} space={5}>
        <Text size={1}>
          The selected time zone will change how dates are represented in schedules.
        </Text>

        <Stack space={3}>
          <Flex align="center" justify="space-between">
            <Inline space={2}>
              <Text size={1} weight="semibold">
                Time zone
              </Text>
              {isLocalTzSelected && (
                <Text muted size={1}>
                  local time
                </Text>
              )}
            </Inline>
            {!isLocalTzSelected && (
              <Text size={1} weight="medium">
                <a onClick={handleTimeZoneSelectLocal} style={{cursor: 'pointer'}}>
                  Select local time zone
                </a>
              </Text>
            )}
          </Flex>

          <Autocomplete
            fontSize={2}
            icon={SearchIcon}
            id="timezone"
            onChange={handleTimeZoneChange}
            openButton
            options={allTimeZones}
            padding={4}
            placeholder="Search for a city or time zone"
            popover={{
              boundaryElement: document.querySelector('body'),
              constrainSize: true,
              placement: 'bottom-start',
            }}
            renderOption={(option) => {
              return (
                <Card as="button" padding={3}>
                  <Text size={1} textOverflow="ellipsis">
                    <span>GMT{option.offset}</span>
                    <span
                      style={{
                        color: black.hex,
                        fontWeight: 500,
                        marginLeft: '1em',
                      }}
                    >
                      {option.alternativeName}
                    </span>
                    <span
                      style={{
                        color: hues.gray[700].hex,
                        marginLeft: '1em',
                      }}
                    >
                      {option.mainCities}
                    </span>
                  </Text>
                </Card>
              )
            }}
            renderValue={(_, option) => {
              if (!option) return ''
              return `${option.alternativeName} (${option.namePretty})`
            }}
            tabIndex={-1}
            value={selectedTz?.value}
          />
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default DialogTimeZone
