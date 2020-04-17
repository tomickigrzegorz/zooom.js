## ZOOOM.JS
A simple plugin for image zoooming without dependencies. Only pure javascipt. 
Idea based on [zoom.js](https://github.com/fat/zoom.js)

### Demo

[Live DEMO](https://tomik23.github.io/zooom.js/)

## Clone the repo and install dependencies
```bash
git clone 
cd zooom
npm i or yarn
```

## Run the app
Run the app, just call:

```yarn dev``` or ```npm run dev```

The final code:

```yarn prod```

A library [Skeleton CSS](https://github.com/dhg/Skeleton) was used in this project.

## Configuration of the plugin

props | type | default | require | description
---- | :-------: | :-------: | :--------: | -----------
`element` | `String` |  | ✔ | Element to zoom img or class name
`padding` | `Number` | `80` |  | Padding added to image
`color` | `String` | `#fff` | | Overlay layer color
`opacity` | `String` | `1` |  | Overlay layer opacity

### Sample configuration
```javascript
const options = {
    element: 'img', // you can also add a class name
    padding: 80,
    overlay: {
      color: '#000',
    opacity: '.5'
    }
}

  new Zooom(options);
```

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/vivaldi/vivaldi_48x48.png" alt="Vivaldi" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Vivaldi |
| --------- | --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions

## License
This project is available under the [MIT](https://opensource.org/licenses/mit-license.php) license.