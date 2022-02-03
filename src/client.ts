import sanityClient from '@sanity/client'
import configuredClient from 'part:@sanity/base/client'
import {SANITY_API_VERSION} from './constants'

const client = sanityClient({...configuredClient.config(), apiVersion: SANITY_API_VERSION})

export default client

const {dataset, projectId} = client.config()

export {dataset, projectId}
