import React, {useCallback} from 'react'
import {getMinutes, setMinutes, parse, parseISO, isValid} from 'date-fns'
import {formatInTimeZone} from 'date-fns-tz'
import {CommonDateTimeInput} from '@sanity/form-builder/lib/inputs/DateInputs/CommonDateTimeInput'

// import PatchEvent, {set, unset} from '../../PatchEvent'
import {CommonProps, ParseResult} from './types'
import {isValidDate} from './utils'
import {TimeZone} from '../../types'

type ParsedOptions = {
  dateFormat: string
  timeFormat: string
  timeStep: number
  calendarTodayLabel: string
}
type SchemaOptions = {
  dateFormat?: string
  timeFormat?: string
  timeStep?: number
  calendarTodayLabel?: string
}
const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd'
const DEFAULT_TIME_FORMAT = 'HH:mm'

export type Props = CommonProps & {
  onChange: (date: string | null) => void
  timeZone: TimeZone
  type: {
    name: string
    title: string
    description?: string
    options?: SchemaOptions
    placeholder?: string
  }
}

function parseOptions(options: SchemaOptions = {}): ParsedOptions {
  return {
    dateFormat: options.dateFormat || DEFAULT_DATE_FORMAT,
    timeFormat: options.timeFormat || DEFAULT_TIME_FORMAT,
    timeStep: ('timeStep' in options && Number(options.timeStep)) || 1,
    calendarTodayLabel: options.calendarTodayLabel || 'Today',
  }
}

function serialize(date: Date) {
  return date.toISOString()
}
function deserialize(isoString: string): ParseResult {
  const deserialized = new Date(isoString)
  if (isValidDate(deserialized)) {
    return {isValid: true, date: deserialized}
  }
  return {isValid: false, error: `Invalid date value: "${isoString}"`}
}

// enforceTimeStep takes a dateString and datetime schema options and enforces the time
// to be within the configured timeStep
function enforceTimeStep(dateString: string, timeStep: number) {
  if (!timeStep || timeStep === 1) {
    return dateString
  }

  const date = parseISO(dateString)
  const minutes = getMinutes(date)
  const leftOver = minutes % timeStep
  if (leftOver !== 0) {
    return serialize(setMinutes(date, minutes - leftOver))
  }

  return serialize(date)
}

export const DateTimeInput = React.forwardRef(function DateTimeInput(
  props: Props,
  forwardedRef: React.ForwardedRef<HTMLInputElement>
) {
  const {timeZone, type, onChange, ...rest} = props
  const {title, description, placeholder} = type

  const {dateFormat, timeFormat, timeStep} = parseOptions(type.options)

  const handleChange = useCallback(
    (nextDate: string | null) => {
      let date = nextDate
      if (date !== null && timeStep > 1) {
        date = enforceTimeStep(date, timeStep)
      }

      onChange(date)
    },
    [onChange, timeStep]
  )

  const formatInputValue = React.useCallback(
    (date: Date) => formatInTimeZone(date, timeZone.name, `${dateFormat} ${timeFormat}`),
    [dateFormat, timeFormat, timeZone.name]
  )

  const parseInputValue = React.useCallback(
    (inputValue: string) => {
      const parsed = parse(inputValue, `${dateFormat} ${timeFormat}`, new Date())
      if (isValid(parsed)) {
        return {
          isValid: true,
          date: parsed,
        } as ParseResult
      }
      return {
        isValid: false,
        error: `Invalid date. Must be on the format "${dateFormat} ${timeFormat}"`,
      } as ParseResult
    },
    [dateFormat, timeFormat]
  )

  return (
    <CommonDateTimeInput
      {...rest}
      onChange={handleChange}
      ref={forwardedRef}
      selectTime
      timeStep={timeStep}
      title={title}
      description={description}
      placeholder={placeholder}
      serialize={serialize}
      deserialize={deserialize}
      formatInputValue={formatInputValue}
      parseInputValue={parseInputValue}
    />
  )
})
