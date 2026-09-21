---
title: Contributing to FreeMoCap
type: how-to
provenance: human-checked
inFlux: "Contributing section for FreeMoCap core is a work in progress for version alpha. It's expected to stabilize by beta."
history:
  - date: "2026-08-26"
    against: "polyrepo-clones/freemocap (v2.0.0-alpha.21): .github/ISSUE_TEMPLATE/bug_report.md and feature_request.md filenames vs template= query params, CONTRIBUTING.md (GitHub Flow steps), test.yml workflow (pytest + ruff via GitHub Actions), freemocap-docs/ Docusaurus setup replacing the v1 Writerside claims, docs site link targets (/guides/report-a-bug, /guides/request-a-feature, /build/code-style), and Discord invite URL"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---
Welcome to the FreeMoCap contributing guide.

This guide covers reporting bugs, suggesting features, and submitting code changes.

## Reporting bugs

Feedback helps improve FreeMoCap directly. To report a bug, [file a new bug report](https://github.com/freemocap/freemocap/issues/new?template=bug_report.md) describing what happened, what was expected instead, and how to reproduce the issue.

For details, see the [bug report](/guides/report-a-bug) guide.

## Suggesting features

New feature ideas and improvement suggestions are welcome. To suggest a feature, [open a new feature request](https://github.com/freemocap/freemocap/issues/new?template=feature_request.md) describing the feature, its benefits, and any potential challenges in implementing it.

For details, see the [feature request](/guides/request-a-feature) guide.

## Code contributions

Contributing code to FreeMoCap means creating and submitting pull requests. This section covers the development process, coding styles, and testing requirements.

### Development process

FreeMoCap follows [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow): fork the repo, branch from `main`, and open a pull request when the change is ready for review.

### Pull requests

Pull requests are the way to propose changes to the codebase. Steps:

1. Fork the repo and create a branch from `main`.
2. Add tests for any new code that needs them.
3. Update the documentation for any changed APIs.
4. Make sure the test suite passes.
5. Make sure the code lints.
6. Open the pull request.

### Coding styles

Consistent coding styles keep the codebase clean and easy to understand. Style guides:

- [Python code style guide](/build/code-style)
- PyQT: [COMING SOON]
- API: [COMING SOON]

### Testing

Every code contribution needs tests to keep the project stable and reliable. A pull request needs test coverage and needs to pass the GitHub Actions workflow before merging.

Here's a nice introduction to [testing in Python](https://realpython.com/python-testing/).

## Contributing to documentation

The repository's own documentation lives in the `freemocap-docs/` directory of the [FreeMoCap repo](https://github.com/freemocap/freemocap) and is written with [Docusaurus](https://docusaurus.io/). It can be edited with any markdown editor, and follows the same GitHub Flow process as code contributions: open a pull request against the FreeMoCap repo.

## Getting help and asking questions

Questions and issues are welcome on the [Discord server](https://discord.gg/freemocap), or as a new issue on GitHub.
