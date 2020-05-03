## ZOOOM.JS
A simple plugin for image zoooming without dependencies. Only pure javascipt. 
Idea based on [zoom.js](https://github.com/fat/zoom.js)

### Demo

[Live DEMO](https://tomik23.github.io/zooom.js/)

## Clone the repo and install dependencies
```bash
git clone
cd zooom
yarn
# or
npm i
```

## Watch/Build the app
Watch the app, just call:

```bash
yarn watch
# or
npm run watch
```

Build app:

```bash
yarn build
# or
npm run build
```

## Configuration of the plugin

props | type | default | require | description
---- | :-------: | :-------: | :--------: | -----------
element | String |  | ✔ | Element to zoom class name
animationTiem | Number | `300` | | Animation speed in milliseconds
padding | Number | `80` |  | Padding added to image
color | String | `#fff` |  | Overlay layer color, hex only
opacity | Number | `100` |  | Overlay layer opacity, number must be an integer, maximum number 100
zIndex | Number | `1` |  | Option to control layer positions
cursorIn / cursorOut | String | `zoom-in / zoom-out` |  | The cursor property specifies the mouse cursor to be displayed when pointing over an element

## Sample configuration
```javascript
const options = {
  element: 'img-zoom',
  padding: 80,
  zIndex: 9,
  animationTiem: 300, // animation time in number
  cursor: {
    cursorIn: 'zoom-in',
    cursorOut: 'zoom-out'
  },
  overlay: {
    color: '#fff', // hex or color-name
    opacity: 80, // [10, 20, 34, ..., 100] maximum number 100
  },
}

new Zooom(options);
```

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/vivaldi/vivaldi_48x48.png" alt="Vivaldi" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Vivaldi |
| --------- | --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions

## License
This project is available under the [MIT](https://opensource.org/licenses/mit-license.php) license.