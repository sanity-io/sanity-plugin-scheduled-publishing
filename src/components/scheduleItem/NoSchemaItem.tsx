import {WarningOutlineIcon} from '@sanity/icons'
import {SanityDefaultPreview} from 'part:@sanity/base/preview'
import React from 'react'
import {Schedule} from '../../types'
import {FallbackContextMenu} from '../scheduleContextMenu/FallbackContextMenu'
import PreviewWrapper from './PreviewWrapper'

const NoSchemaItem = ({schedule}: {schedule: Schedule}) => {
  return (
    <PreviewWrapper
      contextMenu={<FallbackContextMenu schedule={schedule} />}
      schedule={schedule}
      useElementQueries
    >
      <SanityDefaultPreview
        icon={WarningOutlineIcon}
        layout="default"
        value={{
          subtitle: <em>It may have been deleted</em>,
          title: <em>Document not found</em>,
        }}
      />
    </PreviewWrapper>
  )
}

export default NoSchemaItem
