import {Card, CardProps} from '@sanity/ui'
import React, {ReactNode} from 'react'
interface Props extends CardProps {
  children?: ReactNode
}

const Stub = (props: Props) => {
  const {children} = props
  return (
    <Card border padding={2} tone="default" {...props}>
      {children}
    </Card>
  )
}

export default Stub
