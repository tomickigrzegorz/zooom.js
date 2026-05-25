/*!
* Zooom.js - the easiest way to enlarge a photo
* @version v1.2.1
* @link https://github.com/tomickigrzegorz/zooom.js
* @license MIT
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Zooom = factory());
})(this, (function () { 'use strict';

    /**
     * @function fadeIn - fade in overlay div layer
     *
     * @param {HTMLDivElement} overlay - add class and opacity to overlay div layer
     * @param {Stieng} bgrWithOpacity - opacity of overlay div layer
     */
    const fadeIn = (overlay, bgrWithOpacity) => {
        overlay.className = "zooom-overlay-in";
        overlay.style.pointerEvents = "auto";
        overlay.style.background = String(bgrWithOpacity);
    };
    /**
     * @function fadeOut - fade out overlay div layer
     *
     * @param {HTMLDivElement} overlay - remove class and style from overlay div
     */
    const fadeOut = (overlay) => {
        overlay.classList.remove("zooom-overlay-in");
        overlay.removeAttribute("style");
    };
    /**
     * @function debounce - debounce function
     *
     * @param {Function} fn function
     * @param {Number} ms time
     */
    const debounce = (fn, ms = 300) => {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), ms);
        };
    };
    /**
     * @function loadImage - swap thumbnail src for a full-size image, resolving when loaded
     */
    const loadImage = (target, bigImage) => {
        return new Promise((resolve, reject) => {
            const newImage = new Image();
            newImage.onload = () => resolve("image loaded");
            newImage.onerror = () => reject(`image ${bigImage} not loaded`);
            document.body.classList.add("zooom-loading");
            newImage.src = bigImage;
            target.src = newImage.src;
            target.dataset.zoooomSrc = newImage.src;
            target.removeAttribute("data-zooom-big");
        });
    };

    /**
     * @class Zooom
     */
    class Zooom {
        constructor(className, { zIndex, animationTime, cursor, overlay, onResize = () => { }, onOpen = () => { }, onClose = () => { }, }) {
            // clones produced by the core's initial zoom — used by _reset to decide animation style
            this._coreClones = new WeakSet();
            // element that had focus before the zoom opened — restored on close
            this._returnFocus = null;
            this.use = (plugin) => {
                plugin.install(this._createContext());
                this._plugins.push(plugin);
                return this;
            };
            this._createContext = () => {
                const self = this;
                return {
                    get images() { return self._allImages; },
                    get currentImage() { return self._imageZooom; },
                    get currentClone() {
                        return self._clonedImg && self._clonedImg.parentNode ? self._clonedImg : null;
                    },
                    get animTime() { return self._animTime; },
                    get zIndex() { return self._zIndex; },
                    get overlayLayer() { return self._overlayLayer; },
                    on(event, handler) {
                        if (!self._listeners.has(event)) {
                            self._listeners.set(event, []);
                        }
                        self._listeners.get(event).push(handler);
                    },
                    zoomIn(image, instant = false) {
                        self._imageZooom = image;
                        self._zooomInit(instant);
                    },
                    zoomOut() {
                        self._handleEvent();
                    },
                    addStyle(css) {
                        document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
                    },
                    setCurrentImage(image) {
                        self._imageZooom = image;
                        // keep dialog label in sync as plugins navigate between images
                        self._overlayLayer.setAttribute("aria-label", self._imageZooom.alt || "Zoomed image");
                    },
                    setClone(img) {
                        var _a;
                        self._clonedImg = img;
                        if (!img.alt)
                            img.alt = ((_a = self._imageZooom) === null || _a === void 0 ? void 0 : _a.alt) || "";
                        img.tabIndex = -1;
                        img.focus({ preventScroll: true });
                    },
                    notifyOpen(image) {
                        self._onOpen(image);
                        self._emit('open', image);
                    },
                    notifyClose(image) {
                        self._onClose(image);
                        self._emit('close', image);
                    },
                };
            };
            this._emit = (event, ...args) => {
                (this._listeners.get(event) || []).forEach(fn => fn(...args));
            };
            this._eventHandle = () => {
                window.addEventListener("resize", debounce(() => this._event(), 70));
                window.addEventListener("DOMContentLoaded", this._event);
            };
            this._event = () => {
                const shouldRemove = this._onResize();
                ["scroll", "resize", "click"].forEach((type) => {
                    const handler = (type === "click" ? this._handleClick : this._handleEvent);
                    if (shouldRemove) {
                        window.removeEventListener(type, handler);
                    }
                    else {
                        window.addEventListener(type, handler);
                    }
                });
            };
            this._cursorType = ({ in: zIn, out: zOut } = { in: "zoom-in", out: "zoom-out" }) => {
                this._cursorIn = `cursor: ${zIn}`;
                this._cursorOut = `cursor: ${zOut};`;
            };
            this._handleClick = (event) => {
                const target = event.target;
                const dataZoomed = target.getAttribute(this._dataAttr);
                if (dataZoomed === "false") {
                    const bigImage = target.getAttribute("data-zooom-big");
                    if (bigImage) {
                        loadImage(target, bigImage).then(() => {
                            this._imageZooom = target;
                            this._zooomInit();
                            document.body.classList.remove("zooom-loading");
                        });
                    }
                    else {
                        this._imageZooom = target;
                        this._zooomInit();
                    }
                }
                else if (dataZoomed === "true" || target.id === this._overlayId) {
                    this._handleEvent();
                }
            };
            this._handleEvent = () => {
                const imagezooom = document.querySelector(`[${this._dataAttr}="true"]`);
                if (!imagezooom)
                    return;
                this._reset();
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
            this._handleKeydown = (event) => {
                const isZoomed = !!document.querySelector(`[${this._dataAttr}="true"]`);
                if (!isZoomed) {
                    // keyboard activation: Enter or Space on a focused zoomable image opens it
                    if (event.key === "Enter" || event.key === " ") {
                        const target = event.target;
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
                }
                else if (event.key === "Tab") {
                    // focus trap: keep Tab/Shift+Tab inside the zoom layer
                    event.preventDefault();
                    this._clonedImg.focus({ preventScroll: true });
                }
            };
            this._createStyleAndAddToHead = () => {
                const background = `#zooom-overlay{position:fixed;pointer-events:none;width:100%;background:rgba(255,255,255,0);height:100%;top:0;left:0;justify-content:center;align-items:center;z-index:${this._zIndex};margin:auto;-webkit-transition:background ${this._animTime}ms ease-in-out;transition:background ${this._animTime}ms ease-in-out;${this._cursorOut}}`;
                const css = `.${this._element}{${this._cursorIn}};@-webkit-keyframes zooom-fade{0%{opacity:0}}@keyframes zooom-fade{0%{opacity:0}}[data-zoomed="true"]{${this._cursorOut}position:relative;z-index:${this._zIndex + 9};transition:transform ${this._animTime}ms ease-in-out;}`;
                document.head.insertAdjacentHTML("beforeend", `<style>html{scrollbar-gutter:stable}${css}${background}</style>`);
            };
            this._zooomInit = (instant = false) => {
                document.body.style.overflow = "hidden";
                this._imageZooom.setAttribute(this._dataAttr, "true");
                // only capture return focus on the initial open — not on slider navigation,
                // where _imageZooom is reassigned but the original triggering element is still the right target
                if (!this._returnFocus) {
                    const active = document.activeElement;
                    this._returnFocus = active && active !== document.body ? active : this._imageZooom;
                }
                this._overlayLayer.setAttribute("role", "dialog");
                this._overlayLayer.setAttribute("aria-modal", "true");
                this._overlayLayer.setAttribute("aria-label", this._imageZooom.alt || "Zoomed image");
                this._cloneImg(this._imageZooom, instant);
                fadeIn(this._overlayLayer, this._overlay);
                this._onOpen(this._imageZooom);
                this._emit('open', this._imageZooom);
            };
            this._cloneImg = (image, instant = false) => {
                var _a;
                this._clonedImg = document.createElement("img");
                let src = image.dataset.zoooomSrc || image.currentSrc || image.src;
                let { width, height, left, top } = image.getBoundingClientRect();
                const { clientWidth, clientHeight, offsetWidth } = document.documentElement;
                const scroll = clientWidth - offsetWidth;
                const X = (clientWidth - scroll) / 2 - left - width / 2;
                const Y = -top + (clientHeight - height) / 2;
                const ratio = height / width;
                let maxWidth = image.naturalWidth
                    || parseInt((_a = image.getAttribute("width")) !== null && _a !== void 0 ? _a : "0")
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
                if (instant)
                    img.style.transition = "none";
                img.style.transform = `matrix(${scale},0,0,${scale},${X},${Y})`;
                // mark as core-initiated so _reset() animates back to origin (vs. plugin clones which fade)
                this._coreClones.add(img);
                img.focus({ preventScroll: true });
            };
            this._reset = () => {
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
                    }
                    else {
                        cloneToRemove.style.transition = `opacity ${t}ms ease-in-out`;
                        cloneToRemove.style.opacity = "0";
                    }
                }
                else {
                    // navigated clone — fade out in place (no return-to-origin animation)
                    cloneToRemove.style.transition = `opacity ${t}ms ease-in-out`;
                    cloneToRemove.style.opacity = "0";
                }
                setTimeout(() => {
                    var _a;
                    (_a = cloneToRemove.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(cloneToRemove);
                    originalImg.style.removeProperty("visibility");
                    document.body.style.overflow = "";
                }, t);
            };
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
            this._allImages = [].slice.call(document.querySelectorAll(`.${className}`));
            this._allImages.forEach((element) => {
                element.setAttribute("data-zoomed", "false");
                // make the image focusable so keyboard users can trigger zoom with Enter/Space
                if (!element.hasAttribute("tabindex"))
                    element.setAttribute("tabindex", "0");
            });
            window.addEventListener("keydown", this._handleKeydown);
            this._eventHandle();
            this._createStyleAndAddToHead();
        }
    }

    return Zooom;

}));
//# sourceMappingURL=zooom.umd.js.map
