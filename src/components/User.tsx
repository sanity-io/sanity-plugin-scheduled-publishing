import {UserAvatar} from '@sanity/base/components'
import {Avatar, Box, Inline, Text} from '@sanity/ui'
import React from 'react'
import nameToInitials from '../utils/nameToInitials'

interface Props {
  userId: string
}

const User = (props: Props) => {
  const {userId} = props

  return (
    <Box>
      <Inline space={2}>
        <UserAvatar userId={author} withTooltip />
        <Text size={1}>{user?.displayName}</Text>
      </Inline>
    </Box>
  )
}

export default User
