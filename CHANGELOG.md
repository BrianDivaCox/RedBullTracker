# Red Bull Master Tracker - Changelog

## [v4.8.2] - 2026-08-13
### Added
- **Live Auto-Sync & Tab-Focus Refresh**: Integrated 30-second live background polling and tab-focus auto-sync so any new flavors, checkboxes, or notes added to Google Sheets update on screen in real time.
- **Interactive Sync Status Indicator**: Added a clickable sync status badge with rotational animation in the bottom status bar for manual instant refresh.

## [v4.8.1] - 2026-08-13
### Added
- **Repository Security Hardening**: Added comprehensive `.gitignore` guardrails to prevent accidental credential, environment variable, or token commits.

## [v4.8.0] - 2026-08-13
### Added
- **Live Filter Badge Counts**: Added real-time dynamic count badges to every filter button (All, Active, Seasonal, Discontinued, Sugar Free, International, Had, Remaining) that update with checkbox changes, filter selections, and discontinued toggle states.

## [v4.7.0] - 2026-08-13
### Added
- **Bottom Telemetry Status Bar**: Moved site traffic metrics (Lifetime Site Visits & Online Live Now) to a bottom status bar with live indicator badges.
- **Streamlined 3-Column Header**: Expanded primary tracker cards into a 3-column metric layout (Progress, Had, Remaining).

## [v4.6.0] - 2026-08-13
### Added
- **Hide Discontinued Toggle**: Added an interactive toggle switch in the controls bar that filters out vaulted flavors and dynamically recalculates the progress percentage, had count, and remaining count for active in-store flavors.
- **Dedicated Seasonal Filter**: Added a seasonal filter chip to easily isolate limited and seasonal editions (Summer, Winter, Spring, Ice).
- **Preference Persistence**: Saved the toggle state in local storage so your preferred view is maintained across sessions.

## [v4.5.3] - 2026-08-13
### Added
- **Live Google Sheet Synchronization**: Connected live spreadsheet synchronization engine to seamlessly pull live flavor checklists, status flags, and international editions.

## [v4.5.2] - 2026-08-13
### Added
- **Dedicated Backend Integration**: Configured direct spreadsheet data service with error handling.

## [v4.5.1] - 2026-08-13
### Added
- **Database Security Hardening**: Deployed real-time validation policies to prevent unauthorized data modification.

## [v4.5.0] - 2026-08-13
### Added
- **Direct Realtime Telemetry**: Connected view counters and concurrent online presence listeners.
- **Offline Resilience**: Added local caching layer so the flavor catalog remains accessible during network interruptions.
- **Interactive Checklists**: Real-time progress percentage recalculations on card interaction.
- **Advanced Filtering**: Added quick filter options for category management.
