import type {SanityClient} from '@sanity/client'
import sanityClient from 'part:@sanity/base/client'
import {SANITY_API_VERSION} from '../constants'

// Returns as a function so the currently selected Space dataset + projectId are used
export function getSanityClient() {
  return typeof sanityClient.withConfig === 'function'
    ? (sanityClient.withConfig({apiVersion: SANITY_API_VERSION}) as SanityClient)
    : (sanityClient as SanityClient)
}
