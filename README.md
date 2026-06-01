<h1 align=center>ZOOOM.JS</h1>

<p align="center">
  A simple plugin for image zooming without dependencies. Pure JavaScript.
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/tomickigrzegorz/zooom.js?style=for-the-badge">
  <img src="https://img.shields.io/github/size/tomickigrzegorz/zooom.js/dist/zooom.min.js?style=for-the-badge">
  <a href="LICENSE">
    <img src="https://img.shields.io/github/license/tomickigrzegorz/zooom.js?style=for-the-badge">
  </a>
</p>

## Demo

See the demo - [example](https://tomickigrzegorz.github.io/zooom.js/)

## Installation

### CDN

```html
<script src="https://cdn.jsdelivr.net/gh/tomickigrzegorz/zooom.js@1.4.0/dist/zooom.min.js"></script>
<!-- optional: navigation between zoomed images -->
<script src="https://cdn.jsdelivr.net/gh/tomickigrzegorz/zooom.js@1.4.0/dist/zooom-slider.min.js"></script>
<!-- optional: wheel/dblclick/pinch/pan zoom -->
<script src="https://cdn.jsdelivr.net/gh/tomickigrzegorz/zooom.js@1.4.0/dist/zooom-panzoom.min.js"></script>
```

> The `dist` folder contains IIFE, UMD and ESM builds as well as minified `*.min.js` versions.

### npm / yarn / pnpm

```bash
npm install zooom
# or
yarn add zooom
# or
pnpm add zooom
```

```javascript
import Zooom from "zooom";
import SliderPlugin from "zooom/slider";
import PanZoomPlugin from "zooom/panzoom";

new Zooom("img-zoom")
  .use(new SliderPlugin({ effect: "slide" }))
  .use(new PanZoomPlugin());
```

TypeScript declarations ship in `dist/types/` — `Zooom`, `SliderPlugin`, `PanZoomPlugin`, and the public types (`ConstructorObject`, `ZooomContext`, `ZooomPlugin`, `SliderOptions`, `PanZoomOptions`, etc.) are all typed out of the box.

> **Plugin names differ by how you load them.** The plugins are default exports, so the name depends on the build:
>
> | Loading method | Slider | PanZoom |
> | --- | --- | --- |
> | `<script>` tag (IIFE/UMD) — uses the global name | `ZooomSlider` | `ZooomPanZoom` |
> | `import` (npm / bundler) — name is yours to choose | e.g. `SliderPlugin` | e.g. `PanZoomPlugin` |
>
> In the browser the global is **`ZooomSlider`** / **`ZooomPanZoom`** — `new SliderPlugin(...)` will be `undefined`. With a bundler you can name the import anything (`import ZooomSlider from "zooom/slider"` works just as well).

### Download

Download from the `dist` folder and add to your HTML:

- `dist/zooom.min.js` — core library
- `dist/zooom-slider.min.js` — SliderPlugin (optional)
- `dist/zooom-panzoom.min.js` — PanZoomPlugin (optional)

## Basic usage

1. Add the library to your page:

```html
<script src="path/to/zooom.min.js"></script>
```

2. Add a class to each image you want to zoom — `img-zoom` in this example:

```html
<img class="img-zoom" src="./images/image.jpg" />
```

3. Initialize the library:

```html
<script>
  new Zooom("img-zoom");
</script>
```

## Configuration

| prop           |   type   |       default        | required | description                                                                                                                               |
| -------------- | :------: | :------------------: | :------: | ----------------------------------------------------------------------------------------------------------------------------------------- |
| zIndex         |  Number  |         `1`          |          | Controls the stacking order of the zoomed layer                                                                                           |
| animationTime  |  Number  |        `300`         |          | Zoom animation duration in milliseconds                                                                                                   |
| cursor.in/out  |  String  | `zoom-in / zoom-out` |          | CSS cursor value shown when hovering over zoomable / zoomed images                                                                        |
| overlay        |  String  |                      |          | Background overlay color and opacity — e.g. `rgba(255,255,255,0.9)` or `hsla(0,0%,100%,0.9)`                                             |
| closeButton    | Boolean  |       `false`        |          | When `true`, renders an X button at top-right and disables image-click-to-close. Overlay click and `Escape` still close. Recommended when using `PanZoomPlugin`. |
| data-zooom-big |  string  |                      |          | URL of the full-size image to load on click instead of the thumbnail                                                                      |
| onResize       | Function |                      |          | Called on window resize. Return `true` to disable zooming (e.g. on small screens)                                                        |
| onOpen         | Function |                      |          | Callback fired when an image is zoomed in. Receives the image element as argument                                                         |
| onClose        | Function |                      |          | Callback fired when the zoomed image is closed. Receives the image element as argument                                                    |

## Minimal configuration

```javascript
new Zooom("img-zoom");
```

## Full configuration example

```javascript
new Zooom("img-zoom", {
  zIndex: 9,
  animationTime: 300,
  cursor: {
    in: "zoom-in",
    out: "zoom-out",
  },
  overlay: "rgba(255,255,255,0.9)",
  closeButton: false,
  onResize: function () {},
  onOpen: function (element) {},
  onClose: function (element) {},
});
```

## Plugin system

Zooom supports plugins via the `.use()` method, which can be chained:

```javascript
new Zooom("img-zoom", { ... }).use(plugin1).use(plugin2);
```

### SliderPlugin

Adds previous/next navigation buttons, keyboard arrow-key support, and touch swipe gestures for browsing between images.

Add the slider script after the core library:

```html
<script src="path/to/zooom.min.js"></script>
<script src="path/to/zooom-slider.min.js"></script>
```

#### With slide animation

```javascript
new Zooom("img-zoom", {
  zIndex: 9,
  animationTime: 300,
  overlay: "rgba(255,255,255,0.9)",
}).use(new ZooomSlider({ effect: "slide" }));
```

#### Without animation (instant swap)

```javascript
new Zooom("img-zoom", {
  zIndex: 9,
  animationTime: 300,
  overlay: "rgba(255,255,255,0.9)",
}).use(new ZooomSlider());
```

#### SliderPlugin options

| prop        |             type             | default | description                                                                                                                                       |
| ----------- | :--------------------------: | :-----: | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| effect      |            String            |         | Set to `"slide"` to enable slide-transition navigation. Omit for an instant image swap.                                                           |
| counter     |           Boolean            | `false` | Show an image counter in the top-left corner, e.g. `1 / 10`.                                                                                      |
| preload     |            Number            |   `0`   | Preload N neighbour images on each side of the opened image (uses `data-zooom-big` when present, otherwise the displayed `src`). `0` disables. `1` warms the immediate prev/next. |
| hideButtons | Boolean \| Number \| String \| Function |         | Hide prev/next arrow buttons. Keyboard, swipe and mouse-drag still navigate. See below for accepted values.                                       |
| gap         |            Number            |   `0`   | Visual spacing in pixels between adjacent images during swipe/drag and the `effect: 'slide'` animation. Useful on mobile to separate slides.    |
| loadingIndicator | Boolean \| String \| Function |       | Toggle `.zooom-loading` on `<body>` while a navigated-to image is loading (e.g. lazy `<img>` or `<picture>`). See accepted values below.   |

Navigation is triggered by:
- **Buttons** — prev/next arrows shown at the sides of the zoomed image
- **Keyboard** — `←` / `→` arrow keys
- **Touch** — swipe left/right (min 50 px)
- **Mouse** — click & drag left/right on the zoomed image

##### `hideButtons` values

| value          | behaviour                                                                          |
| -------------- | ---------------------------------------------------------------------------------- |
| `true`         | Always hide the arrow buttons.                                                     |
| `768` (number) | Hide when viewport width is ≤ N px. Re-evaluated on window resize.                 |
| `"mobile"`     | Hide on coarse-pointer (touch) devices, detected via `(pointer: coarse)`.          |
| `() => bool`   | Custom predicate. Called on every open and on window resize; return `true` = hide. |

```javascript
// hide on phones/tablets, keep on desktops
new Zooom("img-zoom").use(new ZooomSlider({ effect: "slide", hideButtons: "mobile" }));

// hide on narrow viewports
new Zooom("img-zoom").use(new ZooomSlider({ effect: "slide", hideButtons: 768 }));

// always hide — rely on keyboard/swipe/drag only
new Zooom("img-zoom").use(new ZooomSlider({ effect: "slide", hideButtons: true }));
```

#### With gap between slides

```javascript
new Zooom("img-zoom").use(new ZooomSlider({ effect: "slide", gap: 16 }));
```

#### With loading indicator

The plugin toggles a `zooom-loading` class on `<body>` — host page styles the spinner. (The demo CSS already ships one — see `sources/scss/style.scss` for the rule.)

##### `loadingIndicator` values

| value          | behaviour                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------- |
| `true`         | Always show the spinner while the next image loads.                                                |
| `"auto"`       | Show only on slow networks (`navigator.connection.effectiveType` ≤ `3g`, or `saveData`). Chromium-only — silently no-op in Safari/Firefox. |
| `() => bool`   | Custom predicate. Called per navigation; return `true` = show.                                     |

```javascript
// always show while next image loads
new Zooom("img-zoom").use(new ZooomSlider({ effect: "slide", loadingIndicator: true }));

// only on 3G or worse / data-saver mode
new Zooom("img-zoom").use(new ZooomSlider({ effect: "slide", loadingIndicator: "auto" }));
```

#### With counter

```javascript
new Zooom("img-zoom", {
  zIndex: 9,
  animationTime: 300,
  overlay: "rgba(255,255,255,0.9)",
}).use(new ZooomSlider({ effect: "slide", counter: true }));
```

#### With neighbour preload

For galleries using `data-zooom-big` (full-size image loaded on click), set `preload` to warm the browser cache for adjacent images so navigation feels instant:

```javascript
new Zooom("img-zoom", {
  zIndex: 9,
  animationTime: 300,
  overlay: "rgba(255,255,255,0.9)",
}).use(new ZooomSlider({ effect: "slide", preload: 1 }));
```

### PanZoomPlugin

Adds wheel + double-click + pinch + drag-to-pan zoom on the active image, so users can zoom in beyond the fit-to-viewport scale and pan around the zoomed image.

Add the panzoom script after the core library (and, if used together, after `zooom-slider`):

```html
<script src="path/to/zooom.min.js"></script>
<script src="path/to/zooom-slider.min.js"></script>
<script src="path/to/zooom-panzoom.min.js"></script>
```

```javascript
new Zooom("img-zoom", {
  zIndex: 9,
  animationTime: 300,
  overlay: "rgba(255,255,255,0.9)",
  closeButton: true,
})
  .use(new ZooomSlider({ effect: "slide" }))
  .use(new ZooomPanZoom({ maxScale: 3 }));
```

> **Tip.** Enable `closeButton: true` when using `PanZoomPlugin` — it disables image-click-to-close so single-clicks during pan/zoom never accidentally dismiss the zoom.

> **Plugin order matters.** When using both, install SliderPlugin **before** PanZoomPlugin (`.use(slider).use(panzoom)`). PanZoom layers its gesture handling on top of the slider's; the order keeps the mental model consistent.

#### PanZoomPlugin options

| prop             |  type  | default | description                                                                                                |
| ---------------- | :----: | :-----: | ---------------------------------------------------------------------------------------------------------- |
| maxScale         | Number |   `3`   | Maximum scale multiplier beyond the core's fit-to-viewport base (so the maximum total zoom is `base × maxScale`). |
| doubleClickScale | Number |   `2`   | Scale applied on double-click (and reverted on next double-click), as a multiplier of the base scale.       |
| wheelStep        | Number | `0.15`  | Scale delta applied per mouse-wheel tick.                                                                  |

Gestures:
- **Mouse wheel** — zoom in/out, anchored on the cursor
- **Double click** — toggle between base scale and `doubleClickScale × base` (200 ms ease-out)
- **Pinch** — zoom in/out, anchored on the pinch midpoint
- **Mouse drag / touch drag** — pan the image when zoomed (clamped to viewport edges)

Coordination with `SliderPlugin`:
- At base scale, horizontal swipe still navigates between images (slider takes the gesture)
- While zoomed, horizontal swipe pans the image instead — slider's swipe is blocked
- Slider buttons and `←` / `→` keys continue to work while zoomed in
- `Escape` closes the zoom from whatever pan/zoom position it's currently at

> Click-to-close has a 300 ms latency while PanZoomPlugin is installed (we wait to see if a second click follows for a double-click). `Escape` stays instant.

### Writing your own plugin

A plugin is any object that implements the `ZooomPlugin` interface:

```typescript
interface ZooomPlugin {
  name: string;
  install(ctx: ZooomContext): void;
  uninstall?(): void; // optional cleanup hook
}
```

The `ZooomContext` passed to `install` exposes:

```typescript
interface ZooomContext {
  readonly images: HTMLElement[];                  // all registered images
  readonly currentImage: HTMLElement;              // currently zoomed image
  readonly currentClone: HTMLImageElement | null;  // active cloned image element
  readonly animTime: number;                       // animation duration (ms)
  readonly zIndex: number;                         // base z-index
  readonly overlayLayer: HTMLDivElement;
  readonly closeButton: boolean;                   // whether closeButton mode is on
  on(event: 'open' | 'close' | 'keydown', handler: Function): void;
  zoomIn(image: HTMLElement, instant?: boolean): void;
  zoomOut(): void;
  addStyle(css: string): void;
  setCurrentImage(image: HTMLElement): void;
  setClone(img: HTMLImageElement): void;
  notifyOpen(image: HTMLElement): void;
  notifyClose(image: HTMLElement): void;
}
```

## Loading a large image

Display a thumbnail and load the full-size image only on click using `data-zooom-big`:

```html
<img
  class="img-zoom"
  loading="lazy"
  width="576"
  height="384"
  data-zooom-big="./full-image.jpg"
  src="./image-thumbnail.jpg"
/>
```

> **Always set both `width` and `height` on `loading="lazy"` images** (including the `<img>` inside `<picture>`). Before a lazy image loads, the browser uses these attributes to reserve its aspect ratio — without them the element measures `0` height, which Zooom needs to size and scale the zoomed clone correctly from the first frame. Omitting them also causes layout shift in the gallery itself.

## Prevent zoom on small screens

Return `true` from `onResize` to disable zooming:

```javascript
new Zooom("img-zoom", {
  cursor: {
    in: "var(--zoom-in)",
    out: "var(--zoom-out)",
  },
  onResize: function () {
    const isMobile = window.matchMedia("(max-width: 600px)").matches;

    const root = document.documentElement;
    root.style.setProperty("--zoom-in", isMobile ? "default" : "zoom-in");
    root.style.setProperty("--zoom-out", isMobile ? "default" : "zoom-out");

    return isMobile; // true blocks zooming
  },
});
```

## Keyboard and accessibility

Zooom is keyboard-accessible and screen-reader friendly out of the box — no configuration required.

### Keyboard shortcuts

| Key                | Action                                                            |
| ------------------ | ----------------------------------------------------------------- |
| `Tab` / `Shift+Tab` | Move focus to a zoomable image (every `.img-zoom` gets `tabindex="0"`) |
| `Enter` / `Space`  | Open zoom on the focused image                                    |
| `Escape`           | Close the zoom                                                    |
| `←` / `→`          | Previous / next image (SliderPlugin only)                         |
| `Tab` (while zoomed) | Trapped inside the zoom layer — keyboard focus can't escape    |

### What happens automatically

- **Overlay** receives `role="dialog"`, `aria-modal="true"`, and `aria-label` derived from the image's `alt` attribute
- **Cloned image** inherits the original `alt` and gets `tabindex="-1"` so it can hold focus during the zoom
- **Focus management** — focus is moved to the cloned image on open and restored to the previously-focused element on close (after the close animation completes)
- **Focus trap** — `Tab` / `Shift+Tab` while zoomed re-focuses the cloned image, preventing the user from tabbing into the page behind the modal
- **SliderPlugin counter** (when `counter: true`) gets `aria-live="polite"` and `aria-atomic="true"`, so screen readers announce navigation like "3 / 11"

### Tips for authors

- Always set a meaningful `alt` on your `<img>` — it becomes the dialog's accessible name
- If a particular image shouldn't be keyboard-focusable, set `tabindex="-1"` on it explicitly before initialising Zooom

## Clone the repo and run locally

```bash
git clone https://github.com/tomickigrzegorz/zooom.js.git
cd zooom
pnpm install
```

```bash
# start dev server with live reload
pnpm dev

# production build
pnpm build
```

## Browser support

Zooom supports all modern browsers (Chrome, Firefox, Safari, Edge).

## License

This project is available under the [MIT](https://opensource.org/licenses/mit-license.php) license.
