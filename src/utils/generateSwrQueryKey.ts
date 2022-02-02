import {sanityClient} from '../lib/client'

const {dataset, projectId} = sanityClient.config()

export default function ({documentId}: {documentId: string}): string {
  return JSON.stringify({
    query: {
      documentIds: documentId,
      state: 'scheduled',
    },
    uri: `/schedules/${projectId}/${dataset}`,
  })
}
