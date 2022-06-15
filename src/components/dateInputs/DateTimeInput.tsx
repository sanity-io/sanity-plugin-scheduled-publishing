import {getMinutes, isValid, parse, parseISO, setMinutes} from 'date-fns'
import {formatInTimeZone} from 'date-fns-tz'
import React, {useCallback} from 'react'
import useTimeZone from '../../hooks/useTimeZone'
import {CommonDateTimeInput} from './CommonDateTimeInput'
import {CommonProps, ParseResult} from './types'
import {isValidDate} from './utils'

type ParsedOptions = {
  calendarTodayLabel: string
  customValidation: (selectedDate: Date) => boolean
  customValidationMessage?: string
  dateFormat: string
  timeFormat: string
  timeStep: number
}
type SchemaOptions = {
  calendarTodayLabel?: string
  customValidation?: (selectedDate: Date) => boolean
  customValidationMessage?: string
  dateFormat?: string
  timeFormat?: string
  timeStep?: number
}
const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd'
const DEFAULT_TIME_FORMAT = 'HH:mm'

export type Props = CommonProps & {
  onChange: (date: string | null) => void
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
    customValidation:
      options.customValidation ||
      function () {
        return true
      },
    customValidationMessage: options.customValidationMessage || 'Invalid date.',
    calendarTodayLabel: options.calendarTodayLabel || 'Today',
    dateFormat: options.dateFormat || DEFAULT_DATE_FORMAT,
    timeFormat: options.timeFormat || DEFAULT_TIME_FORMAT,
    timeStep: ('timeStep' in options && Number(options.timeStep)) || 1,
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
  const {type, onChange, ...rest} = props
  const {title, description, placeholder} = type

  const {getCurrentZoneDate, timeZone} = useTimeZone()

  const {customValidation, customValidationMessage, dateFormat, timeFormat, timeStep} =
    parseOptions(type.options)

  // Returns date in UTC string
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
      const parsed = parse(inputValue, `${dateFormat} ${timeFormat}`, getCurrentZoneDate())

      // Check is value is a valid date
      if (!isValid(parsed)) {
        return {
          isValid: false,
          error: `Invalid date. Must be on the format "${dateFormat} ${timeFormat}"`,
        } as ParseResult
      }

      // Check if value adheres to custom validation rules
      if (!customValidation(parsed)) {
        return {
          isValid: false,
          error: customValidationMessage,
        } as ParseResult
      }

      return {
        isValid: true,
        date: parsed,
      } as ParseResult
    },
    [customValidationMessage, customValidation, dateFormat, getCurrentZoneDate, timeFormat]
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
      customValidation={customValidation}
      parseInputValue={parseInputValue}
    />
  )
})
