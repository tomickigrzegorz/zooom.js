import { fadeIn, fadeOut, debounce } from "./utils/function";

/**
 * @class Zooom
 */
export default class Zooom {
  private _element: string;
  private _dataAttr: string;
  private _overlayId: string;
  private _imageZooom: any;
  private _clonedImg: HTMLImageElement;
  private _zIndex: number;
  private _cursorIn?: string;
  private _cursorOut?: string;
  private _overlay?: string;
  private _animTime?: number;
  private _overlayLayer: HTMLDivElement;
  private _onResize: Function;
  private _onOpen: Function;
  private _onClose: Function;

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
    }: ConstructorObject
  ) {
    this._element = className;
    this._animTime = animationTime || 300;
    this._zIndex = zIndex || 1;
    this._dataAttr = "data-zoomed";
    this._overlayId = "zooom-overlay";
    this._overlayLayer = document.createElement("div");
    this._clonedImg = document.createElement("img");

    // callback function
    this._onResize = onResize;
    this._onOpen = onOpen;
    this._onClose = onClose;

    this._overlay = overlay;

    // create cursor
    this._cursorType(cursor);

    // create overlay
    // this.overlayConfig(overlay);

    // creating overlay layer and adding to body
    this._overlayLayer.id = this._overlayId;
    document.body.appendChild(this._overlayLayer);

    // add to all image data attribute false
    [].slice
      .call(document.querySelectorAll(`.${className}`))
      .map((element: HTMLElement) => {
        element.setAttribute("data-zoomed", "false");
      });

    // add event listener
    this._eventHandle();

    // create style and add to head
    this._createStyleAndAddToHead();
  }

  /**
   * @method eventHandle - add event listener
   */
  _eventHandle = () => {
    window.addEventListener(
      "resize",
      debounce(() => this._event(), 70)
    );

    window.addEventListener("DOMContentLoaded", this._event);
  };

  /**
   * @method event - scroll, resize, click event
   */
  _event = () => {
    ["scroll", "resize", "click"].map((type) => {
      if (this._onResize()) {
        window.removeEventListener(
          type,
          type === "click" ? this._handleClick : this._handleEvent
        );
      } else {
        window.addEventListener(
          type,
          type === "click" ? this._handleClick : this._handleEvent
        );
      }
    });
  };

  /**
   * @method handleClick - click event
   *
   * @param {Object} cursor - cursor type
   */
  _cursorType = (
    { in: zIn, out: zOut }: ObjectCursor = { in: "zoom-in", out: "zoom-out" }
  ) => {
    this._cursorIn = `cursor: ${zIn}`;
    this._cursorOut = `cursor: ${zOut};`;
  };

  /**
   * @method handleClick - click event
   *
   * @param {Event} event - event
   */
  _handleClick = (event: any) => {
    let { target } = event;
    const dataZoomed = target.getAttribute(this._dataAttr);

    if (dataZoomed === "false") {
      const bigImage = target.getAttribute("data-zooom-big");

      if (bigImage) {
        this._loadImage(target, bigImage).then(() => {
          this._imageZooom = target;
          this._zooomInit();
          document.body.classList.remove("zooom-loading");
        });
      } else {
        this._imageZooom = target;
        this._zooomInit();
      }
    } else if (dataZoomed === "true" || target.id === this._overlayId) {
      this._handleEvent();
    }
  };

  /**
   * @method loadImage - cload image if data-zooom-big is set
   *
   * @param {HTMLImageElement} target
   * @param {String} bigImage
   */
  _loadImage = (target: HTMLImageElement, bigImage: string) => {
    return new Promise<string>((resolve, reject) => {
      let newImage = new Image();

      newImage.onload = function () {
        resolve("image loaded");
      };
      newImage.onerror = function () {
        reject(`image ${bigImage} not loaded`);
      };

      document.body.classList.add("zooom-loading");

      newImage.src = bigImage;
      target.src = newImage.src;
      target.removeAttribute("data-zooom-big");
    });
  };

  /**
   * @method handleEvent
   */
  _handleEvent = () => {
    const imagezooom = document.querySelector(`[${this._dataAttr}="true"]`);

    if (!imagezooom) return;

    // reset all style
    this._reset();

    setTimeout(() => {
      imagezooom.setAttribute(this._dataAttr, "false");
    }, this._animTime);
    // callback function onClose
    this._onClose(this._imageZooom);
    fadeOut(this._overlayLayer);
  };

  /**
   * @method createStyleAndAddToHead - create style and add to head
   */
  _createStyleAndAddToHead = () => {
    const background = `#zooom-overlay{position:fixed;pointer-events:none;width:100%;background:rgba(255,255,255,0);height:100%;top:0;justify-content:center;align-items:center;z-index:${this._zIndex};margin:auto;-webkit-transition:background ${this._animTime}ms ease-in-out;transition:background ${this._animTime}ms ease-in-out;${this._cursorOut}}`;

    const css = `.${this._element}{${
      this._cursorIn
    }};@-webkit-keyframes zooom-fade{0%{opacity:0}}@keyframes zooom-fade{0%{opacity:0}}[data-zoomed="true"]{${
      this._cursorOut
    }position:relative;z-index:${this._zIndex + 9};transition:transform ${
      this._animTime
    }ms ease-in-out;}`;

    document.head.insertAdjacentHTML(
      "beforeend",
      `<style>${css}${background}</style>`
    );
  };

  /**
   * @method zooomInit - fadein, callback function onOpen, cloneImg
   */
  _zooomInit = () => {
    this._imageZooom.setAttribute(this._dataAttr, "true");

    this._cloneImg(this._imageZooom);

    fadeIn(this._overlayLayer, this._overlay);

    // callback function
    this._onOpen(this._imageZooom);
  };

  /**
   * @method cloneImg - clone image
   *
   * @param {HTMLImageElement} image - clone image and add to overlay layer
   */
  _cloneImg = (image: HTMLImageElement) => {
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

    const img = this._clonedImg;

    img.src = src;
    img.width = width;
    img.height = height;
    img.style.top = `${top + scrollTop}px`;
    img.style.left = `${left}px`;
    img.style.width = `${width}px`;
    img.style.height = `${height}px`;
    img.className = "zooom-clone";

    document.body.appendChild(img);

    img.offsetWidth;
    img.setAttribute("data-zoomed", "true");
    img.style.position = "absolute";
    img.style.transform = `matrix(${scale},0,0,${scale},${X},${Y})`;

    // hide orginal image
    setTimeout(() => {
      this._imageZooom.style.setProperty("visibility", "hidden");
    }, 50);

    // remove image
    img.addEventListener("click", this._reset);
  };

  /**
   * @method reset - reset all style
   */
  _reset = () => {
    this._clonedImg.style.removeProperty("transform");
    setTimeout(() => {
      this._clonedImg.parentNode?.removeChild(this._clonedImg);
      this._imageZooom.style.removeProperty("visibility");
    }, this._animTime);
  };
}
