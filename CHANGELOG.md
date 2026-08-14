# Red Bull Master Tracker - Changelog

## [v4.5.1] - 2026-08-13
### Added
- **Automated Cloud Security Deployment**: Deployed production-grade Realtime Database validation rules directly across Firebase projects (`redbull-tracker-d99fc`, `lbbb-webcounter`, `livecounters-8eaa8`, and `wos-dashboard-38d4c`).
- **Project Configuration**: Added local `firebase.json` and `database.rules.json` to version control.

## [v4.5.0] - 2026-08-13
### Added
- **Direct Firebase Lifetime Telemetry**: Reconnected Total Site Visits directly to Firebase RTDB node `Counters/RedBull/totalViewCount` with atomic `runTransaction` increments and live updates.
- **Resilient Offline Architecture**: Embedded the complete 39-item master flavor catalog with `localStorage` persistence, ensuring the app never shows `0 / 0` or blank lists during Google Apps Script quota limits or downtime.
- **Interactive Checklists**: Real-time progress percentage, flavors had, and remaining count recalculations on card click.
- **Enhanced Filtering**: Added "⭐ Had" and "⏳ Remaining" quick filters alongside Active, Discontinued, Sugar Free, and 🌎 International filters.
- **Security Hardening**: Documented and prepared Firebase security rules scoped to `/Counters/RedBull`.

## [v4.4.2] - 2026-06-11
### Changed
- Synchronized versioning across UI elements and centralized configuration.

## [v4.3.0] - 2026-06-11
### Added
- Migrated Realtime Database engine to dedicated project (`redbull-tracker-d99fc`).

## [v4.0.0] - 2026-06-11
### Initial
- Core release of Red Bull completionist portal.
