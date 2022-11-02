import {CalendarIcon} from '@sanity/icons'
import {definePlugin} from 'sanity'
import {route} from 'sanity/router'
import resolveDocumentActions from './documentActions'
import resolveDocumentBadges from './documentBadges'
import Tool from './tool/Tool'
import {DocumentBannerInput} from './inputResolver'

export {ScheduleAction} from './documentActions/schedule'
export {ScheduledBadge} from './documentBadges/scheduled'
export {resolveDocumentActions, resolveDocumentBadges}

export const scheduledPublishing = definePlugin({
  name: 'scheduled-publishing',

  document: {
    actions: (prev) => resolveDocumentActions(prev),
    badges: (prev) => resolveDocumentBadges(prev),
  },

  form: {
    components: {
      input: DocumentBannerInput,
    },
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
