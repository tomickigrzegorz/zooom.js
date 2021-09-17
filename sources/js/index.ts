class Zooom {
  private element: string;
  private dataZoomed: string;
  private overlayZoomed: string;
  private imageZooom: any;
  private clonedImg: any;
  private zIndex: number;
  private arrayEvents: Array<string>;
  private cursorIn?: string;
  private cursorOut?: string;
  private color?: string;
  private opacity?: number;
  private animTime?: number;
  private overlay: HTMLDivElement;
  private onResize: Function;
  private onOpen: Function;
  private onClose: Function;

  constructor(
    className: string,
    {
      zIndex,
      animationTime,
      cursor,
      overlay,
      onResize = () => {},
      onOpen = () => {},
      onClose = () => {},
    }: ConstructorObject = {}
  ) {
    this.element = className;
    this.animTime = animationTime || 300;
    this.zIndex = zIndex || 1;
    this.dataZoomed = 'data-zoomed';
    this.overlayZoomed = 'zooom-overlay';
    this.overlay = document.createElement('div');
    this.clonedImg = document.createElement('img');

    // callback function
    this.onResize = onResize;
    this.onOpen = onOpen;
    this.onClose = onClose;

    this.arrayEvents = ['scroll', 'resize', 'click'];

    // create cursor
    this.cursorType(cursor);

    // create overlay
    this.overlayConfig(overlay);

    this.initial();
  }

  initial = () => {
    this.eventHandle();

    this.styleHead();
    this.createOverlay(this.overlay);
    this.setAttr();

    this.styleOverlay();
  };

  eventHandle = () => {
    window.addEventListener(
      'resize',
      this.debounce(() => this.event(), 70)
    );

    window.addEventListener('load', this.event);
  };

  event = () => {
    this.arrayEvents.map((type) => {
      if (this.onResize()) {
        window.removeEventListener(
          type,
          type === 'click' ? this.handleClick : this.handleEvent
        );
      } else {
        // console.log('ok');
        window.addEventListener(
          type,
          type === 'click' ? this.handleClick : this.handleEvent
        );
      }
    });
  };

  overlayConfig = (
    { color, opacity }: ObjectOverlay = { color: '#fff', opacity: 100 }
  ) => {
    this.color = color;
    this.opacity = opacity
      ? Math.floor(opacity) >= 100
        ? 1
        : Math.floor(opacity) / 100
      : 1;
  };

  // set cursor type
  cursorType = (
    { in: zIn, out: zOut }: ObjectCursor = { in: 'zoom-in', out: 'zoom-out' }
  ) => {
    this.cursorIn = `cursor: ${zIn}`;
    this.cursorOut = `cursor: ${zOut};`;
  };

  setAttr = () => {
    const zoomedElements = document.querySelectorAll(`.${this.element}`);
    for (let i = 0; i < zoomedElements.length; i++) {
      zoomedElements[i].setAttribute(this.dataZoomed, 'false');
    }
  };

  debounce = (fn: Function, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  };

  handleClick = (event: any) => {
    const { target } = event;
    const dataZoomed = target.getAttribute(this.dataZoomed);

    if (dataZoomed === 'false') {
      this.imageZooom = target;
      this.zooomInit();
    } else if (dataZoomed === 'true' || target.id === this.overlayZoomed) {
      this.handleEvent();
    }
  };

  handleEvent = () => {
    const imagezooom = document.querySelector(`[${this.dataZoomed}="true"]`);

    if (!imagezooom) return;

    // reset all style
    this.reset();

    setTimeout(() => {
      imagezooom.setAttribute(this.dataZoomed, 'false');
    }, this.animTime);
    // callback function onClose
    this.onClose(this.imageZooom);
    this.fadeOut(this.overlay);
  };

  styleHead = () => {
    const css = `.${this.element}{${
      this.cursorIn
    }};@-webkit-keyframes zooom-fade{0%{opacity:0}}@keyframes zooom-fade{0%{opacity:0}}[data-zoomed="true"]{${
      this.cursorOut
    }position:relative;z-index:${this.zIndex + 9};transition:transform ${
      this.animTime
    }ms ease-in-out;}#zooom-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background-color:${
      this.color
    };z-index:${this.zIndex};${this.cursorOut}}`;

    this.createStyle(css);
  };

  createStyle = (css: string) => {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  };

  zooomInit = () => {
    const img = this.imageZooom;
    img.setAttribute(this.dataZoomed, 'true');

    this.cloneImg(img);

    this.fadeIn(this.overlay);

    // callback function
    this.onOpen(img);
  };

  createOverlay = (overlay: HTMLDivElement) => {
    overlay.id = this.overlayZoomed;
    overlay.style.display = 'none';
    document.body.appendChild(overlay);
  };

  fadeIn = (overlay: HTMLDivElement) => {
    overlay.className = 'zooom-overlay-in';
    overlay.removeAttribute('style');
  };

  fadeOut = (overlay: HTMLDivElement) => {
    overlay.classList.add('zooom-overlay-out');
    setTimeout(() => {
      overlay.classList.remove('zooom-overlay-in');
      overlay.style.display = 'none';
    }, this.animTime);
  };

  styleOverlay = () => {
    ['in', 'out'].map((type) => {
      const from = type == 'in' ? 0 : this.opacity;
      const to = type == 'in' ? this.opacity : 0;
      const css = `.zooom-overlay-${type}{-webkit-animation: show-${type} ${this.animTime}ms ease-${type} forwards;animation: show-${type} ${this.animTime}ms ease-${type} forwards;}@keyframes show-${type}{from{opacity:${from};}to{opacity:${to}}}@-webkit-keyframes show-${type}{from{opacity:${from};}to{opacity:${to}}}}`;

      this.createStyle(css);
    });
  };

  cloneImg = (image: HTMLImageElement) => {
    const src = image.currentSrc || image.src;
    let { width, height, left, top } = image.getBoundingClientRect();

    const { clientWidth, clientHeight, offsetWidth } = document.documentElement;

    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    const scroll = clientWidth - offsetWidth;

    const X = (clientWidth - scroll) / 2 - left - width / 2;
    const Y = -top + (clientHeight - height) / 2;

    const ratio = height / width;

    let maxWidth = image.naturalWidth;
    maxWidth >= clientWidth && (maxWidth = clientWidth);
    const maxHeight = maxWidth * ratio;
    maxHeight >= clientHeight &&
      (maxWidth = (maxWidth * clientHeight) / maxHeight);

    const scale = maxWidth !== width ? maxWidth / width : 1;

    const img = this.clonedImg;

    img.src = src;
    img.width = width;
    img.height = height;
    img.style.top = `${top + scrollTop}px`;
    img.style.left = `${left}px`;
    img.style.width = `${width}px`;
    img.style.height = `${height}px`;
    img.className = 'zooom-clone';

    document.body.appendChild(img);

    img.offsetWidth;
    img.setAttribute('data-zoomed', 'true');
    img.style.position = 'absolute';
    img.style.transform = `matrix(${scale},0,0,${scale},${X},${Y})`;

    // hide orginal image
    setTimeout(() => {
      this.imageZooom.style.visibility = 'hidden';
    }, 50);

    // remove image
    img.addEventListener('click', this.reset);
  };

  // reset all style
  reset = () => {
    const img = this.clonedImg;
    img.style.removeProperty('transform');
    setTimeout(() => {
      img.parentNode?.removeChild(img);
      this.imageZooom.removeAttribute('style');
    }, this.animTime);
  };
}

export default Zooom;
