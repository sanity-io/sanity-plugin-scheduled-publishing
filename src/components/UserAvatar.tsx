import {Avatar, Box, Inline, Text} from '@sanity/ui'
import React from 'react'
import useUser from '../hooks/useUser'
import nameToInitials from '../utils/nameToInitials'

interface Props {
  userId: string
}

const UserAvatar = (props: Props) => {
  const {userId} = props
  const {error, isLoading, value: user} = useUser(userId)

  if (error) {
    return null
  }

  // TODO: handle loading states

  return (
    <Box>
      <Inline space={2}>
        <Avatar
          alt={user?.displayName}
          color="blue"
          initials={user?.displayName && nameToInitials(user.displayName)}
          src={user?.imageUrl}
        />
        <Text size={1}>{user?.displayName}</Text>
      </Inline>
    </Box>
  )
}

export default UserAvatar
