This folder contains a customised version of the Sanity Studio's [DateInput calendar](https://github.com/sanity-io/sanity/tree/next/packages/%40sanity/form-builder/src/inputs/DateInputs/base/calendar) component (for use in this plugin's tool) with the following changes:

- all invocations of `new Date()` return the current user's date in their time zone (using `utcToZonedTime` from `date-fns-tz`)
- a simplified header with next / previous month selection only
- simplified day headers ('Mon' -> 'M')
- larger calendar day buttons
- no time (HH:MM) dropdowns
