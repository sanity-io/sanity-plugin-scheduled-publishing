// https://github.com/sanity-io/sanity/blob/next/packages/@sanity/base/src/datastores/user/hooks.ts

import userStore from 'part:@sanity/base/user'
import {useMemo} from 'react'
import {User} from '@sanity/types'
import {LoadableState, useLoadable} from '../utils/useLoadable'

export default function (userId: string): LoadableState<User | undefined> {
  return useLoadable(useMemo(() => userStore.observable.getUser(userId), [userId]))
}
