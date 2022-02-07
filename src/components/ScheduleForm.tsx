import {Button, Card, Flex, Inline, Stack, Text} from '@sanity/ui'
import React from 'react'
import {ScheduleFormData} from '../types'
import {DateTimeInput} from './DateInputs'

interface Props {
  formData?: ScheduleFormData
  onChange?: (formData: ScheduleFormData) => void
}

const getCurrentTimeOffset = (minuteOffset: number) => {
  const currentDate = new Date()
  return new Date(currentDate.getTime() + minuteOffset * 60000).toISOString()
}

const ScheduleForm = (props: Props) => {
  const {formData, onChange} = props

  const handleChange = (date: string | null) => {
    if (date && onChange) {
      onChange({date})
    }
  }

  return (
    <Flex as="form">
      <Stack space={4}>
        <DateTimeInput
          level={0}
          markers={[]}
          onChange={handleChange}
          type={{
            name: 'date',
            title: 'Date',
          }}
          value={formData?.date}
        />

        {/* Debug buttons */}
        <Card padding={4} radius={2} shadow={1} tone="default">
          <Stack space={3}>
            <Text size={1} weight="semibold">
              Debug: set schedule time from now
            </Text>
            <Inline space={2}>
              <Button
                onClick={handleChange.bind(undefined, getCurrentTimeOffset(-0.25))}
                text="-15s"
                tone="critical"
              />
              <Button
                onClick={handleChange.bind(undefined, getCurrentTimeOffset(0.25))}
                text="+15s"
              />
              <Button
                onClick={handleChange.bind(undefined, getCurrentTimeOffset(0.5))}
                text="+30s"
              />
              <Button onClick={handleChange.bind(undefined, getCurrentTimeOffset(1))} text="+1m" />
              <Button onClick={handleChange.bind(undefined, getCurrentTimeOffset(5))} text="+5m" />
              <Button
                onClick={handleChange.bind(undefined, getCurrentTimeOffset(10))}
                text="+10m"
              />
            </Inline>
          </Stack>
        </Card>
      </Stack>
    </Flex>
  )
}

export default ScheduleForm
