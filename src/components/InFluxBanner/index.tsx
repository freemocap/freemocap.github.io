import React, { type ReactNode } from 'react';
import styles from './styles.module.css';

// Flags a page whose content is expected to change soon for reasons outside
// this site's control (a stand-in location, an unfinished upstream feature).
// Deliberately not collapsible like ProvenanceBanner: the message is one
// short sentence, nothing worth hiding behind a click.
export default function InFluxBanner({ note }: { note: string }): ReactNode {
  return (
    <div className={styles.banner}>
      <strong>Actively changing:</strong> {note}
    </div>
  );
}
