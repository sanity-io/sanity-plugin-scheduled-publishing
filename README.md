# Scheduled Publishing plugin for Sanity.io

> This is a **Sanity Studio v2** plugin.
> For the v3 version, please refer to the [v3-branch](https://github.com/sanity-io/sanity-plugin-scheduled-publishing).

Schedule your content for future publication and organise upcoming releases – no custom tasks or serverless functions required!

> This plugin uses Sanity's [Scheduling API][scheduling-api] which is available to customers on [Growth or higher plans][pricing].

![Scheduled Publishing tool view](https://user-images.githubusercontent.com/209129/159557062-6d3ea6d7-941e-472a-a7d4-7e229bf81780.png)

![Scheduled Publishing document view](https://user-images.githubusercontent.com/209129/159463180-703d557a-cfe6-4ff0-970f-b33eea048e87.png)

## Features

### Create and edit schedules directly from the document editor

- Create and edit schedules for the document you're working on
- See current schedule status and potential validation issues

### View all your schedules with our dedicated tool

- Filter all schedules by status or use the calendar to browse by date
- Edit, delete, and immediately publish schedules
- Automatically validate upcoming schedules, and identify issues before they're published
- Easily identify who created a schedule

### View schedule dates in any remote time zone

<img src="https://user-images.githubusercontent.com/209129/159458620-ce6b8112-c19a-4c24-a2d5-f79798d1e6f7.png" width="600" />

- Change the time zone you want to preview schedules in by clicking the 🌎 **Time Zone** button when visible. Great when you need to co-ordinate with a global team or want to time publication to specific regions.
- Easily select time zones by city, time zone abbreviation or name search.
- Selected time zones are automatically stored in your local storage for future use.

## Getting started

In your Sanity studio folder:

```sh
yarn add @sanity/scheduled-publishing@studio-v2
```

Next, add `"@sanity/scheduled-publishing"` to `sanity.json` plugins array:

```json
"plugins": [
  "@sanity/scheduled-publishing"
]
```

This will automatically:

- Add a Schedule [document action][document-actions] to _all document types_
- Display a Scheduled [document badge][document-badges] to _all document types_
- Add the dedicated Schedules _tool_ in your navigation bar

Please see [Custom setup](#custom-setup) for more fine grained control on limiting schedule buttons to specific document types and working with existing custom document actions or badges.

### Custom setup

This plugin also exports both the **Schedule document action** and **Scheduled badge** which you can import and compose as you see fit.

#### Manually adding the Schedule document action

This example assumes [you've customised your own document actions][document-actions] and would like to only show the Schedule button on `movie` documents only.

The Schedule document action allows users to both create and edit existing schedules directly from the form editor.

```js
import {ScheduleAction} from '@sanity/scheduled-publishing'
import defaultResolve from 'part:@sanity/base/document-actions'

/*
 * Please note that this will only alter the visibility of the button in the studio.
 * Users with document publish permissions will be able to create schedules directly
 * via the Scheduled Publishing API.
 */

export default function resolveDocumentActions(props) {
  // Default document actions
  const defaultActions = defaultResolve(props)

  // Show the schedule button on `movie` documents only
  if (props.type === 'movie') {
    // Add our schedule action AFTER the first action (publish, by default)
    // to ensure it sits at the top of our document context menu.
    return [...defaultActions.slice(0, 1), ScheduleAction, ...defaultActions.slice(1)]
  }

  // Finally, return default actions for all other document types
  return defaultActions
}
```

#### Manually adding the Scheduled document badge

This example assumes [you've customised your own document badges][document-badges] and would like to only show the Scheduled badge on `movie` documents only.

The Scheduled document badge displays whether the current document is scheduled and when it will be published if so.

```js
import {ScheduledBadge} from '@sanity/scheduled-publishing'
import defaultResolve from 'part:@sanity/base/document-badges'

export default function resolveDocumentBadges(props) {
  // Default document badges
  const defaultBadges = defaultResolve(props)

  // Show the scheduled badge on `movie` documents only
  if (props.type === 'movie') {
    // Add our scheduled badge after any defaults
    return [...defaultBadges, ScheduledBadge]
  }

  // Return default badges for all other document types
  return defaultBadges
}
```

## FAQ

<details>
<summary>What's the relationship between Schedules and my dataset?</summary>

Schedules sit adjacent to your dataset and can be managed using the [Scheduling API][scheduling-api] (which this plugin does for you).

Schedules are a unique resource and are linked to, but do not exist within your Sanity project and dataset. It's important to understand the following behavior:

- As schedules are not contained within a project’s dataset, you cannot query them via GROQ or GraphQL.
- Deleting a dataset will immediately delete all schedules.
- Deleting a project will immediately delete all schedules.
- `sanity dataset export` will not include schedules and `sanity dataset import` does not support importing schedules.
- Server-side copying of datasets does not include schedules.
- When a project is disabled or blocked, all scheduled publishes will invariably fail as mutations will not be allowed on the dataset.

More information can be found on the [Scheduling API][scheduling-api] page.

</details>

<details>
<summary>Where is time zone data pulled from?</summary>

- Time zones and their corresponding cities, regions and daylight savings offsets are directly sourced from the [@vvo/dztb][@vvo/dztb] library, which is automatically updated with data from [geonames.org](https://www.geonames.org/).
- Latest time zone + region data from [@vvo/dztb][@vvo/dztb] is pulled in when first installing this plugin.
- In the event you need to bring in upstream time zone and region data, run:

  ```sh
  # Yarn
  yarn upgrade @sanity/scheduled-publishing

  # NPM
  npm update @vvo/tzdb --legacy-peer-deps
  ```

</details>

<details>
<summary>Will scheduled documents with validation errors publish?</summary>

- **Yes.** Documents scheduled to publish in future will do so, even if they contain validation errors. This also applies to scheduled documents that you manually opt to publish immediately via the tool.

</details>

## License

This repository is published under the [MIT](LICENSE) license.

## Developing this plugin

### Release new version

Run ["CI & Release" workflow](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/actions).
Make sure to select main or v3 branch and check "Release new version".

Semantic release will only release on configured branches, so it is safe to run release on any branch.

[document-actions]: https://www.sanity.io/docs/document-actions
[document-badges]: https://www.sanity.io/docs/custom-document-badges
[scheduling-api]: https://www.sanity.io/docs/scheduling-api
[@vvo/dztb]: https://github.com/vvo/tzdb
[pricing]: https://sanity.io/pricing
