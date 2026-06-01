import { fadeIn, fadeOut, debounce, loadImage, resolveImageRect } from "./utils/function";
import type {
  ConstructorObject,
  ObjectCursor,
  ZooomContext,
  ZooomEvent,
  ZooomPlugin,
} from "./types";

export type {
  ConstructorObject,
  ObjectCursor,
  ZooomContext,
  ZooomEvent,
  ZooomPlugin,
};

/**
 * @class Zooom
 */
export default class Zooom {
  private _element: string;
  private _dataAttr: string;
  private _overlayId: string;
  _imageZooom!: HTMLImageElement;
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
  // clones produced by the core's initial zoom — used by _reset to decide animation style
  private _coreClones: WeakSet<HTMLImageElement> = new WeakSet();
  // element that had focus before the zoom opened — restored on close
  private _returnFocus: HTMLElement | null = null;
  private _closeButton: boolean;
  private _closeBtn: HTMLButtonElement | null = null;

  constructor(
    className: string,
    {
      zIndex,
      animationTime,
      cursor,
      overlay,
      closeButton = false,
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
    this._closeButton = closeButton;

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
    this._allImages.forEach((element: HTMLElement) => {
      element.setAttribute("data-zoomed", "false");
      // make the image focusable so keyboard users can trigger zoom with Enter/Space
      if (!element.hasAttribute("tabindex")) element.setAttribute("tabindex", "0");
    });

    window.addEventListener("keydown", this._handleKeydown);

    this._eventHandle();
    this._createStyleAndAddToHead();
    this._createCloseButton();
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
      get currentClone() {
        return self._clonedImg && self._clonedImg.parentNode ? self._clonedImg : null;
      },
      get animTime() { return self._animTime!; },
      get zIndex() { return self._zIndex; },
      get overlayLayer() { return self._overlayLayer; },
      get closeButton() { return self._closeButton; },
      on(event: ZooomEvent, handler: (...args: any[]) => void) {
        if (!self._listeners.has(event)) {
          self._listeners.set(event, []);
        }
        self._listeners.get(event)!.push(handler);
      },
      zoomIn(image: HTMLElement, instant = false) {
        self._imageZooom = image as HTMLImageElement;
        self._zooomInit(instant);
      },
      zoomOut() {
        self._handleEvent();
      },
      addStyle(css: string) {
        document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
      },
      setCurrentImage(image: HTMLElement) {
        self._imageZooom = image as HTMLImageElement;
        // keep dialog label in sync as plugins navigate between images
        self._overlayLayer.setAttribute(
          "aria-label",
          self._imageZooom.alt || "Zoomed image"
        );
      },
      setClone(img: HTMLImageElement) {
        self._clonedImg = img;
        if (!img.alt) img.alt = self._imageZooom?.alt || "";
        img.tabIndex = -1;
        img.focus({ preventScroll: true });
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
    const shouldRemove = this._onResize();
    ["scroll", "resize", "click"].forEach((type) => {
      const handler = (type === "click" ? this._handleClick : this._handleEvent) as EventListener;
      if (shouldRemove) {
        window.removeEventListener(type, handler);
      } else {
        window.addEventListener(type, handler);
      }
    });
  };

  _cursorType = (
    { in: zIn, out: zOut }: ObjectCursor = { in: "zoom-in", out: "zoom-out" }
  ) => {
    this._cursorIn = `cursor: ${zIn}`;
    this._cursorOut = `cursor: ${zOut};`;
  };

  _handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLImageElement;
    const dataZoomed = target.getAttribute(this._dataAttr);

    if (dataZoomed === "false") {
      const bigImage = target.getAttribute("data-zooom-big");

      if (bigImage) {
        loadImage(target, bigImage).then(() => {
          this._imageZooom = target;
          this._zooomInit();
          document.body.classList.remove("zooom-loading");
        });
      } else {
        this._imageZooom = target;
        this._zooomInit();
      }
    } else if (dataZoomed === "true" || target.id === this._overlayId) {
      if (this._closeButton && dataZoomed === "true") return;
      this._handleEvent();
    }
  };

  _handleEvent = () => {
    const imagezooom = document.querySelector(`[${this._dataAttr}="true"]`);
    if (!imagezooom) return;

    this._reset();
    this._closeBtn?.classList.remove("visible");

    setTimeout(() => {
      imagezooom.setAttribute(this._dataAttr, "false");
    }, this._animTime);

    this._onClose(this._imageZooom);
    this._emit('close', this._imageZooom);
    fadeOut(this._overlayLayer);

    this._overlayLayer.removeAttribute("role");
    this._overlayLayer.removeAttribute("aria-modal");
    this._overlayLayer.removeAttribute("aria-label");

    const restore = this._returnFocus;
    this._returnFocus = null;
    // defer until after _reset's visibility-removal timeout — a hidden element can't receive focus
    setTimeout(() => {
      if (restore && typeof restore.focus === "function") {
        restore.focus({ preventScroll: true });
      }
    }, this._animTime);
  };

  _handleKeydown = (event: KeyboardEvent) => {
    const isZoomed = !!document.querySelector(`[${this._dataAttr}="true"]`);

    if (!isZoomed) {
      // keyboard activation: Enter or Space on a focused zoomable image opens it
      if (event.key === "Enter" || event.key === " ") {
        const target = event.target as HTMLImageElement;
        if (target && this._allImages.indexOf(target) >= 0) {
          event.preventDefault();
          target.click();
        }
      }
      return;
    }

    this._emit('keydown', event);
    if (event.key === "Escape") {
      this._handleEvent();
    } else if (event.key === "Tab") {
      // focus trap: keep Tab/Shift+Tab inside the zoom layer
      event.preventDefault();
      this._clonedImg.focus({ preventScroll: true });
    }
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

    const closeBtnCss = this._closeButton
      ? `.zooom-close-btn{position:fixed;top:16px;right:16px;z-index:${this._zIndex + 10};background:rgba(255,255,255,0.85);color:#222;border:none;border-radius:50%;width:36px;height:36px;padding:0;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 200ms ease-in-out,background 200ms ease;box-shadow:0 2px 8px rgba(0,0,0,0.2);}.zooom-close-btn.visible{opacity:1;pointer-events:auto;}.zooom-close-btn:hover{background:rgba(255,255,255,1);}`
      : "";

    document.head.insertAdjacentHTML(
      "beforeend",
      `<style>html{scrollbar-gutter:stable}${css}${background}${closeBtnCss}</style>`
    );
  };

  _createCloseButton = () => {
    if (!this._closeButton) return;
    const btn = document.createElement("button");
    btn.className = "zooom-close-btn";
    btn.setAttribute("aria-label", "Close");
    btn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      this._handleEvent();
    });
    document.body.appendChild(btn);
    this._closeBtn = btn;
  };

  _zooomInit = (instant = false) => {
    document.body.style.overflow = "hidden";
    this._imageZooom.setAttribute(this._dataAttr, "true");

    // only capture return focus on the initial open — not on slider navigation,
    // where _imageZooom is reassigned but the original triggering element is still the right target
    if (!this._returnFocus) {
      const active = document.activeElement as HTMLElement | null;
      this._returnFocus = active && active !== document.body ? active : this._imageZooom;
    }
    this._overlayLayer.setAttribute("role", "dialog");
    this._overlayLayer.setAttribute("aria-modal", "true");
    this._overlayLayer.setAttribute(
      "aria-label",
      this._imageZooom.alt || "Zoomed image"
    );

    this._closeBtn?.classList.add("visible");
    this._cloneImg(this._imageZooom, instant);
    fadeIn(this._overlayLayer, this._overlay);
    this._onOpen(this._imageZooom);
    this._emit('open', this._imageZooom);
  };

  _cloneImg = (image: HTMLImageElement, instant = false) => {
    this._clonedImg = document.createElement("img");
    let src = image.dataset.zoooomSrc || image.currentSrc || image.src;

    let { width, height, left, top } = resolveImageRect(image);

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
    img.alt = image.alt || "";
    img.width = width;
    img.height = height;
    // position:fixed — not clipped by body{overflow:hidden} during animation
    img.style.position = "fixed";
    img.style.top = `${top}px`;
    img.style.left = `${left}px`;
    img.style.width = `${width}px`;
    img.style.height = `${height}px`;
    img.className = "zooom-clone";
    img.tabIndex = -1;

    this._imageZooom.style.setProperty("visibility", "hidden");

    document.body.appendChild(img);

    img.offsetWidth;
    img.setAttribute("data-zoomed", "true");
    if (instant) img.style.transition = "none";
    img.style.transform = `matrix(${scale},0,0,${scale},${X},${Y})`;

    // mark as core-initiated so _reset() animates back to origin (vs. plugin clones which fade)
    this._coreClones.add(img);

    img.focus({ preventScroll: true });
  };

  _reset = () => {
    const cloneToRemove = this._clonedImg;
    const originalImg = this._imageZooom;
    const t = this._animTime;

    // core-initiated clones animate back to origin; plugin-created clones (e.g. SliderPlugin) fade out
    const hasReturnPosition = this._coreClones.has(cloneToRemove);

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
