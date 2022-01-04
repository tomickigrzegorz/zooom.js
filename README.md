<h1 align=center>ZOOOM.JS</h1>

<p align="center">
  A simple plugin for image zoooming without dependencies. Only pure javascipt.
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/tomik23/zooom.js?style=for-the-badge">
  <img src="https://img.shields.io/github/size/tomik23/zooom.js/dist/zooom.min.js?style=for-the-badge">
  <a href="LICENSE">
    <img src="https://img.shields.io/github/license/tomik23/zooom.js?style=for-the-badge">
  </a>
</p>

## Installation

### CDN

#### JavaScript

```html
<script src="https://cdn.jsdelivr.net/gh/tomik23/zooom.js@1.1.0/dist/zooom.min.js"></script>
```

> Note: In the dist folder we have available iffe, umd and es versions as well as minified \* .min.js versions

##### -- OR --

Download from `dist` folder and insert to html:

- zooom.min.js

## Demo

See the demo - [example](https://tomik23.github.io/zooom.js/)

## How to add basic version to page

1. Just download the library from the `dist/zoom.min.js` and add it to head.

```html
<script src="path/to/zooom.min.js"></script>
```

2. For each photo you want to grow, add a class in our example it's `img-zoom`

```html
<img class="img-zoom" src="./images/image.jpg" />
```

3. Now all you have to do is call our library, this is the simplest example. Below you will find a description of how to configure the library more.

```html
<script>
  window.addEventListener('DOMContentLoaded', function () {
    new Zooom('img-zoom');
  });
</script>
```

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

| props          |   type   |       default        | require | description                                                                                                                                                                              |
| -------------- | :------: | :------------------: | :-----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| zIndex         |  Number  |         `1`          |         | Option to control layer positions                                                                                                                                                        |
| animationTime  |  Number  |        `300`         |         | Animation speed in milliseconds                                                                                                                                                          |
| in / out       |  String  | `zoom-in / zoom-out` |         | The cursor property specifies the mouse cursor to be displayed when pointing over an element                                                                                             |
| color          |  String  |        `#fff`        |         | Overlay layer color, hex only                                                                                                                                                            |
| opacity        |  Number  |        `100`         |         | Overlay layer opacity, number must be an integer, maximum number 100                                                                                                                     |
| data-zooom-big |  string  |                      |         | The large version of the photo is the views instead of the thumbnail                                                                                                                     |
| onResize       | Function |                      |         | A function that can be used to block clicking on an image. See example below - How to prevent zoom-in/out images                                                                         |
| onOpen         | Function |                      |         | A helper function with which we can, for example, add text from the caption to the photo to show when zooming in on the photo. In the function we have access to the image element       |
| onClose        | Function |                      |         | A function that runs when the photo is closed. It can be combined with the function `onOpen` see example. As in the previous `onOpen` function, here we have access to the image element |

## Minimal configuration

```javascript
new Zooom('img-zoom');
```

## Sample configuration

```javascript
new Zooom('img-zoom', {
  zIndex: 9,

  // animation time in number
  animationTime: 300,

  // cursor type
  cursor: {
    in: 'zoom-in',
    out: 'zoom-out',
  },

  overlay: {
    // hex or color-name
    color: '#fff',

    // [10, 20, 34, ..., 100] maximum number 100
    opacity: 80,
  },

  // callback function
  // see usage example docs/index.html
  onResize: function () {},
  onOpen: function (element) {},
  onClose: function (element) {},
});
```

## How to use Zooom with Bootstrap Carousel

See an [example](https://codepen.io/Tomik23/full/VwPmLqX)

```javascript
new Zooom('img-zoom', {
  zIndex: 9,

  // animation time in number
  animationTime: 300,

  // cursor type
  cursor: {
    in: 'zoom-in',
    out: 'zoom-out',
  },
  overlay: {
    // hex or color-name
    color: '#fff',

    // [10, 20, 34, ..., 100] maximum number 100
    opacity: 80,
  },

  // callback function
  // see usage example docs/index.html
  onOpen: function (element) {
    // we stop automatic scrolling when we do zoom images
    $('.carousel').carousel('pause');
  },

  onClose: function (element) {
    // we restart the carousels after closing the photo
    $('.carousel').carousel('cycle');
  },
});
```

## How to prevent zoom-in/out images

Below is an example showing how to block a click when the browser width is less than 600px
Of course, here is an example with the width of the window, but nothing prevents you from using it in a different way. The most important thing is to return the logical value - `true/false`. Each `reduction/reduction` of the window reads this variable and blocks the click.

```javascript
new Zooom('img-zoom', {
  // we set different types of cursor depending on
  // the width of the window below we pass
  // the variables for the cursor styles set
  // dynamically in the calback onResize function
  cursor: {
    in: 'var(--zoom-in)',
    out: 'var(--zoom-out)',
  },
  onResize: function () {
    // we set the page width from which it will
    // be possible to click on the image
    let responsiveMin = 600;

    // we check the width of the browser window
    const windowWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    // we return the boolean value 'true/false'
    // the value 'true' blocks clicking the image
    const widthWindow = windowWidth < responsiveMin ? true : false;

    // I set different cursors depending on the width of the window
    const root = document.documentElement;
    root.style.setProperty('--zoom-in', widthWindow ? 'default' : 'zoom-in');
    root.style.setProperty('--zoom-out', widthWindow ? 'default' : 'zoom-out');

    return widthWindow;
  },
});
```

## Browser support

Zooom supports all major browsers including IE 11 and above

## License

This project is available under the [MIT](https://opensource.org/licenses/mit-license.php) license.
