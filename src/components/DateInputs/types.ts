import {Marker} from '@sanity/types'

export type ParseResult = {isValid: boolean; date?: Date; error?: string} & (
  | {isValid: true; date: Date}
  | {isValid: false; error?: string}
)

export type CommonProps = {
  value?: string
  markers: Marker[]
  readOnly?: boolean
  level: number
  onFocus?: () => void
}
