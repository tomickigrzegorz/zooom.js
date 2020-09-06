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

  initial = () => {
    this.createZoomStyle();
    this.ceateOverlay();
    this.setDefaultAttr();

    this.createStyleOverlay('in');
    this.createStyleOverlay('out');

    document.addEventListener('click', this.handleClick, false);
    window.addEventListener('scroll', this.handleScroll, false);

    const handleresize = this.debounce(this.handleResize, 100);
    window.addEventListener('resize', handleresize);
  }

  setDefaultAttr = () => {
    const zoomedElements = document.querySelectorAll(`.${this.className}`);
    for (let i = 0; i < zoomedElements.length; i++) {
      zoomedElements[i].setAttribute(this.dataZoomed, false);
    }
  }

  debounce = (func, wait) => {
    let timeout;
    return function exFunction(...args) {
      const later = () => {
        timeout = null;
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  handleClick = (event) => {
    const { target } = event;
    const dataZoomed = target.getAttribute(this.dataZoomed);
    this.imageZooom = target;
    if (dataZoomed === 'false') {
      this.zooomInit();
    } else if (dataZoomed === 'true' || target.id === this.overlay) {
      this.handleResize();
    }
  }

  handleScroll = (event) => {
    const imagezooom = document.querySelector(`[${this.dataZoomed}="true"]`);
    if (!imagezooom) return;
    this.handleResize();
  }

  handleResize = () => {
    const elementZoomed = document.querySelector(`[${this.dataZoomed}="true"]`);
    if (!elementZoomed) return;
    elementZoomed.removeAttribute('style');

    setTimeout(() => {
      elementZoomed.setAttribute(this.dataZoomed, 'false');
    }, this.animationTime);
    this.onCleared(this.imageZooom);
    this.fadeOut();
  }

  createZoomStyle = () => {
    const css = `.${this.className}{${this.cursorIn}};@-webkit-keyframes zooom-fade{0%{opacity:0}}@keyframes zooom-fade{0%{opacity:0}}[data-zoomed="true"]{${this.cursorOut}position:relative;z-index:${this.zIndex + 9};transition:transform ${this.animationTime}ms ease-in-out;}#zooom-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background-color:${this.color};z-index:${this.zIndex};${this.cursorOut}}`;
    this.createStyle(css);
  }

  createStyle = (css) => {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  zooomInit = () => {
    this.imageZooom.setAttribute(this.dataZoomed, 'true');
    this.fadeIn();
    this.imageScale(this.imageZooom);
    this.onLoaded(this.imageZooom);
  }

  ceateOverlay = () => {
    this.overlayd = document.createElement('div');
    this.overlayd.id = this.overlay;
    this.overlayd.style.display = 'none';
    document.body.appendChild(this.overlayd);
  }

  fadeIn = () => {
    this.overlayd.className = 'zooom-overlay-in';
    this.overlayd.removeAttribute('style');
  }

  fadeOut = () => {
    this.overlayd.classList.add('zooom-overlay-out');
    setTimeout(() => {
      this.overlayd.classList.remove('zooom-overlay-in');
      this.overlayd.style.display = 'none';
    }, this.animationTime);
  }

  createStyleOverlay = (type) => {
    const from = type == 'in' ? 0 : this.opacity;
    const to = type == 'in' ? this.opacity : 0;
    const css = `.zooom-overlay-${type}{-webkit-animation: show-${type} ${this.animationTime}ms ease-${type} forwards;animation: show-${type} ${this.animationTime}ms ease-${type} forwards;}@keyframes show-${type}{from{opacity:${from};}to{opacity:${to}}}@-webkit-keyframes show-${type}{from{opacity:${from};}to{opacity:${to}}}`;
    this.createStyle(css);
  }

  imageScale = ({ naturalWidth, naturalHeight, clientWidth, clientHeight }) => {
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
