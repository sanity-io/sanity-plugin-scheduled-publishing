import {EarthAmericasIcon} from '@sanity/icons'
import {Autocomplete, Box, Popover, Stack} from '@sanity/ui'
import {getTimeZones} from '@vvo/tzdb'
import React from 'react'

const timeZones = getTimeZones()

const tzValues = timeZones.map((tz) => ({
  value: tz.currentTimeFormat,
}))

const TimezoneSelect = () => {
  // TODO: type correctly
  const handleRenderPopover = ({
    content,
    hidden,
    inputElement,
  }: {
    content: any
    hidden: any
    inputElement: any
  }) => {
    return (
      <Popover
        arrow={false}
        // constrainSize
        content={content}
        matchReferenceWidth
        padding={4}
        placement="bottom-start"
        portal
        referenceElement={inputElement}
        open={!hidden}
      />
    )
  }

  return (
    <Box>
      <Stack space={3}>
        <div>
          <Autocomplete
            icon={EarthAmericasIcon}
            id="timezone"
            openButton
            options={tzValues}
            placeholder="Timezone"
            renderPopover={handleRenderPopover}
          />
        </div>
      </Stack>
    </Box>
  )
}

export default TimezoneSelect
