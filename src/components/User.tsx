import {UserAvatar} from '@sanity/base/components'
import {Box, Inline} from '@sanity/ui'
import React from 'react'

interface Props {
  userId: string
}

const User = (props: Props) => {
  const {userId} = props

  return (
    <Box>
      <Inline space={2}>
        <UserAvatar userId={userId} withTooltip />
        {/* <Text size={1}>{user?.displayName}</Text> */}
      </Inline>
    </Box>
  )
}

export default User
