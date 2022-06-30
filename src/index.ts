import {CalendarIcon} from '@sanity/icons'
import {createPlugin} from 'sanity'
import {route} from 'sanity/_unstable'
import resolveDocumentActions from './documentActions'
import resolveDocumentBadges from './documentBadges'
import {resolveInput} from './inputResolver'
import Tool from './tool/Tool'
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
        router: route.create('/', [route.create('/state/:state'), route.create('/date/:date')]),
      },
    ]
  },
})
