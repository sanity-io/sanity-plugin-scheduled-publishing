import sanityClient from '@sanity/client'
import configuredClient from 'part:@sanity/base/client'
import {SANITY_API_VERSION} from '../constants'

// Returns as a function so the currently selected Space dataset + projectId are used
export function getSanityClient() {
  return sanityClient({...configuredClient.config(), apiVersion: SANITY_API_VERSION})
}
