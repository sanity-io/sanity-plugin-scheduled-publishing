import {UserAvatar} from 'sanity'
import React from 'react'

interface Props {
  id: string
}

const User = (props: Props) => {
  const {id} = props
  return <UserAvatar user={id} withTooltip />
}

export default User
