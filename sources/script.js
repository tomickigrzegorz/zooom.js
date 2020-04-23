class Zooom {
  constructor(options) {
    this.element = options.element;
    this.padding = options.padding || 80;
    this.img = 'zooom-img';
    this.overlay = 'zooom-overlay';
    this.animationTiem = options.animationTiem || 300;

    if (typeof options.overlay === 'undefined') {
      this.color = '#fff';
      this.opacity = '1';
    } else {
      const { color, opacity } = options.overlay;
      this.color = color;
      this.opacity = opacity;
    }
    this.createZoomStyle();
    this.overlayAdd();
    this.addEventImageInit();
  }

  addEventImageInit() {
    const element = document.getElementById(this.overlay);
    const imageList = document.querySelectorAll(`.${this.element}`);
    for (let i = 0; i < imageList.length; i++) {
      imageList[i].addEventListener('click', e => {
        e.preventDefault();
        this.imageZooom = e.currentTarget;
        this.zooomInit(element);
      });
    }
    element.addEventListener('click', () => {
      const zooomImg = document.querySelector(`.${this.img}`);
      this.removeImageStyle(zooomImg);
    });
  }

  createZoomStyle() {
    const css = document.createElement('style');

    css.innerHTML = `.${this.element}{cursor:zoom-in};@-webkit-keyframes zooom-fade{0% {opacity:0}} @keyframes zooom-fade{0%{opacity:0}}.zooom-img{position:relative;z-index: 1;cursor: zoom-out;transition: all ${this.animationTiem}ms}#zooom-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:1;cursor:zoom-out;}`;
    document.getElementsByTagName('head')[0].appendChild(css);
  }

  removeImageStyle(element) {
    element.removeAttribute('style');
    setTimeout(() => {
      element.classList.remove(this.img);
    }, this.animationTiem);

    this.fadeOut(element);
  }

  zooomInit(element) {
    const zooomImg = document.querySelector(`.${this.img}`);
    if (zooomImg === null) {
      this.imageZooom.classList.add(this.img);
      this.imageScale(this.imageProperty());
      this.fadeIn(element);
    } else {
      this.removeImageStyle(zooomImg);
    }

    window.addEventListener('scroll', () => {
      const imagezooom = document.querySelector(`.${this.img}`);
      if (imagezooom !== null) {
        this.removeImageStyle(imagezooom);
      }
    });
  }

  overlayAdd() {
    const overlay = document.createElement('div');
    overlay.id = this.overlay;
    overlay.setAttribute(
      'style',
      `background-color: ${this.color}; display: none;`
    );
    document.body.appendChild(overlay);
  }

  fadeIn(el) {
    let op = 0;
    const { opacity } = this;

    function fade() {
      if (op < opacity) {
        op += 0.1;
      }
      el.style.opacity = op;
      el.style.display = 'block';
      if (op < opacity) {
        requestAnimationFrame(fade);
      } else {
        cancelAnimationFrame(fade);
      }
    }
    requestAnimationFrame(fade);
  }

  fadeOut() {
    const el = document.getElementById(`${this.overlay}`);

    let { opacity } = this;

    function fade() {
      if (opacity > 0.1) {
        opacity -= 0.1;
      }

      el.style.opacity = opacity;
      if (opacity > 0.1) {
        requestAnimationFrame(fade);
      } else {
        el.style.opacity = 0;
        el.style.display = 'none';
        cancelAnimationFrame(fade);
      }
    }
    requestAnimationFrame(fade);
  }

  imageProperty() {
    return {
      targetWidth: this.imageZooom.clientWidth,
      targetHeight: this.imageZooom.clientHeight,
      imageWidth: this.imageZooom.naturalWidth,
      imageHeight: this.imageZooom.naturalHeight,
    };
  }

  imageScale({ imageWidth, imageHeight, targetWidth, targetHeight }) {
    const rect = this.imageZooom.getBoundingClientRect();
    const maxScale = imageWidth / targetWidth;
    const winnerHeight = window.innerHeight;
    const cWidth = document.documentElement.clientWidth;

    const viewportHeight = winnerHeight - this.padding;
    const viewportWidth = cWidth - this.padding;

    const imageApectRatio = imageWidth / imageHeight;
    const vieportAspectRatio = viewportWidth / viewportHeight;

    const imageCenter = {
      x: rect.left + targetWidth / 2,
      y: rect.top + targetHeight / 2,
    };

    const viewport = {
      x: cWidth / 2,
      y: winnerHeight / 2,
    };

    const translate = {
      x: viewport.x - imageCenter.x,
      y: viewport.y - imageCenter.y,
    };

    let imageScale = 1;

    if (imageWidth < viewportWidth && imageHeight < viewportHeight) {
      imageScale = maxScale;
    } else if (imageApectRatio < vieportAspectRatio) {
      imageScale = (viewportHeight / imageHeight) * maxScale;
    } else {
      imageScale = (viewportWidth / imageWidth) * maxScale;
    }

    if (imageScale <= 1) {
      imageScale = 1;
    }

    this.imageZooom.setAttribute(
      'style',
      `transform: translate(${translate.x}px, ${translate.y}px) scale(${imageScale}) translateZ(0);`
    );
  }
}

export default Zooom;
