import sanityClient from '@sanity/client'
import configuredClient from 'part:@sanity/base/client'
import {SANITY_API_VERSION} from '../constants'

export default sanityClient({...configuredClient.config(), apiVersion: SANITY_API_VERSION})
