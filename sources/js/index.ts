import { fadeIn, fadeOut, debounce } from "./utils/function";

/**
 * @class Zooom
 */
export default class Zooom {
  private _element: string;
  private _dataAttr: string;
  private _overlayId: string;
  _imageZooom: any;
  private _clonedImg: HTMLImageElement;
  private _zIndex: number;
  private _cursorIn?: string;
  private _cursorOut?: string;
  private _overlay?: string;
  _animTime?: number;
  _overlayLayer: HTMLDivElement;
  private _onResize: Function;
  private _onOpen: Function;
  private _onClose: Function;
  _allImages: HTMLElement[];
  private _plugins: ZooomPlugin[];
  private _listeners: Map<ZooomEvent, Array<(...args: any[]) => void>>;

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
    this._allImages = [];
    this._plugins = [];
    this._listeners = new Map();

    this._onResize = onResize;
    this._onOpen = onOpen;
    this._onClose = onClose;

    this._overlay = overlay;

    this._cursorType(cursor);

    this._overlayLayer.id = this._overlayId;
    document.body.appendChild(this._overlayLayer);

    this._allImages = [].slice.call(
      document.querySelectorAll(`.${className}`)
    );
    this._allImages.map((element: HTMLElement) => {
      element.setAttribute("data-zoomed", "false");
    });

    window.addEventListener("keydown", this._handleKeydown);

