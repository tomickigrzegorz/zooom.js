## ZOOOM.JS
A simple plugin for image zoooming without dependencies. Only pure javascipt. 
Idea based on [zoom.js](https://github.com/tomik23/zooom.js)

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

props | default | require | description
---- | :-------: | :--------: | -----------
**zooomElement** | `String` | ✔ | Add a class to the image element after which the zoom will work or set `img` then all pictures on the page will be taken for zooming
**zooomWrap** | `String` | ✔ | The name of the class added to the image wrapper now `zooom-wrap`
**zooomImg** | `String` | ✔ | The name of the class added to the pictures now `zooom-img`
**zooomOverlay** | `String` | ✔ | The name of the layer, in CSS `#zooom-overlay`

JAVASCRIPT
```javascript
  const options = {
    zooomElement: 'img',
       zooomWrap: 'zooom-wrap',
        zooomImg: 'zooom-img',
    zooomOverlay: 'zooom-overlay'
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