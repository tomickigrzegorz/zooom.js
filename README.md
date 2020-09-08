<h1 align=center>ZOOOM.JS</h1>

<p align="center">
  A simple plugin for image zoooming without dependencies. Only pure javascipt.
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/tomik23/zooom.js">
  <img src="https://img.shields.io/github/size/tomik23/zooom.js/docs/zooom.min.js">
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green.svg">
  </a>
</p>

## Demo

See the demo - [example](https://tomik23.github.io/zooom.js/)

## Clone the repo and install dependencies
```bash
git clone https://github.com/tomik23/zooom.js.git
cd zooom
yarn
# or
npm i
```

## Watch/Build the app
Watch the app, just call:

```bash
yarn dev
# or
npm run dev
```

Build app:

```bash
yarn prod
# or
npm run prod
```

## Configuration of the plugin

props | type | default | require | description
---- | :-------: | :-------: | :--------: | -----------
zIndex | Number | `1` |  | Option to control layer positions
animationTime | Number | `300` | | Animation speed in milliseconds
in / out | String | `zoom-in / zoom-out` |  | The cursor property specifies the mouse cursor to be displayed when pointing over an element
color | String | `#fff` |  | Overlay layer color, hex only
opacity | Number | `100` |  | Overlay layer opacity, number must be an integer, maximum number 100
onLoaded | Function |  |  | A helper function with which we can, for example, add text from the caption to the photo to show when zooming in on the photo. In the function we have access to the image element
onCleared | Function |  |  | A function that runs when the photo is closed. It can be combined with the function `onLoaded` see example. As in the previous `onLoaded` function, here we have access to the image element

## Sample configuration
```javascript
// class name
new Zooom('img-zoom', {
  zIndex: 9,
  // animation time in number
  animationTime: 300,
  // cursor type
  cursor: {
    in: 'zoom-in',
    out: 'zoom-out'
  },
  overlay: {
    // hex or color-name
    color: '#fff',
    // [10, 20, 34, ..., 100] maximum number 100
    opacity: 80,
  },
  // callback function
  // see usage example docs/index.html
  onLoaded: function(element) {},
  onCleared: function(element) {}
});
```

## Minimal configuration
```javascript
new Zooom('img-zoom');
```

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/vivaldi/vivaldi_48x48.png" alt="Vivaldi" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Vivaldi |
| --------- | --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions

## License
This project is available under the [MIT](https://opensource.org/licenses/mit-license.php) license.