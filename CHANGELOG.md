# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.9](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/compare/v0.1.8...v0.1.9) (2022-05-11)


### Bug Fixes

* convert calendar day dates to UTC prior to validation, update misleading comments ([ad5300a](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/commit/ad5300a013b3c8ac1e9a5843e599efeb1acd1869))

### [0.1.8](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/compare/v0.1.7...v0.1.8) (2022-05-10)


### Bug Fixes

* correctly convert UTC to current zone / wall time in custom validation ([46e2402](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/commit/46e2402dd5952d161e78a5a97c2e56dd529551ad))

### [0.1.7](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/compare/v0.1.6...v0.1.7) (2022-05-10)


### Bug Fixes

* ensure custom validation correctly triggers on both field input and date picker changes ([e6991b4](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/commit/e6991b4945a31bf5e9801dee1f87ecabe6a5bec1))

### [0.1.6](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/compare/v0.1.5...v0.1.6) (2022-05-06)


### Bug Fixes

* ensure current dataset and project IDs are retrieved on every request ([36bd830](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/commit/36bd83086d891fcd401e677dcdee7c16c62f5261))
* memoized document type ([56afc1e](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/commit/56afc1e5feb1ebc119ce3811023972a87f295713))

### [0.1.5](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/compare/v0.1.4...v0.1.5) (2022-04-29)


### Bug Fixes

* check for scheduled publishing feature flag in both tool + document actions [sc-19032] ([1cbc209](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/commit/1cbc209c6366f909fff3b5e0caacbc9718ae755f))

### [0.1.4](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/compare/v0.1.3...v0.1.4) (2022-04-29)


### Bug Fixes

* correctly display reason for cancelled schedules, only validate upcoming schedules [sc-19033] ([ae14626](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/commit/ae14626c0f4b90735eb5c5cc262e2f4990e4cfc7))

### [0.1.3](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/compare/v0.1.2...v0.1.3) (2022-04-28)


### Bug Fixes

* correctly handle schedules with null `executeAt` values [sc-19031] ([f6b3bdd](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/commit/f6b3bdd9bc49e6f74a94c32687b387ae8c762d67))

### [0.1.2](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/compare/v0.1.1...v0.1.2) (2022-03-23)


### Bug Fixes

* immediately update SWR cache upon schedule publish and revalidate ([fd9cf2a](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/commit/fd9cf2a1f9a51d4d5483230f7e78cb11881f70f2))
* remove redundant schedule patch / update prior to deletion ([a7c8c76](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/commit/a7c8c765ed5a004d3bcbd66a0a06e750180d99a3))
* use studio client to handle authorized requests, remove axios ([a2f6be2](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/commit/a2f6be23d0a6b6ee52e616d0534506f487d3603f))

### [0.1.1](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/compare/v0.1.0...v0.1.1) (2022-03-22)


### Bug Fixes

* ensure document badges and inline schedule banner correctly display dates in local user time ([6e8c388](https://github.com/sanity-io/sanity-plugin-scheduled-publishing/commit/6e8c3882fb177567437b47f7569eaa2732a93644))
