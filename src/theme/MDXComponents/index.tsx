import MDXComponents from '@theme-original/MDXComponents';
import Screenshot from '@site/src/components/Screenshot';

// Registers <Screenshot> for every page, so docs don't import it each time.
export default {
  ...MDXComponents,
  Screenshot,
};
