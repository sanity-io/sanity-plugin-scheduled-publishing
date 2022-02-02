export interface DocumentSchedule {
  author: string
  createdAt: string
  dataset: string
  // description: string // TODO: deprecate
  documents: {
    documentId: string
    ifRevisionId: string
  }[]
  executeAt: string
  id: string
  // name: string  // TODO: deprecate
  projectId: string
  state: 'succeeded'
}

export interface ScheduleFormData {
  date: string
  time: string
}
