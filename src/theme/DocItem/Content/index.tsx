import React, { type ReactNode } from 'react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import ProvenanceBanner, {
  type HistoryEntry,
} from '@site/src/components/ProvenanceBanner';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof ContentType>;

// Bare YYYY-MM-DD frontmatter scalars come back from gray-matter/js-yaml as
// real Date objects, not strings (YAML's implicit !!timestamp tag), parsed
// as UTC midnight. toISOString is used (not a local-time formatter) so the
// calendar day doesn't shift across timezones.
function toDateString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return undefined;
}

// A page's audit trail lives in frontmatter as `history: [{date, against}]`,
// newest entry first. Pages written before this array existed only carry
// the single `reviewed` / `reviewed_against` pair; falling back to reading
// those as a one-entry history means none of them need migrating; a page
// only needs the array once it actually has a second check to log.
function readHistory(fm: Record<string, unknown>): HistoryEntry[] {
  if (Array.isArray(fm.history)) {
    return fm.history.flatMap((entry) => {
      if (!entry || typeof entry !== 'object') return [];
      const date = toDateString((entry as Record<string, unknown>).date);
      if (!date) return [];
      const against = (entry as Record<string, unknown>).against;
      return [{ date, against: typeof against === 'string' ? against : undefined }];
    });
  }
  const date = toDateString(fm.reviewed);
  if (date) {
    return [{ date, against: typeof fm.reviewed_against === 'string' ? fm.reviewed_against : undefined }];
  }
  return [];
}

export default function ContentWrapper(props: Props): ReactNode {
  const { frontMatter } = useDoc();
  const fm = frontMatter as Record<string, unknown>;
  const provenance = fm.provenance;

  return (
    <>
      {typeof provenance === 'string' && (
        <ProvenanceBanner provenance={provenance} history={readHistory(fm)} />
      )}
      <Content {...props} />
    </>
  );
}
