import sanityClient from '@sanity/client'
import configuredClient from 'part:@sanity/base/client'

const client = sanityClient({...configuredClient.config(), apiVersion: '2022-02-02'})

export default client

const {dataset, projectId} = client.config()

export {dataset, projectId}
