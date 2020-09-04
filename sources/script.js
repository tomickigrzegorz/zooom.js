class Zooom {
  constructor(
    className,
    {
      padding,
      zIndex,
      animationTime,
      cursor,
      overlay,
      onLoaded = () => { },
      onCleared = () => { }
    }
  ) {
    this.className = className;
    this.padding = padding || 80;
    this.zIndex = zIndex || 1;
    this.animationTime = animationTime || 300;
    this.dataZoomed = 'data-zoomed';
    this.overlay = 'zooom-overlay';
    this.onLoaded = onLoaded;
    this.onCleared = onCleared;

    if (cursor) {
      this.cursorIn = `cursor: ${cursor.in};`;
      this.cursorOut = `cursor: ${cursor.out};`;
    } else {
      this.cursorIn = 'cursor: zoom-in;';
      this.cursorOut = 'cursor: zoom-out;';
    }

    if (overlay) {
      const opacity = Math.floor(overlay.opacity);
      this.color = overlay.color;
      this.opacity = opacity > 100 ? 1 : opacity / 100;
    } else {
      this.color = '#fff';
      this.opacity = 1;
    }

    this.initial();
  }

  initial() {
    this.createZoomStyle();
    this.setDefaultAttr();
    this.ceateOverlay();

    document.addEventListener('click', this.addEventImageInit.bind(this));

    window.addEventListener('scroll', this.scrollHandler.bind(this));

    const removeimgstyle = this.debounce(this.removeImgStyle.bind(this), 100);
    window.addEventListener('resize', removeimgstyle);
  }

  setDefaultAttr() {
    const zoomedElements = document.querySelectorAll(`.${this.className}`);
    for (let i = 0; i < zoomedElements.length; i++) {
      zoomedElements[i].setAttribute(this.dataZoomed, false);
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  addEventImageInit(event) {
    event.preventDefault();
    const { target } = event;
    const dataZoomed = target.getAttribute(this.dataZoomed);
    this.imageZooom = target;

    if (dataZoomed === 'false') {
      this.zooomInit();
    } else if (dataZoomed === 'true' || target.id === this.overlay) {
      this.removeImgStyle();
    }
  }

  scrollHandler() {
    const imagezooom = document.querySelector(`[${this.dataZoomed}="true"]`);
    if (imagezooom) this.removeImgStyle();
  }

  createZoomStyle() {
    const style = document.createElement('style');
    const css = `.${this.className}{${this.cursorIn}};@-webkit-keyframes zooom-fade{0%{opacity:0}}@keyframes zooom-fade{0%{opacity:0}}[data-zoomed="true"]{position:relative;z-index:${this.zIndex + 9};${this.cursorOut}transition: transform ${this.animationTime}ms ease-in-out}#zooom-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:${this.zIndex};${this.cursorOut}}`;

    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  removeImgStyle() {
    const elementZoomed = document.querySelector(`[${this.dataZoomed}="true"]`);
    if (!elementZoomed) return;
    elementZoomed.removeAttribute('style');
    setTimeout(() => {
      elementZoomed.setAttribute(this.dataZoomed, false);
      this.fadeOut();
    }, this.animationTime);

    this.onCleared(this.imageZooom);
  }

  zooomInit() {
    this.imageZooom.setAttribute(this.dataZoomed, true);
    this.imageScale(this.imageZooom);
    this.fadeIn();
    this.onLoaded(this.imageZooom);
  }

  ceateOverlay() {
    this.overlayd = document.createElement('div');
    this.overlayd.id = this.overlay;
    this.overlayd.setAttribute(
      'style',
      `background-color: ${this.color}; display: none;`
    );
    document.body.appendChild(this.overlayd);
  }

  fadeIn() {
    let op = 0;
    const { opacity, overlay } = this;

    const fadeInTiem = this.animationTime / 10000;

    function fade() {
      const overlayElement = document.getElementById(overlay);

      if (op < opacity) {
        op += fadeInTiem;
      }

      overlayElement.style.opacity = op >= 1 ? 1 : op - fadeInTiem;
      overlayElement.style.display = 'block';

      if (op < opacity) {
        requestAnimationFrame(fade);
      } else {
        cancelAnimationFrame(fade);
      }
    }
    requestAnimationFrame(fade);
  }

  fadeOut() {
    const { opacity, overlay } = this;
    let op = opacity;

    function fade() {
      const overlayElement = document.getElementById(overlay);
      if (op > 0) {
        op -= 0.1;
      }

      overlayElement.style.opacity = op;
      if (op >= 0.1) {
        requestAnimationFrame(fade);
      } else {
        overlayElement.style.opacity = 0;
        overlayElement.style.display = 'none';
        cancelAnimationFrame(fade);
      }
    }
    requestAnimationFrame(fade);
  }

  imageScale({ naturalWidth, naturalHeight, clientWidth, clientHeight }) {
    const { left, top } = this.imageZooom.getBoundingClientRect();

    const maxScale = naturalWidth / clientWidth;
    const winnerHeight = window.innerHeight;
    const cWidth = document.documentElement.clientWidth;

    const viewportHeight = winnerHeight - this.padding;
    const viewportWidth = cWidth - this.padding;

    const imageApectRatio = naturalWidth / naturalHeight;
    const vieportAspectRatio = viewportWidth / viewportHeight;

    const imageCenter = {
      x: left + clientWidth / 2,
      y: top + clientHeight / 2
    };

    const viewport = {
      x: cWidth / 2,
      y: winnerHeight / 2
    };

    const translate = {
      x: viewport.x - imageCenter.x,
      y: viewport.y - imageCenter.y,
    };

    let imageScale = 1;

    if (naturalWidth < viewportWidth && naturalHeight < viewportHeight) {
      imageScale = maxScale;
    } else if (imageApectRatio < vieportAspectRatio) {
      imageScale = (viewportHeight / naturalHeight) * maxScale;
    } else {
      imageScale = (viewportWidth / naturalWidth) * maxScale;
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
