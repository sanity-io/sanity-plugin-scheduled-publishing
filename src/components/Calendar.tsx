import {ChevronLeftIcon, ChevronRightIcon} from '@sanity/icons'
import {Box, Button, Flex, Text} from '@sanity/ui'
import React from 'react'
import styled from 'styled-components'
import ToolHeader from './ToolHeader'

const ButtonContainer = styled(Flex)`
  border-bottom: 1px solid var(--card-border-color);
  border-top: 1px solid var(--card-border-color);
`

const Calendar = () => {
  return (
    <Box>
      <ToolHeader paddingLeft={4}>
        <Flex align="center" flex={1} justify="space-between">
          <Text weight="medium">Month Year</Text>
          <Flex>
            <Button
              icon={ChevronLeftIcon}
              mode="bleed"
              radius={0}
              style={{height: '55px', width: '55px'}}
            />
            <Button
              icon={ChevronRightIcon}
              mode="bleed"
              radius={0}
              style={{height: '55px', width: '55px'}}
            />
          </Flex>
        </Flex>
      </ToolHeader>
      <Flex align="center" justify="center" padding={4} style={{aspectRatio: '350/280'}}>
        <Box>
          <Text>Calendar days</Text>
        </Box>
      </Flex>
      <ButtonContainer flex={1}>
        <Button
          fontSize={1}
          mode="bleed"
          padding={4}
          radius={0}
          style={{width: '100%'}}
          text="Today"
        />
      </ButtonContainer>
    </Box>
  )
}

export default Calendar
