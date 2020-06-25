class Zooom {
  constructor(className, { padding, zIndex, animationTime, cursor, overlay }) {
    this.className = className;
    this.padding = padding || 80;
    this.zIndex = zIndex || 1;
    this.animationTime = animationTime || 300;
    this.dataZoomed = 'data-zoomed';
    this.overlay = 'zooom-overlay';
    this.cursorIn = 'cursor: zoom-in;';
    this.cursorOut = 'cursor: zoom-out;';
    this.color = '#fff';
    this.opacity = 1;

    if (cursor) {
      this.cursorIn = `cursor: ${cursor.cursorIn};`;
      this.cursorOut = `cursor: ${cursor.cursorOut};`;
    }

    if (overlay) {
      const opacity = Math.floor(overlay.opacity);
      this.color = overlay.color;
      this.opacity = opacity > 100 ? 1 : opacity / 100;
    }

    this.createZoomStyle();
    this.setDefaultAttributeZoomed();
  }

  setDefaultAttributeZoomed() {
    const zoomedElements = document.querySelectorAll(`.${this.className}`);
    for (let i = 0; i < zoomedElements.length; i++) {
      zoomedElements[i].setAttribute(this.dataZoomed, false);
    }
  }

  addEventImageInit() {
    document.addEventListener('click', (e) => {
      e.preventDefault();
      const { target } = e;

      if (target.getAttribute(this.dataZoomed) === 'false') {
        this.imageZooom = target;
        this.zooomInit();
      } else if (target.getAttribute(this.dataZoomed) === 'true') {
        this.removeImageStyle();
      }
      if (target.id === this.overlay) {
        this.removeImageStyle();
      }
    });

    window.addEventListener('scroll', () => {
      const imagezooom = document.querySelector(`[${this.dataZoomed}="true"]`);
      if (imagezooom) this.removeImageStyle();
    });
  }

  createZoomStyle() {
    const style = document.createElement('style');
    const css = `.${this.className}{${this.cursorIn}};@-webkit-keyframes zooom-fade{0%{opacity:0}}@keyframes zooom-fade{0%{opacity:0}}[data-zoomed="true"]{position:relative;z-index:${this.zIndex + 9};${this.cursorOut}transition: transform ${this.animationTime}ms ease-in-out}#zooom-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:${this.zIndex};${this.cursorOut}}`;

    style.innerHTML = css;
    document.head.appendChild(style);

    this.ceateOverlayAndAdd();
  }

  removeImageStyle() {
    const elementZoomed = document.querySelector(`[${this.dataZoomed}="true"]`);
    elementZoomed.removeAttribute('style');
    setTimeout(() => {
      elementZoomed.setAttribute(this.dataZoomed, false);
      this.fadeOut();
    }, this.animationTime);
  }

  zooomInit() {
    this.imageZooom.setAttribute(this.dataZoomed, true);
    this.imageScale(this.imageZooom);
    this.fadeIn();
  }

  ceateOverlayAndAdd() {
    this.overlayd = document.createElement('div');
    this.overlayd.id = this.overlay;
    this.overlayd.setAttribute(
      'style',
      `background-color: ${this.color}; display: none;`
    );
    document.body.appendChild(this.overlayd);

    this.addEventImageInit();
  }

  fadeIn() {
    let op = 0;
    const { opacity, overlay } = this;

    function fade() {
      const overlayElement = document.getElementById(overlay);

      if (op < opacity) {
        op += 0.1;
      }

      overlayElement.style.opacity = op >= 1 ? 1 : op - 0.1;
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
      if (op >= 0.1) {
        op -= 0.9;
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
