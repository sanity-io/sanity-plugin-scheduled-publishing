import {Flex, FlexProps} from '@sanity/ui'
import React, {ReactNode} from 'react'
import styled from 'styled-components'

const Container = styled(Flex)`
  border-bottom: 1px solid var(--card-border-color);
`
interface Props extends FlexProps {
  children?: ReactNode
}

const ToolHeader = (props: Props) => {
  const {children} = props
  return (
    <Container align="center" style={{minHeight: '55px'}} {...props}>
      {children}
    </Container>
  )
}

export default ToolHeader
