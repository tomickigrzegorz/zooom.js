## ZOOOM.JS
A simple plugin for image zoooming without dependencies. Only pure javascipt. 
Idea based on [zoom.js](https://github.com/fat/zoom.js)

### Demo

[Live DEMO](https://tomik23.github.io/zooom.js/)

## Initialization
Before the first use, clone this repository and install node dependencies:

```yarn``` or ```npm install```

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

JAVASCRIPT
```javascript
const options = {
    element: 'img',
    padding: 80,
    overlay: {
      color: '#000',
    opacity: '.5'
    }
}

  new Zooom(options);
```

## Browser Compatibility

>Desktop:

| Browser | Version |
| :---- | :-------: |
| Chrome | 74+ |
| Opera | 58+ |
| Firefox | 66+ |
| Edge | 44+ |
| Vivaldi | 2.4+ |
| IE | 10+ |

>Mobile:

| Browser | Version |
| :---- | :-------: |
| MI Android | 10.6+ |
| Chrome | 74+ |
| Firefox | 66+ |
| Opera | 51+ |
| Ege | 42+ |

## License
This project is available under the [MIT](https://opensource.org/licenses/mit-license.php) license.