import './style.scss';

class Zooom {
  constructor(options) {
    this.element = options.element;
    this.padding = options.padding || 80;
    this.img = 'zooom-img';
    this.overlay = 'zooom-overlay';

    if (typeof options.overlay === 'undefined') {
      this.color = '#fff';
      this.opacity = '1';
    } else {
      const { color, opacity } = options.overlay;
      this.color = color;
      this.opacity = opacity;
    }
    this.addEventImageInit();
  }

  addEventImageInit() {
    this.overlayAdd();

    const imageList = document.querySelectorAll(this.element);
    imageList.forEach(image => {
      image.addEventListener('click', e => {
        e.stopPropagation();
        this.imageZooom = e.currentTarget;
        // init zooom image
        this.zooomInit();
        this.fadeIn();
      });
    });
  }

  removeImageStyle(element) {
    element.removeAttribute('style');
    setTimeout(() => {
      element.classList.remove(this.img);
    }, 300);
    this.fadeOut();
  }

  zooomInit() {
    const wrapZooom = document.querySelector(`.${this.img}`);
    if (wrapZooom === null) {
      this.imageZooom.classList.add(this.img);
      this.imageScale(this.imageProperty());
    } else {
      this.removeImageStyle(wrapZooom);
    }

    window.addEventListener(
      'scroll',
      () => {
        const test = document.querySelector(`.${this.img}`);
        if (test !== null) {
          this.removeImageStyle(test);
          window.removeEventListener('scroll', this.removeImageStyle, true);
        }
      },
      true
    );
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

  fadeOut() {
    const element = document.getElementById(this.overlay);
    if (element) {
      element.style.opacity = this.opacity;
      (function fade() {
        // eslint-disable-next-line no-cond-assign
        if ((element.style.opacity -= 0.1) < 0) {
          element.style.display = 'none';
        } else {
          requestAnimationFrame(fade);
        }
      })();
    }
  }

  fadeIn() {
    const element = document.getElementById(this.overlay);
    element.style.opacity = this.opacity;
    element.style.display = 'block';
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

    const viewportHeight = window.innerHeight - this.padding;
    const viewportWidth = document.documentElement.clientWidth - this.padding;

    const imageApectRatio = imageWidth / imageHeight;
    const vieportAspectRatio = viewportWidth / viewportHeight;

    const viewportY = window.innerHeight / 2;
    const viewportX = document.documentElement.clientWidth / 2;

    const imageCenterY = rect.top + targetHeight / 2;
    const imageCenterX = rect.left + targetWidth / 2;

    const translateY = viewportY - imageCenterY;
    const translateX = viewportX - imageCenterX;

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
      `transform: translate(${translateX}px, ${translateY}px) scale(${imageScale}) translateZ(0);`
    );
  }
}

export default Zooom;
