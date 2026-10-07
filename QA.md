# SUMI reader verification

Verified on 2026-10-06 using Node.js 24.19.0 and jsdom 30.1.2.

## Result

- **49 tests passed; 0 failed, 0 skipped.**
- `app.js`, `core.js` and `data.js` passed JavaScript syntax checks.
- All six original sample SVG files passed XML parsing.
- Original sample artwork was rendered and inspected separately by the implementation author; a text-stroke issue and a low-contrast bubble were corrected.
- Browser visual/layout, real-device touch, native dialog and real browser image-decoder testing were **not run**. The existing cloud preview access was blocked; this review did not attempt another browser route or start a local server.

## Reproduce

Portable setup from the project directory:

```sh
npm install
npm test
npm run check
```

Commands actually used in the supplied workspace, reusing its existing dependency installation:

```sh
NODE_PATH=/tmp/drug-report-tests/node_modules npm test
npm run check
```

The application itself has no npm runtime dependency. Its test runner is `tests/reader.test.cjs`.

## Behavior covered

### Reading and navigation

- Original six-page sample opens with reader controls and page announcements.
- Previous/next buttons, first/last boundaries, page selector and both chapters work.
- RTL/LTR arrow keys and swipe direction work; form controls retain native arrow behavior.
- Opening the reader permits arrow navigation even while the Back button is focused.
- Zoom is bounded from 50% to 200%; reset and reader-width resize math work.
- Predominantly vertical swipes and swipes while zoomed in do not turn pages.
- Scroll mode creates every page, observes page progress, synchronizes selectors and disconnects observers on mode change/close.
- Close/Escape restore the shelf, clear reader image elements, release local object URLs and preserve allowed reading progress.
- Reopen resumes the original sample or a reimported local book at the saved page.
- Actual jsdom Back/Forward traversal and synthetic hash/popstate flows leave no stale reader overlay; stale `#read` navigation is returned to the shelf.

### Local imports and resource cleanup

- Natural filename order, maximum count, allowed extensions, per-file size and total byte limits.
- JPEG/PNG/WebP signature checks; JPEG baseline/progressive, PNG and WebP VP8/VP8L/VP8X dimension parsing.
- Unsupported, truncated or malformed signatures/header cases fail closed.
- Header pixel budgets are checked before allocating object URLs or invoking the modeled decoder.
- Individual and total decoded pixel budgets are checked again.
- Empty selections, unreadable files, decoder errors and decoder timeouts leave an actionable import dialog.
- Cancel, Escape, dialog close, browser history/hash navigation during import, retry, overlapping selection, stale success and stale failure do not reopen an obsolete import or disturb its replacement.
- Pending URLs are revoked on failed/canceled imports; successful URLs are revoked on reader close or unload.
- Local filenames remain text, detected image MIME overrides a misleading supplied type, and stored state contains no image data or blob URL.

### State, accessibility and privacy

- Malformed JSON, invalid state fields, prototype-style keys, excessive saved page indices and unavailable storage do not prevent reading.
- Confirmed clearing removes stored preferences/progress; cancellation preserves them.
- Favorites, counts, search and empty states remain consistent.
- Keyboard focus survives favorite-card rerenders or returns to the favorites filter when the card is removed.
- Reader Tab/Shift+Tab wrapping excludes disabled end controls.
- All dialogs have accessible names; external detail links disclose the lack of onsite commercial-page rights.
- The test harness models modal focus restoration and checks the app's trigger/focus wiring.
- Source inspection confirms no analytics/upload APIs, external image/script/style resources, remote embeds or HTML injection assignments in the application.
- CSP contains `connect-src 'none'`, `object-src 'none'` and `form-action 'none'`.
- Production data contains ten unique ordered works, dated-snapshot metadata, no invented sales counts, and HTTPS links on the expected official domains. External links use `noopener noreferrer`.

## Fixes verified during review

1. Keyboard shortcuts now work with the reader's initially focused Back button.
2. Dialog accessible names and reader modal semantics were added.
3. Reader focus wrapping was added and checked.
4. Favorite toggles preserve keyboard focus after rebuilding the cards.
5. Image dimensions are checked from headers before browser decoding, with decoded-size checks retained.
6. Back/hash navigation cancels pending imports before a stale decoder can reopen the reader.

## Boundaries of these results

jsdom does not perform browser layout or actual image decoding. Dialogs, decoded image dimensions, scrolling and IntersectionObserver are deterministic test doubles. Responsive styles include mobile/tablet breakpoints, but mobile screenshots, rendered overflow, native gesture ergonomics, safe-area behavior and real browser dialog focus remain unverified.

The data smoke test checks local schema, attribution language and expected official domains. It does not independently establish remote availability, source ranking accuracy, territorial availability or free/full access. Source research is separate from this offline test report.

The no-tracking checks describe this application's code and assets. Hosting-provider logs and the behavior of linked external official sites are outside the application's guarantees. Commercial series are external official links; this app directly reads only its original sample and the user's authorized local image imports.
