import MDXComponents from '@theme-original/MDXComponents';
import Screenshot from '@site/src/components/Screenshot';
import Video from '@site/src/components/Video';

// Registers <Screenshot> and <Video> for every page, so docs don't import it each time.
export default {
  ...MDXComponents,
  Screenshot,
  Video,
};
