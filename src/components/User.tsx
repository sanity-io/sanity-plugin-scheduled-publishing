import {UserAvatar} from '@sanity/base/components'
import React from 'react'

interface Props {
  id: string
}

const User = (props: Props) => {
  const {id} = props

  return <UserAvatar userId={id} withTooltip />
}

export default User
