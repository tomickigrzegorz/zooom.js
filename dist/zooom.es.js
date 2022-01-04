/*!
* Zooom.js - the easiest way to enlarge a photo
* @version v1.1.0
* @link https://github.com/tomik23/zooom.js
* @license MIT
*/
/**
 *
 * @param overlay - add class and opacity to overlay div layer
 * @param opacity - opacity of overlay div layer
 */
var fadeIn = function (overlay, opacity) {
    overlay.className = 'zooom-overlay-in';
    overlay.style.opacity = String(opacity);
    overlay.style.pointerEvents = 'auto';
};
/**
 *
 * @param overlay - remove class and style from overlay div
 */
var fadeOut = function (overlay) {
    overlay.classList.remove('zooom-overlay-in');
    overlay.removeAttribute('style');
};
/**
 * debounce function
 *
 * @param fn function
 * @param ms time
 * @returns function
 */
var debounce = function (fn, ms) {
    if (ms === void 0) { ms = 300; }
    var timeoutId;
    return function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () { return fn.apply(_this, args); }, ms);
    };
};

/**
 * @class Zooom
 */
var Zooom = /** @class */ (function () {
    /**
     * @constructor
     *
     * @param className
     * @param object
     */
    function Zooom(className, _a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, zIndex = _b.zIndex, animationTime = _b.animationTime, cursor = _b.cursor, overlay = _b.overlay, _c = _b.onResize, onResize = _c === void 0 ? function () { } : _c, _d = _b.onOpen, onOpen = _d === void 0 ? function () { } : _d, _e = _b.onClose, onClose = _e === void 0 ? function () { } : _e;
        /**
         * @method eventHandle - add event listener
         */
        this.eventHandle = function () {
            window.addEventListener('resize', debounce(function () { return _this.event(); }, 70));
            window.addEventListener('load', _this.event);
        };
        /**
         * @method event - scroll, resize, click event
         */
        this.event = function () {
            ['scroll', 'resize', 'click'].map(function (type) {
                if (_this.onResize()) {
                    window.removeEventListener(type, type === 'click' ? _this.handleClick : _this.handleEvent);
                }
                else {
                    window.addEventListener(type, type === 'click' ? _this.handleClick : _this.handleEvent);
                }
            });
        };
        /**
         *
         * @param object - color and opacity
         */
        this.overlayConfig = function (_a) {
            var _b = _a === void 0 ? { color: '#fff', opacity: 100 } : _a, color = _b.color, opacity = _b.opacity;
            _this.color = color;
            _this.opacity = opacity
                ? Math.floor(opacity) >= 100
                    ? 1
                    : Math.floor(opacity) / 100
                : 1;
        };
        // set cursor type
        this.cursorType = function (_a) {
            var _b = _a === void 0 ? { in: 'zoom-in', out: 'zoom-out' } : _a, zIn = _b.in, zOut = _b.out;
            _this.cursorIn = "cursor: ".concat(zIn);
            _this.cursorOut = "cursor: ".concat(zOut, ";");
        };
        /**
         * @param event
         */
        this.handleClick = function (event) {
            var target = event.target;
            var dataZoomed = target.getAttribute(_this.dataAttr);
            if (dataZoomed === 'false') {
                var bigImage = target.getAttribute('data-zooom-big');
                if (bigImage) {
                    _this.loadImage(target, bigImage).then(function () {
                        _this.imageZooom = target;
                        _this.zooomInit();
                        document.body.classList.remove('zooom-loading');
                    });
                }
                else {
                    _this.imageZooom = target;
                    _this.zooomInit();
                }
            }
            else if (dataZoomed === 'true' || target.id === _this.overlayId) {
                _this.handleEvent();
            }
        };
        this.loadImage = function (target, bigImage) {
            return new Promise(function (resolve, reject) {
                var newImage = new Image();
                newImage.onload = function () {
                    resolve('image loaded');
                };
                newImage.onerror = function () {
                    reject("image ".concat(bigImage, " not loaded"));
                };
                document.body.classList.add('zooom-loading');
                newImage.src = bigImage;
                target.src = newImage.src;
                target.removeAttribute('data-zooom-big');
            });
        };
        this.handleEvent = function () {
            var imagezooom = document.querySelector("[".concat(_this.dataAttr, "=\"true\"]"));
            if (!imagezooom)
                return;
            // reset all style
            _this.reset();
            setTimeout(function () {
                imagezooom.setAttribute(_this.dataAttr, 'false');
            }, _this.animTime);
            // callback function onClose
            _this.onClose(_this.imageZooom);
            fadeOut(_this.overlayLayer);
        };
        this.styleHead = function () {
            var background = "#zooom-overlay{position:fixed;opacity:0;pointer-events:none;background:".concat(_this.color, ";width:100%;height:100%;top:0;justify-content:center;align-items:center;z-index:").concat(_this.zIndex, ";margin:auto;-webkit-transition:opacity ").concat(_this.animTime, "ms ease-in-out;transition:opacity ").concat(_this.animTime, "ms ease-in-out;").concat(_this.cursorOut, "}");
            var css = ".".concat(_this.element, "{").concat(_this.cursorIn, "};@-webkit-keyframes zooom-fade{0%{opacity:0}}@keyframes zooom-fade{0%{opacity:0}}[data-zoomed=\"true\"]{").concat(_this.cursorOut, "position:relative;z-index:").concat(_this.zIndex + 9, ";transition:transform ").concat(_this.animTime, "ms ease-in-out;}");
            document.head.insertAdjacentHTML('beforeend', "<style>".concat(css).concat(background, "</style>"));
        };
        /**
         * @method zooomInit - fadein, callback function onOpen, cloneImg
         */
        this.zooomInit = function () {
            var img = _this.imageZooom;
            img.setAttribute(_this.dataAttr, 'true');
            _this.cloneImg(img);
            fadeIn(_this.overlayLayer, _this.opacity);
            // callback function
            _this.onOpen(img);
        };
        /**
         *
         * @param image - clone image and add to overlay layer
         */
        this.cloneImg = function (image) {
            var src = image.currentSrc || image.src;
            var _a = image.getBoundingClientRect(), width = _a.width, height = _a.height, left = _a.left, top = _a.top;
            var _b = document.documentElement, clientWidth = _b.clientWidth, clientHeight = _b.clientHeight, offsetWidth = _b.offsetWidth;
            var scrollTop = window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0;
            var scroll = clientWidth - offsetWidth;
            var X = (clientWidth - scroll) / 2 - left - width / 2;
            var Y = -top + (clientHeight - height) / 2;
            var ratio = height / width;
            var maxWidth = image.naturalWidth;
            maxWidth >= clientWidth && (maxWidth = clientWidth);
            var maxHeight = maxWidth * ratio;
            maxHeight >= clientHeight &&
                (maxWidth = (maxWidth * clientHeight) / maxHeight);
            var scale = maxWidth !== width ? maxWidth / width : 1;
            var img = _this.clonedImg;
            img.src = src;
            img.width = width;
            img.height = height;
            img.style.top = "".concat(top + scrollTop, "px");
            img.style.left = "".concat(left, "px");
            img.style.width = "".concat(width, "px");
            img.style.height = "".concat(height, "px");
            img.className = 'zooom-clone';
            document.body.appendChild(img);
            img.offsetWidth;
            img.setAttribute('data-zoomed', 'true');
            img.style.position = 'absolute';
            img.style.transform = "matrix(".concat(scale, ",0,0,").concat(scale, ",").concat(X, ",").concat(Y, ")");
            // hide orginal image
            setTimeout(function () {
                _this.imageZooom.style.visibility = 'hidden';
            }, 50);
            // remove image
            img.addEventListener('click', _this.reset);
        };
        /**
         * reset all style from image
         */
        this.reset = function () {
            var img = _this.clonedImg;
            img.style.removeProperty('transform');
            setTimeout(function () {
                var _a;
                (_a = img.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(img);
                _this.imageZooom.removeAttribute('style');
            }, _this.animTime);
        };
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
        var over = this.overlayLayer;
        over.id = this.overlayId;
        document.body.appendChild(over);
        // add to all image data attribute false
        [].slice
            .call(document.querySelectorAll(".".concat(className)))
            .map(function (element) {
            element.setAttribute('data-zoomed', 'false');
        });
        // add event listener
        this.eventHandle();
        // create style and add to head
        this.styleHead();
    }
    return Zooom;
}());

export { Zooom as default };
//# sourceMappingURL=zooom.es.js.map
