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
<script src="https://cdn.jsdelivr.net/gh/tomickigrzegorz/zooom.js@1.1.3/dist/zooom.min.js"></script>
```

> The `dist` folder contains IIFE, UMD and ESM builds as well as minified `*.min.js` versions.

### Download

Download from the `dist` folder and add to your HTML:

- `dist/zooom.min.js` — core library
- `dist/zooom-slider.min.js` — SliderPlugin (optional)

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

| prop    |  type   | default | description                                                                             |
| ------- | :-----: | :-----: | --------------------------------------------------------------------------------------- |
| effect  | String  |         | Set to `"slide"` to enable slide-transition navigation. Omit for an instant image swap. |
| counter | Boolean | `false` | Show an image counter in the top-left corner, e.g. `1 / 10`.                           |

Navigation is triggered by:
- **Buttons** — prev/next arrows shown at the sides of the zoomed image
- **Keyboard** — `←` / `→` arrow keys
- **Touch** — swipe left/right (min 50 px)

#### With counter

```javascript
new Zooom("img-zoom", {
  zIndex: 9,
  animationTime: 300,
  overlay: "rgba(255,255,255,0.9)",
}).use(new ZooomSlider({ effect: "slide", counter: true }));
```

### Writing your own plugin

A plugin is any object that implements the `ZooomPlugin` interface:

```typescript
interface ZooomPlugin {
  name: string;
  install(ctx: ZooomContext): void;
}
```

The `ZooomContext` passed to `install` exposes:

```typescript
interface ZooomContext {
  readonly images: HTMLElement[];       // all registered images
  readonly currentImage: HTMLElement;   // currently zoomed image
  readonly animTime: number;            // animation duration (ms)
  readonly zIndex: number;              // base z-index
  readonly overlayLayer: HTMLDivElement;
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

## Prevent zoom on small screens

Return `true` from `onResize` to disable zooming:

```javascript
new Zooom("img-zoom", {
  cursor: {
    in: "var(--zoom-in)",
    out: "var(--zoom-out)",
  },
  onResize: function () {
    const windowWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    const isMobile = windowWidth < 600;

    const root = document.documentElement;
    root.style.setProperty("--zoom-in", isMobile ? "default" : "zoom-in");
    root.style.setProperty("--zoom-out", isMobile ? "default" : "zoom-out");

    return isMobile; // true blocks zooming
  },
});
```

## Clone the repo and run locally

```bash
git clone https://github.com/tomickigrzegorz/zooom.js.git
cd zooom
yarn
```

```bash
# start dev server with live reload
yarn dev

# production build
yarn build
```

## Browser support

Zooom supports all modern browsers (Chrome, Firefox, Safari, Edge).

## License

This project is available under the [MIT](https://opensource.org/licenses/mit-license.php) license.
