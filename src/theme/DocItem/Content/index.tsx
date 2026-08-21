import React, { type ReactNode } from 'react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import ProvenanceBanner from '@site/src/components/ProvenanceBanner';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): ReactNode {
  const { frontMatter } = useDoc();
  const fm = frontMatter as Record<string, unknown>;
  const provenance = fm.provenance;

  return (
    <>
      {typeof provenance === 'string' && (
        <ProvenanceBanner
          provenance={provenance}
          reviewed={typeof fm.reviewed === 'string' ? fm.reviewed : undefined}
          reviewedAgainst={
            typeof fm.reviewed_against === 'string' ? fm.reviewed_against : undefined
          }
        />
      )}
      <Content {...props} />
    </>
  );
}
