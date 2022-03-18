import {gray, red, white} from '@sanity/color'
import {Box} from '@sanity/ui'
import React from 'react'

interface Props {
  mode?: 'default' | 'failed'
  selected?: boolean
}
const Pip = (props: Props) => {
  const {mode = 'default', selected} = props
  return (
    <Box
      style={{
        ...(mode === 'default'
          ? {
              background: gray[selected ? 100 : 500].hex,
              height: selected ? '5px' : '4px',
              width: selected ? '5px' : '4px',
            }
          : {}),
        ...(mode === 'failed'
          ? {
              background: selected ? 'transparent' : red[500].hex,
              outline: selected ? `1px solid ${white.hex}` : 'transparent',
              height: selected ? '3px' : '4px',
              width: selected ? '3px' : '4px',
            }
          : {}),
        borderRadius: '100%',
      }}
    />
  )
}

export default Pip
