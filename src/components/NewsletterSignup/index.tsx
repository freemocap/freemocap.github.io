import React, { type ReactNode } from 'react';
import styles from './styles.module.css';

// The FreeMoCap newsletter, run on Buttondown. The form posts straight to
// Buttondown, which sends the confirmation email; nothing is stored here.
// BUTTONDOWN_NEWSLETTER must match the newsletter's username on Buttondown.
// New blog posts reach subscribers through Buttondown's RSS-to-email,
// pointed at /blog/rss.xml.
const BUTTONDOWN_NEWSLETTER = 'freemocap';

export default function NewsletterSignup(): ReactNode {
  return (
    <section className={styles.box} aria-labelledby="newsletter-signup-title">
      <h2 id="newsletter-signup-title" className={styles.title}>
        Get new posts by email
      </h2>
      <p className={styles.blurb}>News, releases, and new blog posts from FreeMoCap, a few times a year. Unsubscribe any time.</p>
      <form
        className={styles.form}
        action={`https://buttondown.com/api/emails/embed-subscribe/${BUTTONDOWN_NEWSLETTER}`}
        method="post"
        target="_blank"
        data-umami-event="newsletter_signup"
        data-umami-event-from="docs-blog"
      >
        <label htmlFor="newsletter-signup-email" className={styles.srOnly}>
          Email address
        </label>
        <input
          id="newsletter-signup-email"
          className={styles.input}
          type="email"
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <input type="hidden" name="tag" value="docs-blog" />
        <button type="submit" className="button button--primary">
          Subscribe
        </button>
      </form>
    </section>
  );
}
