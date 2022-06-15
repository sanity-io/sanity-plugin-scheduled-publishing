import {CalendarIcon} from '@sanity/icons'
import Tool from './tool/Tool'
import {createPlugin} from 'sanity'
import resolveDocumentActions from './documentActions'
import resolveDocumentBadges from './documentBadges'
import {route} from 'sanity/_unstable'
import {resolveInput} from './inputResolver'

export {ScheduleAction} from './documentActions/schedule'
export {ScheduledBadge} from './documentBadges/scheduled'
export {resolveDocumentActions, resolveDocumentBadges}

export const scheduledPublishing = createPlugin({
  name: 'scheduled-publishing',

  document: {
    actions: (prev) => resolveDocumentActions(prev),
    badges: (prev) => resolveDocumentBadges(prev),
  },

  form: {
    renderInput: resolveInput,
  },

  tools: (prev) => {
    return [
      ...prev,
      {
        name: 'schedules',
        title: 'Schedules',
        icon: CalendarIcon,
        component: Tool,
        router: route.create('/:state'),
      },
    ]
  },
})
