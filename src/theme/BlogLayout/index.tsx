import React, { type ReactNode } from 'react';
import BlogLayout from '@theme-original/BlogLayout';
import type { Props } from '@theme/BlogLayout';
import NewsletterSignup from '@site/src/components/NewsletterSignup';

// Wraps the stock blog layout (blog index, each post, tag pages) to put the
// newsletter sign-up under the content, so every blog page offers it.
export default function BlogLayoutWrapper({ children, ...props }: Props): ReactNode {
  return (
    <BlogLayout {...props}>
      {children}
      <NewsletterSignup />
    </BlogLayout>
  );
}
