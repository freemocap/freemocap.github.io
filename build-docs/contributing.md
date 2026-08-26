---
title: Contributing to FreeMoCap
type: how-to
provenance: human-checked
inFlux: "This contributing guide is a stand-in for the core freemocap repo's own developer docs, still being consolidated there; expect it to move once that lands."
history:
  - date: "2026-08-26"
    against: "polyrepo-clones/freemocap (v2.0.0-alpha.21): .github/ISSUE_TEMPLATE/bug_report.md and feature_request.md filenames vs template= query params, CONTRIBUTING.md (GitHub Flow steps), test.yml workflow (pytest + ruff via GitHub Actions), freemocap-docs/ Docusaurus setup replacing the v1 Writerside claims, docs site link targets (/guides/report-a-bug, /guides/request-a-feature, /build/code-style), and Discord invite URL"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---
Welcome to the FreeMoCap contributing guide! 

This document will help you understand how to contribute to the project, whether you're reporting bugs, suggesting new features, or submitting code changes. We're excited to have you on board and look forward to working with you!

## Reporting Bugs 

Your feedback is invaluable in improving FreeMoCap. In this section, you'll learn how to report bugs and suggest new features for the project. To report a bug, [file a new bug report](https://github.com/freemocap/freemocap/issues/new?template=bug_report.md) and let us know what happened, what you expected to happen, and how to reproduce the issue.

For details, see our [Bug Report](/guides/report-a-bug) guide

## Suggesting Features

We welcome your ideas for new features or improvements to FreeMoCap. To suggest a feature, [open a new feature request](https://github.com/freemocap/freemocap/issues/new?template=feature_request.md) and describe the feature, its benefits, and any potential challenges in implementing it.

For details, see our [Feature Request](/guides/request-a-feature)  guide

## Code Contributions

Contributing code to FreeMoCap involves creating and submitting pull requests. In this section, you'll learn about our development process, coding styles, and testing requirements.

### We Use GitHub Flow

We use [Github Flow](https://docs.github.com/en/get-started/quickstart/github-flow) as our development process. It makes it easy for contributors to submit changes and maintainers to review and merge them.

  
###  Code Changes Happen Through Pull Requests  
Pull requests are the best way to propose changes to the codebase (we use [Github Flow](https://docs.github.com/en/get-started/quickstart/github-flow)). 

We actively welcome your pull requests:  
1. Fork the repo and create your branch from `main`.  
2. If you've added code that should be tested, add tests.  
3. If you've changed APIs, update the documentation.  
4. Ensure the test suite passes.  
5. Make sure your code lints.  
6. Issue that pull request!

### Coding Styles

Consistent coding styles are important for maintaining a clean and easy-to-understand codebase. We use the following style guides for our project:

- [Python Code Style Guide](/build/code-style)
- PyQT: [COMING SOON]
- API: [COMING SOON]

### Testing

We require tests for all code contributions to ensure the stability and reliability of the project. When submitting a pull request, make sure your code is covered by tests, and that those tests pass our Github Actions workflow.

Here's a nice introduction to [testing in Python](https://realpython.com/python-testing/).

### Pull Requests

Pull requests are the best way to propose changes to the codebase (we use [Github Flow](https://docs.github.com/en/get-started/quickstart/github-flow)). We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Contributing to Documentation

The repository's own documentation lives in the `freemocap-docs/` directory of the [freemocap repo](https://github.com/freemocap/freemocap) and is written with [Docusaurus](https://docusaurus.io/). It can be edited with any markdown editor. We use the same Github Flow methodology for our documentation as we do for our code contributions. You can make changes to the documentation through pull requests against the freemocap repo.

## Getting Help  and Asking Questions

If you encounter issues or have questions - ask for help on our [Discord server](https://discord.gg/freemocap) or by creating a new issue on Github. We'll do our best to assist you and provide the information you need.
