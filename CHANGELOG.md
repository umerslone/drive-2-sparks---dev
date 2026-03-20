# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Added
- Fast-track Review Section feature specification in [PRD.md](PRD.md).
- Day-based implementation plan for summary, plagiarism checks, AI detection, and scoring.
- Turnitin-style matching logic guidance:
  - Exclude bibliography
  - Exclude quotes
  - Ignore short matches
  - Count unique matched words once
- Review computation engine in [src/lib/review-engine.ts](src/lib/review-engine.ts):
  - Integrity score calculation (weighted plagiarism/AI/citation risk)
  - Likely Turnitin range estimate
  - Scoring confidence label and reasons
  - Filter-aware scoring controls:
    - Exclude quoted matches
    - Exclude references/bibliography-style matches
    - Minimum match-word threshold
  - Automatic section summary extraction for thesis/article-like documents
- Review UI enhancement in [src/components/PlagiarismChecker.tsx](src/components/PlagiarismChecker.tsx):
  - Integrated enriched scoring metadata
  - Added Turnitin range card
  - Added scoring confidence panel
  - Added scoring filter controls in UI
  - Added section summary cards in Summary tab
  - Export now carries filter-aware metadata

### Improved
- PDF review export in [src/lib/pdf-export.ts](src/lib/pdf-export.ts):
  - Adds Turnitin likely range and confidence context
  - Adds scoring context section with active filter details
  - Adds section-level summaries in report output

### Changed
- Admin dashboard stats synchronization logic to compute card totals from the same loaded datasets used by tables.
- Error logger module restored and stabilized after syntax corruption.
- Error fallback component restored after JSX corruption.

### Planned
- Review Engine v1 for thesis/article documents:
  - Structured summary generation
  - Plagiarism analysis with source evidence
  - AI-writing risk analysis with explainable scoring
  - Exportable review report for academic review workflows
