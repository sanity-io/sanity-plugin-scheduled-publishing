This folder contains a customised version Sanity Studio's [DateInput](https://github.com/sanity-io/sanity/tree/next/packages/%40sanity/form-builder/src/inputs/DateInputs) and accompanying calendar components.

Some changes have been made to make both `<DateInput>` and its calendar component _time zone aware_:

## DateInput

- This continues to handle all dates in UTC, though it formats + parses values using the current time zone
- Date and time handling uses `date-fns` formatting (rather than moment - which the studio is moving away from anyway!)

## DateInput calendar

- Ingested dates (e.g. `focusedDate` and `selectedDate` are now in 'wall time' – or time zone formatted dates). This is accomplished with extensive use of `date-fns-tz` helper functions.
- All dates returned in callbacks (e.g. `onSelect` and `onFocusedDateChange`) **always return values in UTC** (for the corresponding `<DateInput>` to ingest).

These changes allows us to easily reason about ensuring correct days / hours etc are highlighted in various calendar UI elements when switching between time zones.
