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
- Review UI enhancement in [src/components/PlagiarismChecker.tsx](src/components/PlagiarismChecker.tsx):
  - Integrated enriched scoring metadata
  - Added Turnitin range card
  - Added scoring confidence panel

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
