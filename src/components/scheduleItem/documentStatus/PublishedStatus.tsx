// https://github.com/sanity-io/sanity/blob/next/packages/%40sanity/desk-tool/src/components/PublishedStatus.tsx

import React from 'react'
import {Box, Text, Tooltip} from '@sanity/ui'
import {PublishIcon} from '@sanity/icons'
import {SanityDocument, TextWithTone} from 'sanity'
import {TimeAgo} from './TimeAgo'

export const PublishedStatus = ({document}: {document?: SanityDocument | null}) => (
  <Tooltip
    content={
      <Box padding={2}>
        <Text size={1}>
          {document ? (
            <>Published {document._updatedAt && <TimeAgo time={document._updatedAt} />}</>
          ) : (
            <>Not published</>
          )}
        </Text>
      </Box>
    }
    portal
  >
    <TextWithTone tone="positive" dimmed={!document} muted={!document} size={1}>
      <PublishIcon />
    </TextWithTone>
  </Tooltip>
)
