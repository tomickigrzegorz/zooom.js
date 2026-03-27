## v1.2.0 (2026-03-12)

### Added

- **Plugin system** — new `.use(plugin)` chainable API for extending Zooom with plugins
- **SliderPlugin** — separate `zooom-slider.js` bundle providing previous/next navigation buttons and keyboard arrow-key support
  - `effect: "slide"` — animated slide transition between images
  - no option — instant image swap without animation
- New `ZooomContext` interface exposing `images`, `currentImage`, `animTime`, `zIndex`, `overlayLayer`, lifecycle events (`open`, `close`, `keydown`) and methods (`zoomIn`, `zoomOut`, `addStyle`, `setCurrentImage`, `setClone`, `notifyOpen`, `notifyClose`)

### Changed

- Clone element switched from `position: absolute` to `position: fixed` — eliminates clipping by `body { overflow: hidden }` during zoom animation
- Removed IE (ES5) build targets from rollup config (`zooom.ie.min.js`, `zooom-slider.ie.min.js`)

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
