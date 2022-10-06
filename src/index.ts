import {CalendarIcon} from '@sanity/icons'
import {createPlugin} from 'sanity'
import {route} from 'sanity/router'
import resolveDocumentActions from './documentActions'
import resolveDocumentBadges from './documentBadges'
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

  /*
  form: {
    components: {
      input: DocumentBannerInput,
    },
  },
*/

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
