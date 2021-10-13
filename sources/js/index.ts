class Zooom {
  private element: string;
  private dataAttr: string;
  private overlayId: string;
  private imageZooom: any;
  private clonedImg: any;
  private zIndex: number;
  private arrayEvents: Array<string>;
  private cursorIn?: string;
  private cursorOut?: string;
  private color?: string;
  private opacity?: number;
  private animTime?: number;
  private overlayLayer: HTMLDivElement;
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
    this.dataAttr = 'data-zoomed';
    this.overlayId = 'zooom-overlay';
    this.overlayLayer = document.createElement('div');
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

    // creating overlay layer and adding to body
    const over = this.overlayLayer;
    over.id = this.overlayId;
    document.body.appendChild(over);

    // add to all image data attribute false
    document.querySelectorAll(`.${this.element}`).forEach((element) => {
      element.setAttribute(this.dataAttr, 'false');
    });

    this.initial();
  }

  initial = () => {
    this.eventHandle();
    this.styleHead();
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

  debounce = (fn: Function, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  };

  handleClick = (event: any) => {
    const { target } = event;
    const dataZoomed = target.getAttribute(this.dataAttr);

    if (dataZoomed === 'false') {
      this.imageZooom = target;
      this.zooomInit();
    } else if (dataZoomed === 'true' || target.id === this.overlayId) {
      this.handleEvent();
    }
  };

  handleEvent = () => {
    const imagezooom = document.querySelector(`[${this.dataAttr}="true"]`);

    if (!imagezooom) return;

    // reset all style
    this.reset();

    setTimeout(() => {
      imagezooom.setAttribute(this.dataAttr, 'false');
    }, this.animTime);
    // callback function onClose
    this.onClose(this.imageZooom);
    this.fadeOut(this.overlayLayer);
  };

  styleHead = () => {
    const background = `#zooom-overlay{position:fixed;opacity:0;pointer-events:none;background:${this.color};width:100%;height:100%;top:0;justify-content:center;align-items:center;z-index:${this.zIndex};margin:auto;-webkit-transition:opacity ${this.animTime}ms ease-in-out;transition:opacity ${this.animTime}ms ease-in-out;${this.cursorOut}}`;

    const css = `.${this.element}{${
      this.cursorIn
    }};@-webkit-keyframes zooom-fade{0%{opacity:0}}@keyframes zooom-fade{0%{opacity:0}}[data-zoomed="true"]{${
      this.cursorOut
    }position:relative;z-index:${this.zIndex + 9};transition:transform ${
      this.animTime
    }ms ease-in-out;}`;

    document.head.insertAdjacentHTML(
      'beforeend',
      `<style>${css}${background}</style>`
    );
  };

  zooomInit = () => {
    const img = this.imageZooom;
    img.setAttribute(this.dataAttr, 'true');

    this.cloneImg(img);

    this.fadeIn(this.overlayLayer);

    // callback function
    this.onOpen(img);
  };

  fadeIn = (overlay: HTMLDivElement) => {
    overlay.className = 'zooom-overlay-in';
    overlay.style.opacity = String(this.opacity);
    overlay.style.pointerEvents = 'auto';
  };

  fadeOut = (overlay: HTMLDivElement) => {
    overlay.classList.remove('zooom-overlay-in');
    overlay.removeAttribute('style');
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
