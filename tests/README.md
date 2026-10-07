# Offline reader regression tests

Run from the project root with Node.js 24+ and `jsdom` installed:

```sh
npm install
npm test
```

In the provided test workspace, the existing dependency can be reused without an install:

```sh
NODE_PATH=/tmp/drug-report-tests/node_modules node --test tests/reader.test.cjs
```

The suite exercises the actual `app.js`, `core.js` and `index.html` in an offline jsdom document. Most tests use a deterministic ten-item fixture; the production-data smoke test also loads `data.js` and validates its schema, date labels, official-link destinations and rendered cards.

Coverage includes page/chapter navigation, RTL/LTR keys and touch gestures, zoom limits and resizing, scroll-mode progress, keyboard focus boundaries, Back/Forward and stale hash behavior, search/favorites, modal naming and focus restoration, corrupted/unavailable storage, cancellation and retries, replaced/stale asynchronous imports, signature and dimension validation, total memory limits, timeout and decode failures, object-URL cleanup, local progress restoration and static privacy/rights safeguards.

## Verification limits

- No browser was launched, no local web server was started, and no network or external service was used.
- Native dialogs, image decoding, scrolling and IntersectionObserver are modeled. Tests do not certify real browser rendering, responsive visual layout, native modal focus behavior, touch ergonomics or real image-codec compatibility.
- Tests verify source-level no-upload/no-tracking behavior and prohibit network API use in the DOM harness. They cannot certify hosting-provider logging or behavior on external official reading sites.
- Production data checks ensure explicit dated-snapshot language and official HTTPS domains. They do not independently confirm remote availability, weekly ranking accuracy, licensing or territorial access.
- Only the original sample and authorized local imports are readable in this application; commercial works remain external official links.
