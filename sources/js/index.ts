import { fadeIn, fadeOut, debounce } from './utils/function';

/**
 * @class Zooom
 */
class Zooom {
  private element: string;
  private dataAttr: string;
  private overlayId: string;
  private imageZooom: any;
  private clonedImg: HTMLImageElement;
  private zIndex: number;
  private cursorIn?: string;
  private cursorOut?: string;
  private color?: string;
  private opacity?: number;
  private animTime?: number;
  private overlayLayer: HTMLDivElement;
  private onResize: Function;
  private onOpen: Function;
  private onClose: Function;

  /**
   * @constructor
   *
   * @param className
   * @param object
   */
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

    // create cursor
    this.cursorType(cursor);

    // create overlay
    this.overlayConfig(overlay);

    // creating overlay layer and adding to body
    const over = this.overlayLayer;
    over.id = this.overlayId;
    document.body.appendChild(over);

    // add to all image data attribute false
    [].slice
      .call(document.querySelectorAll(`.${className}`))
      .map((element: HTMLElement) => {
        element.setAttribute('data-zoomed', 'false');
      });

    // add event listener
    this.eventHandle();

    // create style and add to head
    this.styleHead();
  }

  /**
   * @method eventHandle - add event listener
   */
  eventHandle = () => {
    window.addEventListener(
      'resize',
      debounce(() => this.event(), 70)
    );

    window.addEventListener('load', this.event);
  };

  /**
   * @method event - scroll, resize, click event
   */
  event = () => {
    ['scroll', 'resize', 'click'].map((type) => {
      if (this.onResize()) {
        window.removeEventListener(
          type,
          type === 'click' ? this.handleClick : this.handleEvent
        );
      } else {
        window.addEventListener(
          type,
          type === 'click' ? this.handleClick : this.handleEvent
        );
      }
    });
  };

  /**
   *
   * @param object - color and opacity
   */
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

  /**
   * @param event
   */
  handleClick = (event: any) => {
    let { target } = event;
    const dataZoomed = target.getAttribute(this.dataAttr);

    if (dataZoomed === 'false') {
      const bigImage = target.getAttribute('data-zooom-big');

      if (bigImage) {
        this.loadImage(target, bigImage).then(() => {
          this.imageZooom = target;
          this.zooomInit();
          document.body.classList.remove('zooom-loading');
        });
      } else {
        this.imageZooom = target;
        this.zooomInit();
      }
    } else if (dataZoomed === 'true' || target.id === this.overlayId) {
      this.handleEvent();
    }
  };

  loadImage = (target: HTMLImageElement, bigImage: string) => {
    return new Promise<string>((resolve, reject) => {
      let newImage = new Image();

      newImage.onload = function () {
        resolve('image loaded');
      };
      newImage.onerror = function () {
        reject(`image ${bigImage} not loaded`);
      };

      document.body.classList.add('zooom-loading');

      newImage.src = bigImage;
      target.src = newImage.src;
      target.removeAttribute('data-zooom-big');
    });
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
    fadeOut(this.overlayLayer);
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

  /**
   * @method zooomInit - fadein, callback function onOpen, cloneImg
   */
  zooomInit = () => {
    const img = this.imageZooom;
    img.setAttribute(this.dataAttr, 'true');

    this.cloneImg(img);

    fadeIn(this.overlayLayer, this.opacity);

    // callback function
    this.onOpen(img);
  };

  /**
   *
   * @param image - clone image and add to overlay layer
   */
  cloneImg = (image: HTMLImageElement) => {
    let src = image.currentSrc || image.src;

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

  /**
   * reset all style from image
   */
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
