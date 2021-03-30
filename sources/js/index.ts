class Zooom {
  private element: string;
  private dataZoomed: string;
  private overlayZoomed: string;
  private imageZooom: any;
  private clonedImg: any;
  private zIndex: number;
  private cursorIn?: string;
  private cursorOut?: string;
  private color?: string;
  private opacity?: number;
  private animTime?: number;
  private overlay: HTMLDivElement;
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
    this.overlay = document.createElement('div');

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
  cursorType = ({ in: zIn, out: zOut }: ObjectCursor = { in: 'zoom-in', out: 'zoom-out' }) => {
    this.cursorIn = `cursor: ${zIn}`;
    this.cursorOut = `cursor: ${zOut};`;
  }

  initial = () => {
    this.headStyle();
    this.createOverlay();
    this.setAttr();

    this.overlayType('in');
    this.overlayType('out');

    const debounce = this.debounce(this.handleEvent, 30);

    document.addEventListener('click', this.handleClick);
    window.addEventListener('scroll', this.handleEvent);
    window.addEventListener('resize', debounce);
  }

  setAttr = () => {
    const zoomedElements = document.querySelectorAll(`.${this.element}`);
    for (let i = 0; i < zoomedElements.length; i++) {
      zoomedElements[i].setAttribute(this.dataZoomed, 'false');
    }
  }

  isNumber = (element: number | undefined, num: number) => {
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

  handleClick = (event: any) => {
    const { target } = event;
    const dataZoomed = target.getAttribute(this.dataZoomed);

    if (dataZoomed === 'false') {
      this.imageZooom = target;
      this.zooomInit();
    } else if (dataZoomed === 'true' || target.id === this.overlayZoomed) {
      this.handleEvent();
    }
  }

  handleEvent = () => {
    const imagezooom = document.querySelector(`[${this.dataZoomed}="true"]`);

    if (!imagezooom) return;

    // reset all style
    this.reset();

    setTimeout(() => {
      imagezooom.setAttribute(this.dataZoomed, 'false');
    }, this.animTime);
    // callback function onCleared
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

    this.cloneImg(this.imageZooom);

    this.fadeIn();

    // callback function
    this.onLoaded(this.imageZooom);
  }

  createOverlay = () => {
    this.overlay.id = this.overlayZoomed;
    this.overlay.style.display = 'none';
    document.body.appendChild(this.overlay);
  }

  fadeIn = () => {
    this.overlay.className = 'zooom-overlay-in';
    this.overlay.removeAttribute('style');
  }

  fadeOut = () => {
    this.overlay.classList.add('zooom-overlay-out');
    setTimeout(() => {
      this.overlay.classList.remove('zooom-overlay-in');
      this.overlay.style.display = 'none';
    }, this.animTime);
  }

  overlayType = (type: string) => {
    const from = type == 'in' ? 0 : this.opacity;
    const to = type == 'in' ? this.opacity : 0;
    const css = `.zooom-overlay-${type}{-webkit-animation: show-${type} ${this.animTime}ms ease-${type} forwards;animation: show-${type} ${this.animTime}ms ease-${type} forwards;}@keyframes show-${type}{from{opacity:${from};}to{opacity:${to}}}@-webkit-keyframes show-${type}{from{opacity:${from};}to{opacity:${to}}}}`;
    this.createStyle(css);
  }

  cloneImg = (image: HTMLImageElement) => {
    const src = image.currentSrc || image.src;
    let { width, height, left, top } = image.getBoundingClientRect();

    const { clientWidth, clientHeight, offsetWidth, scrollTop } = document.documentElement;

    const scroll = clientWidth - offsetWidth;

    this.clonedImg = document.createElement('img');

    const X = (clientWidth - scroll) / 2 - left - width / 2;
    const Y = -top + (clientHeight - height) / 2;

    const ratio = height / width;

    let maxWidth = image.naturalWidth;
    maxWidth >= clientWidth && (maxWidth = clientWidth);
    const maxHeight = maxWidth * ratio;
    maxHeight >= clientHeight && (maxWidth = (maxWidth * clientHeight) / maxHeight);

    const scale = maxWidth !== width ? maxWidth / width : 1;

    this.clonedImg.src = src;
    this.clonedImg.width = width;
    this.clonedImg.height = height;
    this.clonedImg.style.top = `${top + scrollTop}px`;
    this.clonedImg.style.left = `${left}px`;
    this.clonedImg.style.width = `${width}px`;
    this.clonedImg.style.height = `${height}px`;
    this.clonedImg.className = 'zooom-clone';

    document.body.appendChild(this.clonedImg);

    this.clonedImg.offsetWidth;
    this.clonedImg.setAttribute('data-zoomed', 'true');
    this.clonedImg.style.position = 'absolute';
    this.clonedImg.style.transform = `matrix(${scale},0,0,${scale},${X},${Y})`;

    // hide orginal image
    setTimeout(() => {
      this.imageZooom.style.visibility = 'hidden';
    }, 50);

    // remove image
    this.clonedImg.addEventListener('click', () => {
      this.reset();
    });
  }

  // reset all style
  reset = () => {
    this.clonedImg.style.removeProperty('transform');
    setTimeout(() => {
      this.clonedImg.parentNode?.removeChild(this.clonedImg);
      this.imageZooom.removeAttribute('style');
    }, this.animTime);
  }
}

export default Zooom;
