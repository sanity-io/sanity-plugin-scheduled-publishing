import {Button, ButtonTone, Card, Flex} from '@sanity/ui'
import React, {ComponentType, ReactNode} from 'react'

interface Props {
  buttonText?: string
  disabled?: boolean
  icon?: ComponentType | ReactNode
  onAction?: () => void
  onClose: () => void
  tone?: ButtonTone
}

const DialogFooter = (props: Props) => {
  const {buttonText = 'Action', disabled, icon, onClose, onAction, tone = 'positive'} = props
  return (
    <Flex>
      <Card flex={1}>
        <Button mode="bleed" onClick={onClose} style={{width: '100%'}} text="Cancel" />
      </Card>
      {onAction && (
        <Card flex={1} marginLeft={3}>
          <Button
            disabled={disabled}
            icon={icon}
            onClick={onAction}
            style={{width: '100%'}}
            text={buttonText}
            tone={tone}
          />
        </Card>
      )}
    </Flex>
  )
}

export default DialogFooter
