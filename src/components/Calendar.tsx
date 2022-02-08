import {Box, Button, Flex} from '@sanity/ui'
import React from 'react'
import styled from 'styled-components'
import {DatePicker} from './DatePicker'

const ButtonContainer = styled(Flex)`
  border-bottom: 1px solid var(--card-border-color);
  border-top: 1px solid var(--card-border-color);
`

const Calendar = () => {
  const [date, setDate] = React.useState<Date>(new Date())
  return (
    <Box>
      <DatePicker onChange={setDate} value={date} />
      <ButtonContainer flex={1}>
        <Button
          fontSize={1}
          mode="bleed"
          padding={4}
          radius={0}
          style={{width: '100%'}}
          text="Today"
          onClick={() => setDate(new Date())}
        />
      </ButtonContainer>
    </Box>
  )
}

export default Calendar
