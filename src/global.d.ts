// Ambient module declarations for Docusaurus's `@theme/*` and
// `@theme-original/*` aliases, needed by any swizzled theme component
// that imports the original component's type (see
// src/theme/DocItem/Content/index.tsx). Without this, tsc can't resolve
// those aliases even though webpack resolves them fine at build time.
// https://docusaurus.io/docs/typescript-support#project-typo-checking
/// <reference types="@docusaurus/module-type-aliases" />
/// <reference types="@docusaurus/theme-classic" />
