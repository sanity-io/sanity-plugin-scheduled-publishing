import {useToast} from '@sanity/ui'

type OperationReturn = 'invalid-id' | 'success' | 'error'

/**
 * Mock function for centralizing schedule operations & their side effects under a single umbrella.
 */
export default function useScheduleOperation() {
  const {push} = useToast()

  async function deleteSchedule(docId: string, pushToast = true): OperationReturn {
    // 1. Validate docId
    if (typeof docId !== 'string' || !docId) {
      return 'invalid-id'
    }

    // 2. Delete schedule from Penguim
    const res = await (await fetch(`https://...`)).json()

    // 3. Worked -> push success toast
    if (res.ok) {
      if (pushToast) {
        push({
          title: 'Schedule deleted',
          // @Idea: potentially add the document preview title to the toast's description
          description: `Document id: ${docId}`,
          status: 'info',
        })
      }
      return 'success'
    }

    // 4. Didn't work
    if (pushToast) {
      push({
        title: 'Error',
        status: 'error',
      })
    }
    return 'error'
  }

  async function bulkDelete(ids: string[]) {
    // @TODO: some logic for getting schedules that didn't work
    await Promise.allSettled(ids.map((id) => deleteSchedule(id, false)))
    push({
      title: `Deleted ${ids.length} schedules`,
    })
  }

  async function createSchedule(docId: string, pushToast = true): OperationReturn {
    // Same idea as deleteSchedule
    return 'error'
  }

  async function editSchedule(docId: string, pushToast = true): OperationReturn {
    // Same idea as deleteSchedule
    return 'error'
  }

  return {
    deleteSchedule,
    createSchedule,
    editSchedule,
    bulkDelete,
  }
}
