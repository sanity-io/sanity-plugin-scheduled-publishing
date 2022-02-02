import {useEffect, useRef, useState} from 'react'
import {useSWRConfig} from 'swr'
import {DocumentSchedule} from '../types'
import generateSwrQueryKey from '../utils/generateSwrQueryKey'

// TODO: convert to rxjs long polling
// TODO: double check useEffect array deps
// TODO: rename
// TODO: prevent unnecessary re-renders

const INTERVAL = 5000

export default function ({documentId}: {documentId: string}): DocumentSchedule[] {
  const {cache} = useSWRConfig()
  const queryKey = generateSwrQueryKey({documentId})

  const refInterval = useRef<ReturnType<typeof setInterval>>()
  const [value, setValue] = useState(cache.get(queryKey))

  useEffect(() => {
    refInterval.current = setInterval(() => {
      const cachedResult = cache.get(queryKey)
      setValue(cachedResult)
    }, INTERVAL)

    // Clean up timeout
    return () => {
      if (refInterval.current) {
        clearInterval(refInterval.current)
      }
    }
  }, [documentId])

  return value
}
