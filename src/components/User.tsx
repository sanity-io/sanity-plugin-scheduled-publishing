import {UserAvatar} from '@sanity/base/components'
import React from 'react'

interface Props {
  userId: string
}

const User = (props: Props) => {
  const {userId} = props

  return <UserAvatar userId={userId} withTooltip />
}

export default User
