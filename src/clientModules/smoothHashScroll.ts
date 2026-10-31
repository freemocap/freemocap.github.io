import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Smooth scrolling only while following a same-page hash link (TOC, in-page
// anchors, the homepage tier picker). Leaving it on globally would also
// animate the scroll-to-top on every page-to-page navigation.
if (ExecutionEnvironment.canUseDOM) {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer: number | undefined;

  document.addEventListener('click', (event) => {
    if (reducedMotion.matches) return;
    const anchor = (event.target as Element | null)?.closest?.('a');
    if (!anchor || !anchor.hash) return;
    if (anchor.pathname !== window.location.pathname) return;
    root.style.scrollBehavior = 'smooth';
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      root.style.scrollBehavior = '';
    }, 1000);
  });
}
