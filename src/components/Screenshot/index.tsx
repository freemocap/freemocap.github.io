import React, { type ReactNode } from 'react';
import styles from './styles.module.css';

// A screenshot of the app: a figure with a border, an optional caption, and a
// small version stamp so readers (and we) can tell which release it shows.
// Click-to-zoom comes from docusaurus-plugin-image-zoom, not from here.
//
// `src` is an imported image, not a string path:
//   import shot from './img/record-controls.webp';
//   <Screenshot src={shot} alt="..." caption="..." version="2.0.0-alpha.25" />
// Importing lets webpack fingerprint the file and fail the build on a bad path.
// Images load normally, not lazily: they are small (4 to 50 KB) and have no reserved size,
// and a zero-sized lazy image can fail to load, especially on phones.
// `alt` is required and should say what the reader is meant to see.
type Props = {
  src: string;
  alt: string;
  caption?: ReactNode;
  version?: string;
  width?: number;
};

export default function Screenshot({ src, alt, caption, version, width }: Props): ReactNode {
  return (
    <figure className={styles.figure}>
      <img className={styles.image} src={src} alt={alt} style={width ? { maxWidth: `min(100%, ${width}px)` } : undefined} />
      {(caption || version) && (
        <figcaption className={styles.caption}>
          {caption}
          {version && <span className={styles.version}>FreeMoCap {version}</span>}
        </figcaption>
      )}
    </figure>
  );
}
