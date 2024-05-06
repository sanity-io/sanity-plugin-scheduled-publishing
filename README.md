> [!IMPORTANT]
> As of [v3.39.0](https://www.sanity.io/changelog/e6013ee5-8214-4e03-9593-f7b19124b8a3) of Sanity Studio, this plugin has been deprecated and the Scheduled Publishing functionality has been moved into the core studio package.
> Read more and learn how to update your configuration in the [Sanity docs](https://www.sanity.io/docs/scheduled-publishing).
>
> Original README preserved [here](./PLUGIN_README.md) 

---


## Migrate

### Remove plugin config

Upgrade Sanity and run the following command in your project root to uninstall the plugin:

```sh
npm install sanity@latest
npm uninstall @sanity/scheduled-publishing
```

Next, remove the plugin from your studio configuration. Typically you'll find this in `./sanity.config.ts|js`. Find and delete the following lines from your configuration:

```diff
// ./sanity.config.ts|js

-import {scheduledPublishing} from '@sanity/scheduled-publishing'

export default defineConfig({
  // ...
  plugins: [
-    scheduledPublishing()
  ],
})
```

Your plugin declaration might be a bit more expansive if you've defined a custom time format for the plugin. Delete it all!

```diff
// ./sanity.config.ts|js

import {scheduledPublishing} from '@sanity/scheduled-publishing'

export default defineConfig({
  // ...
  plugins: [
-    scheduledPublishing({
-      inputDateTimeFormat: 'MM/dd/yyyy h:mm a',
-    }),
  ],
})
```

### Add new configuration for Scheduled Publishing

Note that while very similar to the plugin config this goes into the top-level of your studio configuration. Setting enabled to false will opt you out of using scheduled publishing for the project.

```diff
// ./sanity.config.ts|js

+ import {defineConfig} from 'sanity'

defineConfig({
  // ....
+  scheduledPublishing: {
+    enabled: true,
+    inputDateTimeFormat: 'MM/dd/yyyy h:mm a',
+  }
)
```

As before, you can add a custom time format if you so wish. If left unspecified, the format will default to `dd/MM/yyyy HH:mm`.

### Document actions and badges

They are now exported from `sanity`

```diff
-import {ScheduleAction, ScheduledBadge} from '@sanity/scheduled-publishing'
+ import {ScheduleAction, ScheduledBadge} from 'sanity'


```
