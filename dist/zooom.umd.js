/*!
* Zooom.js - the easiest way to enlarge a photo
* @version v1.2.0
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
     * @class Zooom
     */
    class Zooom {
        constructor(className, { zIndex, animationTime, cursor, overlay, onResize = () => { }, onOpen = () => { }, onClose = () => { }, }) {
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
                    },
                    setClone(img) {
                        self._clonedImg = img;
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
                ["scroll", "resize", "click"].map((type) => {
                    if (this._onResize()) {
                        window.removeEventListener(type, type === "click" ? this._handleClick : this._handleEvent);
                    }
                    else {
                        window.addEventListener(type, type === "click" ? this._handleClick : this._handleEvent);
                    }
                });
            };
            this._cursorType = ({ in: zIn, out: zOut } = { in: "zoom-in", out: "zoom-out" }) => {
                this._cursorIn = `cursor: ${zIn}`;
                this._cursorOut = `cursor: ${zOut};`;
            };
            this._handleClick = (event) => {
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
            this._loadImage = (target, bigImage) => {
                return new Promise((resolve, reject) => {
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
            };
            this._handleKeydown = (event) => {
                const isZoomed = !!document.querySelector(`[${this._dataAttr}="true"]`);
                if (!isZoomed)
                    return;
                this._emit('keydown', event);
                if (event.key === "Escape")
                    this._handleEvent();
            };
            this._createStyleAndAddToHead = () => {
                const background = `#zooom-overlay{position:fixed;pointer-events:none;width:100%;background:rgba(255,255,255,0);height:100%;top:0;justify-content:center;align-items:center;z-index:${this._zIndex};margin:auto;-webkit-transition:background ${this._animTime}ms ease-in-out;transition:background ${this._animTime}ms ease-in-out;${this._cursorOut}}`;
                const css = `.${this._element}{${this._cursorIn}};@-webkit-keyframes zooom-fade{0%{opacity:0}}@keyframes zooom-fade{0%{opacity:0}}[data-zoomed="true"]{${this._cursorOut}position:relative;z-index:${this._zIndex + 9};transition:transform ${this._animTime}ms ease-in-out;}`;
                document.head.insertAdjacentHTML("beforeend", `<style>html{scrollbar-gutter:stable}${css}${background}</style>`);
            };
            this._zooomInit = (instant = false) => {
                document.body.style.overflow = "hidden";
                this._imageZooom.setAttribute(this._dataAttr, "true");
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
                if (instant)
                    img.style.transition = "none";
                img.style.transform = `matrix(${scale},0,0,${scale},${X},${Y})`;
                // store transform info on the element for plugin use
                img._zooomTransform = { scale, X, Y, isFixed: true };
            };
            this._reset = () => {
                const cloneToRemove = this._clonedImg;
                const originalImg = this._imageZooom;
                const t = this._animTime;
                // _cloneImg sets _zooomTransform on the clone — present only for the initial zoom,
                // not for plugin-created clones (e.g. SliderPlugin). Use it to decide close animation.
                const hasReturnPosition = !!cloneToRemove._zooomTransform;
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
            this._allImages.map((element) => {
                element.setAttribute("data-zoomed", "false");
            });
            window.addEventListener("keydown", this._handleKeydown);
            this._eventHandle();
            this._createStyleAndAddToHead();
        }
    }

    return Zooom;

}));
//# sourceMappingURL=zooom.umd.js.map
