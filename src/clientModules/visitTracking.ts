import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import type { ClientModule } from '@docusaurus/types';

// Visit statistics for the FreeMoCap admin page. Each page view, and each
// click on a link marked data-umami-event="...", also goes to the shop's own
// event log (shop.freemocap.org/api/events), so /admin/analytics on the shop
// can show the docs beside the shop and freemocap.org. No cookies and
// nothing stored in the browser; see /about/privacy. Only on the live site
// (and the local all-sites preview), never on localhost builds.

const ENDPOINT = 'https://shop.freemocap.org/api/events';
const HOSTS = ['docs.freemocap.org', 'docs.freemocap.localhost'];

type Data = Record<string, string>;

function enabled(): boolean {
  return ExecutionEnvironment.canUseDOM && HOSTS.includes(window.location.hostname);
}

let firstView = true;

function send(name: 'pageview' | 'outbound_click', data?: Data) {
  if (!enabled()) return;
  const body = JSON.stringify({
    name,
    path: window.location.pathname + window.location.search,
    // The page they came from only matters for the first view; later views
    // are moves within the docs.
    referrer: firstView ? document.referrer || undefined : undefined,
    data,
  });
  try {
    if (navigator.sendBeacon?.(ENDPOINT, body)) return;
  } catch {
    // Fall through.
  }
  fetch(ENDPOINT, { method: 'POST', body, mode: 'no-cors', keepalive: true }).catch(() => {});
}

if (enabled()) {
  document.addEventListener(
    'click',
    (event) => {
      const el = (event.target as Element | null)?.closest?.('[data-umami-event]');
      if (!el || el.tagName === 'FORM') return;
      const data: Data = { label: el.getAttribute('data-umami-event') ?? '' };
      for (const attr of Array.from(el.attributes)) {
        const m = /^data-umami-event-(.+)$/.exec(attr.name);
        if (m) data[m[1]] = attr.value;
      }
      send('outbound_click', data);
    },
    { capture: true },
  );
  document.addEventListener(
    'submit',
    (event) => {
      const label = (event.target as Element | null)?.getAttribute?.('data-umami-event');
      if (label) send('outbound_click', { label });
    },
    { capture: true },
  );
}

const visitTracking: ClientModule = {
  onRouteDidUpdate({ location, previousLocation }) {
    // A change of #section on the same page isn't a new page view.
    if (previousLocation && previousLocation.pathname === location.pathname) return;
    send('pageview');
    firstView = false;
  },
};

export default visitTracking;
