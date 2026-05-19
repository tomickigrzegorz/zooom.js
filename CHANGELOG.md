## v1.3.0 (2026-05-19)

### Added

- **PanZoomPlugin** — separate `zooom-panzoom.js` bundle adding wheel, double-click, pinch and drag-to-pan zoom on top of the core's fit-to-viewport scale, so users can zoom deeper into a detail and pan around
  - `maxScale: 3` (default) — maximum scale multiplier beyond the fit-to-viewport base
  - `doubleClickScale: 2` (default) — scale applied on double-click (toggled on next double-click) with a 200 ms ease-out transition
  - `wheelStep: 0.15` (default) — scale delta per mouse-wheel tick
  - Wheel/pinch/dblclick are anchored on the cursor / pinch-midpoint / click point so the point under the user's gesture stays put while the rest of the image scales around it
  - Pan is clamped to the viewport — no over-pan, no bounce
  - Coordinates with `SliderPlugin`: at base scale, horizontal swipe still navigates; while zoomed, swipe pans the image instead (capture-phase touch listeners with `stopPropagation()`). Slider prev/next buttons and `←` / `→` keys keep working while zoomed.
- New `PanZoomOptions` interface and `package.json` subpath export `zooom/panzoom` (mirrors the slider plumbing).

### Notes

- When PanZoomPlugin is installed, single-click-to-close gains a 300 ms latency (we wait for a possible double-click). `Escape` stays instant. This is the trade-off for native double-click support.
- Plugin install order: `.use(slider).use(panzoom)` — documented in README.

---

## v1.2.0 (2026-05-19)

### Added

- **Accessibility** — built into core, always on:
  - Zoomable images receive `tabindex="0"` (when not already set) so keyboard users can reach them; `Enter` / `Space` opens the zoom
  - Overlay receives `role="dialog"`, `aria-modal="true"`, and `aria-label` derived from the image's `alt`
  - `aria-label` on the overlay is kept in sync as plugins navigate between images (via `ZooomContext.setCurrentImage`)
  - Cloned `<img>` gets `tabindex="-1"` and inherits `alt` from the original
  - Focus is moved to the cloned image on open and restored to the previously-focused element on close (deferred until after the close animation completes so the original image is visible again)
  - `Tab` / `Shift+Tab` are trapped inside the zoom layer (refocuses the clone) so keyboard users don't escape the modal
  - SliderPlugin counter element gets `aria-live="polite"` and `aria-atomic="true"`, so screen readers announce the full counter text (e.g. "3 / 11") on every navigation
- **Plugin system** — new `.use(plugin)` chainable API for extending Zooom with plugins
- **SliderPlugin** — separate `zooom-slider.js` bundle providing previous/next navigation buttons, keyboard arrow-key support and touch swipe
  - `effect: "slide"` — animated slide transition between images
  - `counter: true` — image counter (e.g. `3 / 10`) in the top-left corner
  - `preload: N` — warm the browser cache for N neighbour images on each side (uses `data-zooom-big`) so navigation feels instant
  - no `effect` option — instant image swap without animation
- New `ZooomContext` interface exposing `images`, `currentImage`, `currentClone`, `animTime`, `zIndex`, `overlayLayer`, lifecycle events (`open`, `close`, `keydown`) and methods (`zoomIn`, `zoomOut`, `addStyle`, `setCurrentImage`, `setClone`, `notifyOpen`, `notifyClose`)
- Optional `ZooomPlugin.uninstall()` — cleanup hook for plugins (SliderPlugin implements it: removes nav buttons, counter and touch listeners)
- TypeScript declaration files (`.d.ts`) shipped in `dist/types/` — TS consumers get full autocompletion and type-checking for `Zooom`, `SliderPlugin`, and the public types (`ConstructorObject`, `ZooomContext`, `ZooomPlugin`, `SliderOptions`, etc.)
- `package.json` `exports` field with conditional `import` / `require` / `types` resolution for both entry points: `import Zooom from 'zooom'` and `import SliderPlugin from 'zooom/slider'`

### Changed

