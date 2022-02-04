import {EarthAmericasIcon} from '@sanity/icons'
import {Autocomplete, Box} from '@sanity/ui'
import React from 'react'
import useTimezone, {allTimezones} from '../hooks/useTimezone'

const options = allTimezones.map((tz) => ({
  value: tz.currentTimeFormat,
}))

const TimezoneInput = () => {
  const {timezone, setTimezone} = useTimezone()

  return (
    <Box padding={1}>
      <Autocomplete
        icon={EarthAmericasIcon}
        id="timezone"
        openButton
        options={options}
        placeholder="Timezone"
        onChange={(value) => setTimezone(value)}
        value={timezone.currentTimeFormat}
        // Remove cities from timezone format for cleaner UI
        // "-11:00 Samoa Time - Pago Pago" => "-11:00 Samoa Time"
        renderValue={(value) => value?.split(' - ')[0]}
        tabIndex={-1}
        fontSize={1}
      />
    </Box>
  )
}

export default TimezoneInput
