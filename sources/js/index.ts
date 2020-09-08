class Zooom {
  private element: string;
  private dataZoomed: string;
  private overlayZoomed: string;
  private imageZooom: any;
  private zIndex: number;
  private cursorIn?: string;
  private cursorOut?: string;
  private color?: string;
  private opacity?: number;
  private animTime?: number;
  private overlayEl: HTMLDivElement;
  private onLoaded: Function;
  private onCleared: Function;

  constructor(
    className: string,
    {
      zIndex,
      animationTime,
      cursor,
      overlay,
      onLoaded = () => { },
      onCleared = () => { }
    }: ConstructorObject = {}
  ) {

    this.element = className;
    this.animTime = this.isNumber(animationTime, 300);
    this.zIndex = this.isNumber(zIndex, 1);
    this.dataZoomed = 'data-zoomed';
    this.overlayZoomed = 'zooom-overlay';
    this.overlayEl = document.createElement('div');

    // callback function
    this.onLoaded = onLoaded;
    this.onCleared = onCleared;

    // create cursor
    this.cursorType(cursor);

    // create overlay
    this.overlayConfig(overlay);

    this.initial();
  }

  overlayConfig = ({ color, opacity }: ObjectOverlay = { color: '#fff', opacity: 100 }) => {
    this.color = color;
    this.opacity = opacity ? Math.floor(opacity) >= 100 ? 1 : Math.floor(opacity) / 100 : 1;
  }

  // set cursor type
  cursorType = (type: ObjectCursor) => {
    this.cursorIn = `cursor: ${type === undefined ? 'zoom-in' : type.in};`;
    this.cursorOut = `cursor: ${type === undefined ? 'zoom-out' : type.out};`;
  }

  initial = () => {
    this.headStyle();
    this.ceateOverlay();
    this.setAttr();

    this.overlayType('in');
    this.overlayType('out');

    document.addEventListener('click', this.handleClick, false);
    window.addEventListener('scroll', this.handleEvent, false);

    const handleresize = this.debounce(this.handleEvent, 100);
    window.addEventListener('resize', handleresize);
  }

  setAttr = () => {
    const zoomedElements = document.querySelectorAll(`.${this.element}`);
    for (let i = 0; i < zoomedElements.length; i++) {
      zoomedElements[i].setAttribute(this.dataZoomed, 'false');
    }
  }

  isNumber = (element: any, num: number) => {
    return element === undefined
      ? num
      : typeof element === 'string' ? +element : element;
  }

  debounce = (func: any, wait: number) => {
    let timeout: any;
    return function executedFunction(...args: any[]) {
      const later = () => {
        timeout = null;
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  handleClick = (event: { target: any; }) => {
    const { target } = event;
    const dataZoomed = target.getAttribute(this.dataZoomed);
    this.imageZooom = target;
    if (dataZoomed === 'false') {
      this.zooomInit();
    } else if (dataZoomed === 'true' || target.id === this.overlayZoomed) {
      this.handleEvent();
    }
  }

  handleEvent = () => {
    const imagezooom = document.querySelector(`[${this.dataZoomed}="true"]`);
    if (!imagezooom) return;
    imagezooom.removeAttribute('style');

    setTimeout(() => {
      imagezooom.setAttribute(this.dataZoomed, 'false');
    }, this.animTime);
    this.onCleared(this.imageZooom);
    this.fadeOut();
  }

  headStyle = () => {
    const css = `.${this.element}{${this.cursorIn}};@-webkit-keyframes zooom-fade{0%{opacity:0}}@keyframes zooom-fade{0%{opacity:0}}[data-zoomed="true"]{${this.cursorOut}position:relative;z-index:${this.zIndex + 9};transition:transform ${this.animTime}ms ease-in-out;}#zooom-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background-color:${this.color};z-index:${this.zIndex};${this.cursorOut}}`;
    this.createStyle(css);
  }

  createStyle = (css: string) => {
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
    this.overlayEl.id = this.overlayZoomed;
    this.overlayEl.style.display = 'none';
    document.body.appendChild(this.overlayEl);
  }

  fadeIn = () => {
    this.overlayEl.className = 'zooom-overlay-in';
    this.overlayEl.removeAttribute('style');
  }

  fadeOut = () => {
    this.overlayEl.classList.add('zooom-overlay-out');
    setTimeout(() => {
      this.overlayEl.classList.remove('zooom-overlay-in');
      this.overlayEl.style.display = 'none';
    }, this.animTime);
  }

  overlayType = (type: string) => {
    const from = type == 'in' ? 0 : this.opacity;
    const to = type == 'in' ? this.opacity : 0;
    const css = `.zooom-overlay-${type}{-webkit-animation: show-${type} ${this.animTime}ms ease-${type} forwards;animation: show-${type} ${this.animTime}ms ease-${type} forwards;}@keyframes show-${type}{from{opacity:${from};}to{opacity:${to}}}@-webkit-keyframes show-${type}{from{opacity:${from};}to{opacity:${to}}}`;
    this.createStyle(css);
  }

  imageScale = ({ naturalWidth, naturalHeight, clientWidth, clientHeight }: ImageParameters) => {
    const { left, top } = this.imageZooom.getBoundingClientRect();

    const maxScale = naturalWidth / clientWidth;
    const winnerHeight = window.innerHeight;
    const cWidth = document.documentElement.clientWidth;

    const viewportHeight = winnerHeight;
    const viewportWidth = cWidth;

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

    this.imageZooom.setAttribute(
      'style',
      `transform: translate(${translate.x}px, ${translate.y}px) scale(${imageScale}) translateZ(0);`
    );
  }
}

export default Zooom;