- `package.json` entry points (`main`, `browser`, `module`) now point to `dist/` instead of `docs/`; fixed `module` field typo (`zooom.ems.min.js` → `zooom.es.min.js`); added `files` field to limit publish payload
- Public types moved from ambient `interface.d.ts` to an exporting module (`sources/js/types.ts`) — no more global namespace pollution for TS consumers
- Clone element switched from `position: absolute` to `position: fixed` — eliminates clipping by `body { overflow: hidden }` during zoom animation
- Removed IE (ES5) build targets from rollup config (`zooom.ie.min.js`, `zooom-slider.ie.min.js`)
- Core: shared `loadImage` helper between core and SliderPlugin, simplified resize/scroll wiring, internal clone tracking via `WeakSet` instead of ad-hoc properties on DOM nodes
- SliderPlugin: slide animation uses the Web Animations API (`Element.animate`) — cleaner cancellation when rapidly navigating; reads the active clone via `ZooomContext.currentClone` instead of querying the DOM

### Fixed

- Images with `loading="lazy"` staying permanently invisible after navigating with SliderPlugin and then closing
- Visual scaling artifact on first zoom-in click (caused by overflow clipping of absolute-positioned clone)
- Clone leak in DOM when rapidly clicking navigation buttons during an ongoing slide animation
- `onOpen` / `onClose` user callbacks and `figcaption` descriptions not firing during slide navigation

---

## v1.1.3 (2022-04-10)

### Fixed

- Release v1.1.2 contains files from v1.1.1 [#46](https://github.com/tomickigrzegorz/zooom.js/issues/46)

## v1.1.2 (2022-02-28)

### Fixed

- inline styles are removed when exiting zoom [#41](https://github.com/tomickigrzegorz/zooom.js/issues/41)

## v1.1.1 (2022-02-02)

### Added

- generating a separate file for IE browser, rollup.config - typescript target [es6, es5]

### Changed

- simplification of the 'overlay' styling

```js
overlay: {
  color: '#fff',
  opacity: 80,
},
```

on

```js
// overlay layer color and opacity, rgba, hsla, ...
overlay: "rgba(255, 255, 255, 0.9)",
```

### Build

- adding method and props in 'terser' mangle, adding an undeline `_zooomInit = () => {...}`

```js
terserOptions: {
  mangle: {
    properties: {
      regex: /^_/,
    },
  },
},
```

> This solution allowed to reduce the library by as much as 23%

## v1.1.0 (2022-01-04)

### Added

- a new parameter `data-zooom-big` has been added. With its help, we can open a larger version of the photo - [example-large-photo](https://tomickigrzegorz.github.io/zooom.js/#large-photo)  
  This solution is needed to optimize the website. We only display a thumbnail, only by clicking it downloads the photo from the `data-zooom-big` parameter and zooms in.

```html
<img
  class="img-zoom"
  loading="lazy"
  width="576"
  height="384"
  data-zooom-big="large-image.jpg"
  src="image-thumbnail.jpg"
/>
```

## v1.0.15 (2021-06-13)

### Chanded

- style refactoring, reducing the size of the library

## v1.0.14 (2021-06-10)

### Chanded

- update example

## v1.0.13 (2021-06-17)

### Added

- callback function `onResize`

### Changed

- callback function, name change from `onCleared` to `onClose` and `onLoaded` to `onOpen`

## v1.0.12 (2021-06-13)

### Changed

- fix: scrollTop not always work [#28](https://github.com/tomickigrzegorz/zooom.js/issues/28)

## v1.0.11 (2021-04-16)

### Added

- New example - leading color

## v1.0.10 (2021-03-30)

### Added

- Create a separate photo with styles for each click, fixed problem when photo is in overflow element

### Changed

- fix: Fixed problem when photo is in overflow element
- Removal of style from main photo
- Replaced node-sass to sass
- The browserslist extension
- Remove interface ImageParameters

## v1.0.9 (2020-11-20)

### Added

- UMD file
- Renaming a variable
- Banner from rollup.js

### Changed

- Removed banner plugin

## v1.0.8 (2020-09-09)

### Added

- New photos for example
- Adding vertical photos
- Example figure with picture

### Changed

- Removed padding
- Converted to typescript

## v1.0.7 (2020-09-07)

### Changed

- Lightbox animation not always appearing [#15](https://github.com/tomickigrzegorz/zooom.js/issues/15)

## v1.0.6 (2020-09-06)

### Added

- Debounce to resize window
- Two helpers functions `onLoaded`, `onCleared`
- Changelog.md

### Changed

- Change fade(in/out) from js to css
- Separate style
