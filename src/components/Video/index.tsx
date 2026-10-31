import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './styles.module.css';

// A looping demo clip. If the file is missing or the browser can't play it,
// show a plain note in its place instead of the browser's "No video with
// supported format and MIME type found" error box.
//
//   <Video src="/img/v1/groundplane_example.mp4" caption="..." />
type Props = {
  src: string;
  caption?: ReactNode;
};

export default function Video({ src, caption }: Props): ReactNode {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  // The error event can fire before React attaches onError (server-rendered
  // page), so check the element's state once mounted as well.
  useEffect(() => {
    const el = ref.current;
    if (el && (el.error || el.networkState === HTMLMediaElement.NETWORK_NO_SOURCE)) {
      setFailed(true);
    }
  }, []);

  return (
    <figure className={styles.figure}>
      {failed ? (
        <div className={styles.missing} role="note">
          This demo video has not yet been recorded for version 2.0 (alpha).
        </div>
      ) : (
        <video
          ref={ref}
          className={styles.video}
          src={src}
          controls
          muted
          loop
          playsInline
          onError={() => setFailed(true)}
        />
      )}
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