    this._eventHandle();
    this._createStyleAndAddToHead();
  }

  use = (plugin: ZooomPlugin): this => {
    plugin.install(this._createContext());
    this._plugins.push(plugin);
    return this;
  };

  _createContext = (): ZooomContext => {
    const self = this;
    return {
      get images() { return self._allImages; },
      get currentImage() { return self._imageZooom; },
      get animTime() { return self._animTime!; },
      get zIndex() { return self._zIndex; },
      get overlayLayer() { return self._overlayLayer; },
      on(event: ZooomEvent, handler: (...args: any[]) => void) {
        if (!self._listeners.has(event)) {
          self._listeners.set(event, []);
        }
        self._listeners.get(event)!.push(handler);
      },
      zoomIn(image: HTMLElement, instant = false) {
        self._imageZooom = image;
        self._zooomInit(instant);
      },
      zoomOut() {
        self._handleEvent();
      },
      addStyle(css: string) {
        document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
      },
      setCurrentImage(image: HTMLElement) {
        self._imageZooom = image;
      },
      setClone(img: HTMLImageElement) {
        self._clonedImg = img;
      },
      notifyOpen(image: HTMLElement) {
        self._onOpen(image);
        self._emit('open', image);
      },
      notifyClose(image: HTMLElement) {
        self._onClose(image);
        self._emit('close', image);
      },
    };
  };

  _emit = (event: ZooomEvent, ...args: any[]) => {
    (this._listeners.get(event) || []).forEach(fn => fn(...args));
  };

  _eventHandle = () => {
    window.addEventListener(
      "resize",
      debounce(() => this._event(), 70)
    );
    window.addEventListener("DOMContentLoaded", this._event);
  };

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

  _cursorType = (
    { in: zIn, out: zOut }: ObjectCursor = { in: "zoom-in", out: "zoom-out" }
  ) => {
    this._cursorIn = `cursor: ${zIn}`;
    this._cursorOut = `cursor: ${zOut};`;
  };

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

  _loadImage = (target: HTMLImageElement, bigImage: string) => {
    return new Promise<string>((resolve, reject) => {
      let newImage = new Image();
      newImage.onload = function () { resolve("image loaded"); };
      newImage.onerror = function () { reject(`image ${bigImage} not loaded`); };
      document.body.classList.add("zooom-loading");
      newImage.src = bigImage;
      target.src = newImage.src;
      target.dataset.zoooomSrc = newImage.src;
      target.removeAttribute("data-zooom-big");
    });
  };

  _handleEvent = () => {
    const imagezooom = document.querySelector(`[${this._dataAttr}="true"]`);
    if (!imagezooom) return;

    this._reset();

    setTimeout(() => {
      imagezooom.setAttribute(this._dataAttr, "false");
    }, this._animTime);

    this._onClose(this._imageZooom);
    this._emit('close', this._imageZooom);
    fadeOut(this._overlayLayer);
  };

  _handleKeydown = (event: KeyboardEvent) => {
    const isZoomed = !!document.querySelector(`[${this._dataAttr}="true"]`);
    if (!isZoomed) return;
    this._emit('keydown', event);
    if (event.key === "Escape") this._handleEvent();
  };

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
      `<style>html{scrollbar-gutter:stable}${css}${background}</style>`
    );
  };

  _zooomInit = (instant = false) => {
    document.body.style.overflow = "hidden";
    this._imageZooom.setAttribute(this._dataAttr, "true");
    this._cloneImg(this._imageZooom, instant);
    fadeIn(this._overlayLayer, this._overlay);
    this._onOpen(this._imageZooom);
    this._emit('open', this._imageZooom);
  };

  _cloneImg = (image: HTMLImageElement, instant = false) => {
    this._clonedImg = document.createElement("img");
    let src = image.dataset.zoooomSrc || image.currentSrc || image.src;

    let { width, height, left, top } = image.getBoundingClientRect();

    const { clientWidth, clientHeight, offsetWidth } = document.documentElement;

    const scroll = clientWidth - offsetWidth;

    const X = (clientWidth - scroll) / 2 - left - width / 2;
    const Y = -top + (clientHeight - height) / 2;

    const ratio = height / width;

    let maxWidth = image.naturalWidth
      || parseInt(image.getAttribute("width") ?? "0")
      || width;

    maxWidth >= clientWidth && (maxWidth = clientWidth);
    const maxHeight = maxWidth * ratio;
    maxHeight >= clientHeight &&
      (maxWidth = (maxWidth * clientHeight) / maxHeight);

    const scale = maxWidth !== width ? maxWidth / width : 1;

    const img = this._clonedImg;

    img.src = src;
    img.width = width;
    img.height = height;
    // position:fixed — not clipped by body{overflow:hidden} during animation
    img.style.position = "fixed";
    img.style.top = `${top}px`;
    img.style.left = `${left}px`;
    img.style.width = `${width}px`;
    img.style.height = `${height}px`;
    img.className = "zooom-clone";

    this._imageZooom.style.setProperty("visibility", "hidden");

    document.body.appendChild(img);

    img.offsetWidth;
    img.setAttribute("data-zoomed", "true");
    if (instant) img.style.transition = "none";
    img.style.transform = `matrix(${scale},0,0,${scale},${X},${Y})`;

    // store transform info on the element for plugin use
    (img as any)._zooomTransform = { scale, X, Y, isFixed: true };
  };

  _reset = () => {
    const cloneToRemove = this._clonedImg;
    const originalImg = this._imageZooom;
    const t = this._animTime;

    // _cloneImg sets _zooomTransform on the clone — present only for the initial zoom,
    // not for plugin-created clones (e.g. SliderPlugin). Use it to decide close animation.
    const hasReturnPosition = !!(cloneToRemove as any)._zooomTransform;

    if (hasReturnPosition) {
      const { top, bottom, left, right } = originalImg.getBoundingClientRect();
      const { clientHeight, clientWidth } = document.documentElement;
      const inViewport = bottom > 0 && top < clientHeight && right > 0 && left < clientWidth;

      if (inViewport) {
        cloneToRemove.style.transition = `transform ${t}ms ease-in-out`;
        cloneToRemove.style.removeProperty("transform");
      } else {
        cloneToRemove.style.transition = `opacity ${t}ms ease-in-out`;
        cloneToRemove.style.opacity = "0";
      }
    } else {
      // navigated clone — fade out in place (no return-to-origin animation)
      cloneToRemove.style.transition = `opacity ${t}ms ease-in-out`;
      cloneToRemove.style.opacity = "0";
    }

    setTimeout(() => {
      cloneToRemove.parentNode?.removeChild(cloneToRemove);
      originalImg.style.removeProperty("visibility");
      document.body.style.overflow = "";
    }, t);
  };
}
