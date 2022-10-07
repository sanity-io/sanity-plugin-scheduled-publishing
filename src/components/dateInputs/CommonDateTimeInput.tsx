/* eslint-disable no-nested-ternary */
import {FormField} from 'sanity'
import {TextInput, useForwardedRef} from '@sanity/ui'
import React, {useEffect, useId, useMemo} from 'react'
import useTimeZone from '../../hooks/useTimeZone'
import {DateTimeInput} from './base/DateTimeInput'
import {CommonProps, ParseResult} from './types'

type Props = CommonProps & {
  title: string
  description?: string
  parseInputValue: (inputValue: string) => ParseResult
  formatInputValue: (date: Date) => string
  deserialize: (value: string) => ParseResult
  serialize: (date: Date) => string
  onChange: (nextDate: string | null) => void
  selectTime?: boolean
  placeholder?: string
  timeStep?: number
  customValidation?: (selectedDate: Date) => boolean
}

export const CommonDateTimeInput = React.forwardRef(function CommonDateTimeInput(
  props: Props,
  forwardedRef: React.ForwardedRef<HTMLInputElement>
) {
  const {
    value,
    markers,
    title,
    description,
    placeholder,
    parseInputValue,
    formatInputValue,
    deserialize,
    serialize,
    selectTime,
    timeStep,
    readOnly,
    level,
    onChange,
    customValidation,
    ...rest
  } = props

  const [localValue, setLocalValue] = React.useState<string | null>(null)

  useEffect(() => {
    setLocalValue(null)
  }, [value])

  const {zoneDateToUtc} = useTimeZone()
  const undefinedValue = typeof value === 'undefined'
  // Text input changes ('wall time')
  const handleDatePickerInputChange = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const nextInputValue = event.currentTarget.value
      const result = nextInputValue === '' ? null : parseInputValue(nextInputValue)

      if (result === null) {
        onChange(null)

        // If the field value is undefined, and we are clearing the invalid value
        // the above useEffect won't trigger, so we do some extra clean up here
        if (undefinedValue && localValue) {
          setLocalValue(null)
        }
      } else if (result.isValid) {
        // Convert zone time to UTC
        onChange(serialize(zoneDateToUtc(result.date)))
      } else {
        setLocalValue(nextInputValue)
      }
    },
    [undefinedValue, zoneDateToUtc, localValue, serialize, onChange, parseInputValue]
  )

  // Calendar changes (UTC)
  const handleDatePickerChange = React.useCallback(
    (nextDate: Date | null) => {
      onChange(nextDate ? serialize(nextDate) : null)
    },
    [serialize, onChange]
  )

  const inputRef = useForwardedRef(forwardedRef)

  const id = useId()

  const parseResult = localValue ? parseInputValue(localValue) : value ? deserialize(value) : null

  const inputValue = localValue
    ? localValue
    : parseResult?.isValid
    ? formatInputValue(parseResult.date)
    : value

  const nodeValidations = useMemo(
    () =>
      markers.map((m) => ({
        level: m.level,
        path: m.path,
        message: m.item.message,
      })),
    [markers]
  )
  return (
    <FormField
      validation={
        parseResult?.error
          ? [
              ...nodeValidations,
              {
                level: 'error',
                message: parseResult.error,
                path: [],
              }, // casting to marker to avoid having to implement cloneWithMessage on item
            ]
          : nodeValidations
      }
      title={title}
      level={level}
      description={description}
      inputId={id}
    >
      {readOnly ? (
        <TextInput value={inputValue} readOnly />
      ) : (
        <DateTimeInput
          {...rest}
          id={id}
          selectTime={selectTime}
          timeStep={timeStep}
          placeholder={placeholder || `e.g. ${formatInputValue(new Date())}`}
          ref={inputRef}
          value={parseResult?.date}
          inputValue={inputValue || ''}
          readOnly={Boolean(readOnly)}
          onInputChange={handleDatePickerInputChange}
          onChange={handleDatePickerChange}
          customValidity={parseResult?.error}
          customValidation={customValidation}
        />
      )}
    </FormField>
  )
})
