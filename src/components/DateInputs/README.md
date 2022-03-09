This folder contains a customised version Sanity Studio's [DateInput](https://github.com/sanity-io/sanity/tree/next/packages/%40sanity/form-builder/src/inputs/DateInputs) and accompanying calendar components with the following changes:

- all invocations of `new Date()` return the current user's date in their time zone (using `utcToZonedTime` from `date-fns-tz`)
