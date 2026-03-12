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
  private _navigation: boolean;
  private _navigationEffect: 'slide' | undefined;
  private _prevBtn: HTMLButtonElement | null;
  private _nextBtn: HTMLButtonElement | null;
  private _allImages: HTMLElement[];
  private _cloneTransform: { scale: number; X: number; Y: number };
  private _cloneIsFixed: boolean;
  private _slideTimeout: ReturnType<typeof setTimeout> | null;

  constructor(
    className: string,
    {
      zIndex,
      animationTime,
      cursor,
      overlay,
      navigation = false,
      navigationEffect,
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
    this._navigation = navigation;
    this._navigationEffect = navigationEffect;
    this._prevBtn = null;
    this._nextBtn = null;
    this._allImages = [];
    this._cloneTransform = { scale: 1, X: 0, Y: 0 };
    this._cloneIsFixed = false;
    this._slideTimeout = null;

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

    if (this._navigation) {
      this._createNavigation();
      window.addEventListener("keydown", this._handleKeydown);
    }

    this._eventHandle();
    this._createStyleAndAddToHead();
  }

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
    fadeOut(this._overlayLayer);
    this._hideNavigation();
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

    const navCss = `.zooom-nav-btn{position:fixed;top:50%;transform:translateY(-50%);z-index:${
      this._zIndex + 10
    };background:rgba(255,255,255,0.85);border:none;border-radius:50%;width:44px;height:44px;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 200ms ease-in-out,background 200ms ease;box-shadow:0 2px 8px rgba(0,0,0,0.2);}.zooom-nav-btn.visible{opacity:1;pointer-events:auto;}.zooom-nav-btn:hover{background:rgba(255,255,255,1);}.zooom-nav-btn--prev{left:16px;}.zooom-nav-btn--next{right:16px;}`;

    document.head.insertAdjacentHTML(
      "beforeend",
      `<style>html{scrollbar-gutter:stable}${css}${background}${this._navigation ? navCss : ""}</style>`
    );
  };

  _createNavigation = () => {
    this._prevBtn = document.createElement("button");
    this._prevBtn.className = "zooom-nav-btn zooom-nav-btn--prev";
    this._prevBtn.setAttribute("aria-label", "Previous image");
    this._prevBtn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';

    this._nextBtn = document.createElement("button");
    this._nextBtn.className = "zooom-nav-btn zooom-nav-btn--next";
    this._nextBtn.setAttribute("aria-label", "Next image");
    this._nextBtn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

    this._prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this._navigateBy(-1);
    });
    this._nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this._navigateBy(1);
    });

    document.body.appendChild(this._prevBtn);
    document.body.appendChild(this._nextBtn);
  };

  _handleKeydown = (event: KeyboardEvent) => {
    const isZoomed = !!document.querySelector(`[${this._dataAttr}="true"]`);
    if (!isZoomed) return;

    if (event.key === "ArrowLeft") this._navigateBy(-1);
    else if (event.key === "ArrowRight") this._navigateBy(1);
    else if (event.key === "Escape") this._handleEvent();
  };

  _navigateBy = (direction: number) => {
    const currentIndex = this._allImages.indexOf(this._imageZooom);
    const nextIndex = currentIndex + direction;

    if (nextIndex < 0 || nextIndex >= this._allImages.length) return;

    const nextImage = this._allImages[nextIndex] as HTMLImageElement;
    const bigImage = nextImage.getAttribute("data-zooom-big");

    if (this._slideTimeout !== null) {
      clearTimeout(this._slideTimeout);
      this._slideTimeout = null;
    }

    const proceed = () => {
      this._onClose(this._imageZooom);
      if (this._navigationEffect === "slide") {
        this._navigateWithSlide(nextImage, direction);
      } else {
        this._clonedImg.parentNode?.removeChild(this._clonedImg);
        this._imageZooom.setAttribute(this._dataAttr, "false");
        this._imageZooom.style.removeProperty("visibility");
        this._imageZooom = nextImage;
        this._zooomInit(true);
      }
    };

    if (bigImage) {
      this._loadImage(nextImage, bigImage).then(() => {
        document.body.classList.remove("zooom-loading");
        proceed();
      });
    } else if (nextImage.naturalWidth === 0) {
      // lazy image not loaded yet — force load on the original element
      nextImage.loading = "eager";
      nextImage.addEventListener("load", proceed, { once: true });
      nextImage.addEventListener("error", proceed, { once: true });
    } else {
      proceed();
    }
  };

  _navigateWithSlide = (nextImage: HTMLImageElement, direction: number) => {
    const animTime = this._animTime!;
    const { clientWidth } = document.documentElement;

    // slide out current clone to the side
    const outgoing = this._clonedImg;
    const outgoingOriginal = this._imageZooom;
    const { scale, X, Y } = this._cloneTransform;

    outgoing.style.transition = `transform ${animTime}ms ease-in-out`;
    if (this._cloneIsFixed) {
      outgoing.style.transform = `translateX(${-clientWidth * direction}px)`;
    } else {
      outgoing.style.transform = `matrix(${scale},0,0,${scale},${X - clientWidth * direction},${Y})`;
    }

    this._slideTimeout = setTimeout(() => {
      this._slideTimeout = null;
      outgoing.parentNode?.removeChild(outgoing);
      outgoingOriginal.setAttribute(this._dataAttr, "false");
      outgoingOriginal.style.removeProperty("visibility");
    }, animTime);

    // slide in new image horizontally from viewport edge
    this._imageZooom = nextImage;
    this._imageZooom.setAttribute(this._dataAttr, "true");
    this._cloneImgSlide(nextImage, clientWidth * direction);

    this._showNavigation();
    this._onOpen(this._imageZooom);
  };

  /**
   * Creates a clone that slides in horizontally from the viewport edge.
   * Uses position:fixed so it never extends the document and causes scrollbars.
   */
  _cloneImgSlide = (image: HTMLImageElement, slideFromX: number) => {
    this._clonedImg = document.createElement("img");
    const src = image.dataset.zoooomSrc || image.currentSrc || image.src;

    const { width, height } = image.getBoundingClientRect();
    const { clientWidth, clientHeight } = document.documentElement;

    const ratio = height / width;
    let maxWidth = image.naturalWidth
      || parseInt(image.getAttribute("width") ?? "0")
      || width;
    maxWidth >= clientWidth && (maxWidth = clientWidth);
    const maxHeight = maxWidth * ratio;
    maxHeight >= clientHeight && (maxWidth = (maxWidth * clientHeight) / maxHeight);
    const scale = maxWidth !== width ? maxWidth / width : 1;

    const scaledW = width * scale;
    const scaledH = height * scale;

    // fixed center position
    const fixedLeft = (clientWidth - scaledW) / 2;
    const fixedTop = (clientHeight - scaledH) / 2;

    this._cloneTransform = { scale, X: 0, Y: 0 };
    this._cloneIsFixed = true;

    const img = this._clonedImg;
    img.src = src;
    img.style.position = "fixed";
    img.style.top = `${fixedTop}px`;
    img.style.left = `${fixedLeft}px`;
    img.style.width = `${scaledW}px`;
    img.style.height = `${scaledH}px`;
    img.className = "zooom-clone";
    img.setAttribute("data-zoomed", "true");

    image.style.setProperty("visibility", "hidden");

    // start off-screen horizontally (no transition yet)
    img.style.transition = "none";
    img.style.transform = `translateX(${slideFromX}px)`;

    document.body.appendChild(img);

    img.offsetWidth; // force reflow
    img.style.transition = `transform ${this._animTime}ms ease-in-out`;
    img.style.transform = "translateX(0)";

    img.addEventListener("click", this._handleEvent);
  };

  _showNavigation = () => {
    if (!this._prevBtn || !this._nextBtn) return;
    const index = this._allImages.indexOf(this._imageZooom);
    this._prevBtn.classList.toggle("visible", index > 0);
    this._nextBtn.classList.toggle("visible", index < this._allImages.length - 1);
  };

  _hideNavigation = () => {
    this._prevBtn?.classList.remove("visible");
    this._nextBtn?.classList.remove("visible");
  };

  _zooomInit = (instant = false) => {
    document.body.style.overflow = "hidden";
    this._imageZooom.setAttribute(this._dataAttr, "true");
    this._cloneImg(this._imageZooom, instant);
    fadeIn(this._overlayLayer, this._overlay);
    this._showNavigation();
    this._onOpen(this._imageZooom);
  };

  _cloneImg = (image: HTMLImageElement, instant = false) => {
    this._clonedImg = document.createElement("img");
    let src = image.dataset.zoooomSrc || image.currentSrc || image.src;

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

    let maxWidth = image.naturalWidth
      || parseInt(image.getAttribute("width") ?? "0")
      || width;

    maxWidth >= clientWidth && (maxWidth = clientWidth);
    const maxHeight = maxWidth * ratio;
    maxHeight >= clientHeight &&
      (maxWidth = (maxWidth * clientHeight) / maxHeight);

    const scale = maxWidth !== width ? maxWidth / width : 1;

    this._cloneTransform = { scale, X, Y };
    this._cloneIsFixed = false;

    const img = this._clonedImg;

    img.src = src;
    img.width = width;
    img.height = height;
    img.style.position = "absolute";
    img.style.top = `${top + scrollTop}px`;
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

  };

  _reset = () => {
    const cloneToRemove = this._clonedImg;
    const originalImg = this._imageZooom;
    const t = this._animTime;
    cloneToRemove.style.transition = `transform ${t}ms ease-in-out`;
    cloneToRemove.style.removeProperty("transform");
    setTimeout(() => {
      cloneToRemove.parentNode?.removeChild(cloneToRemove);
      originalImg.style.removeProperty("visibility");
      document.body.style.overflow = "";
    }, t);
  };
}
