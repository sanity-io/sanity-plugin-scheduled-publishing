# Scheduled Publishing

Schedule your content for future publishing and organise your upcoming releases – no custom tasks or serverless functions required!

![Scheduled Publishing tool view](https://user-images.githubusercontent.com/209129/159030874-24a9e1fc-3894-4161-a1b5-d90e2558cb0d.png)

`TODO: update screenshot`

> This plugin uses Sanity's [Scheduled Publishing API][scheduled-publishing-api] which is currently an enterprise feature. Please visit our [Scheduled Publishing][scheduled-publishing] feature page for more information.

## Features

### Create and edit schedules directly from the document editor

- Use our pre-built document action to create or edit existing schedules
- See if the current document you're working on is scheduled
- View and create schedules in any remote time zone
- Display warnings if you've scheduled a document containing validation issues

### View all your schedules with a dedicated tool

- Filter by schedule status or use our calendar to view schedules on any specific day
- View schedule dates in any remote time zone
- Edit, delete and immediately publish schedules
- Automatically validate and show warnings for upcoming schedules
- See which Sanity user created a schedule

## Getting started

```sh
sanity install @sanity/scheduled-publishing
```

This will do the following:

- Add a _Schedule_ document action to all document types
- Display a _Scheduled_ document badge to all document types
- Add the dedicated _Schedules_ tool in your navigation bar

For more fine grained control over limiting scheduling or working with existing [custom document actions][document-actions] and [badges][document-badges], please see [Custom setup](#custom-setup).

### Custom setup

**Only show the Schedule button on certain document types**

**Compose the Schedule button with other custom document actions**

`TODO:`

## FAQ

<details>
<summary>How are schedule permissions handled?</summary>

- If you have `publish` access to a document, you'll be able to create, edit or delete any schedule linked to it.
- All schedules are viewable by all project users.

</details>

## Limitations

`TODO:`

## License

This repository is published under the [MIT](LICENSE) license.

[document-actions]: https://www.sanity.io/docs/document-actions
[document-badges]: https://www.sanity.io/docs/custom-document-badges
[scheduled-publishing]: https://sanity.io
[scheduled-publishing-api]: https://sanity.io
