/*!
* Zooom.js SliderPlugin - navigation plugin for Zooom
* @version v1.4.0
* @link https://github.com/tomickigrzegorz/zooom.js
* @license MIT
*/
var ZooomSlider = (function () {
    'use strict';

    /**
     * @function fadeIn - fade in overlay div layer
     *
     * @param {HTMLDivElement} overlay - add class and opacity to overlay div layer
     * @param {Stieng} bgrWithOpacity - opacity of overlay div layer
     */
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
     * @function resolveImageRect - geometry for cloning, robust to lazy/unloaded images.
     *
     * A `loading="lazy"` image that hasn't loaded yet (e.g. far below the fold) can report a
     * degenerate `getBoundingClientRect()` — typically `height: 0` (and sometimes `width: 0`)
     * when CSS sets `height:auto` and the browser hasn't reserved aspect-ratio space. Cloning
     * straight from that rect produces a zero-size, invisible clone. This reconstructs the
     * missing dimension(s) from the intrinsic aspect ratio (natural size if available, else the
     * width/height attributes), keeping the real on-screen position (left/top) intact.
     */
    const resolveImageRect = (image) => {
        const r = image.getBoundingClientRect();
        let width = r.width;
        let height = r.height;
        if (width > 0 && height > 0) {
            return { width, height, left: r.left, top: r.top };
        }
        const nw = image.naturalWidth;
        const nh = image.naturalHeight;
        const aw = parseFloat(image.getAttribute("width") || "") || 0;
        const ah = parseFloat(image.getAttribute("height") || "") || 0;
        // ratio = height / width
        const ratio = nw > 0 && nh > 0 ? nh / nw : aw > 0 && ah > 0 ? ah / aw : 0;
        if (width > 0 && ratio > 0)
            height = width * ratio;
        else if (height > 0 && ratio > 0)
            width = height / ratio;
        else {
            width = width || nw || aw;
            height = height || nh || ah;
        }
        // never hand back a zero box — fall back to intrinsic/attribute size as a last resort
        if (!(width > 0))
            width = nw || aw || 1;
        if (!(height > 0))
            height = nh || ah || 1;
        return { width, height, left: r.left, top: r.top };
    };

    /**
     * SliderPlugin — navigation between zoomed images
     * Usage: new Zooom('zooom', options).use(new SliderPlugin({ effect: 'slide' }))
     */
    class SliderPlugin {
        constructor(options = {}) {
            this.name = 'zooom-slider';
            this._prevBtn = null;
            this._nextBtn = null;
            this._clonedImg = null;
            this._isSliding = false;
            this._pendingSlide = null;
            this._currentImage = null;
            this._drag = null;
            this._committing = false;
            this._swallowNextClick = false;
            this._counterEl = null;
            this._installed = false;
            // keep references to preloader Image instances so _computeCloneTransform can read their
            // naturalWidth — without this, peek scale for data-zooom-big images uses the thumbnail's
            // dimensions, which produces a much smaller zoom than what loadImage would yield
            this._preloaded = new Map();
            this._handleResize = () => {
                // only re-check while a zoom is open — otherwise buttons are already hidden
                if (this._currentImage)
                    this._showNavigation();
            };
            this._handleMouseDown = (event) => {
                if (event.button !== 0)
                    return;
                if (!this._canBeginDrag(event.target))
                    return;
                this._beginDrag(event.clientX, 'mouse');
            };
            this._handleMouseMove = (event) => {
                if (!this._drag || this._drag.pointerType !== 'mouse')
                    return;
                this._updateDrag(event.clientX);
            };
            this._handleMouseUp = (event) => {
                if (!this._drag || this._drag.pointerType !== 'mouse')
                    return;
                this._endDrag(event.clientX);
            };
            this._handleTouchStart = (event) => {
                if (event.touches.length !== 1) {
                    this._abortDrag();
                    return;
                }
                if (!this._canBeginDrag(event.target))
                    return;
                this._beginDrag(event.changedTouches[0].clientX, 'touch');
            };
            this._handleTouchMove = (event) => {
                if (!this._drag || this._drag.pointerType !== 'touch')
                    return;
                // multi-touch (likely pinch) — bail out so PanZoom takes over
                if (event.touches.length !== 1) {
                    this._abortDrag();
                    return;
                }
                // only block page-scroll once we've actually started moving the clone
                if (this._drag.moved && event.cancelable)
                    event.preventDefault();
                this._updateDrag(event.touches[0].clientX);
            };
            this._handleTouchEnd = (event) => {
                var _a, _b;
                if (!this._drag || this._drag.pointerType !== 'touch')
                    return;
                const endX = (_b = (_a = event.changedTouches[0]) === null || _a === void 0 ? void 0 : _a.clientX) !== null && _b !== void 0 ? _b : this._drag.startX;
                this._endDrag(endX);
            };
            this._handleClickCapture = (event) => {
                if (!this._swallowNextClick)
                    return;
                this._swallowNextClick = false;
                event.stopImmediatePropagation();
                event.preventDefault();
            };
            this._options = options;
        }
        install(ctx) {
            this._ctx = ctx;
            this._installed = true;
            if (ctx.images.length > 1) {
                ctx.addStyle(this._buildCss());
                this._createButtons();
                if (this._options.counter)
                    this._createCounter();
            }
            ctx.on('open', (image) => {
                if (!this._installed)
                    return;
                this._preloadNeighbours(image);
                // during slide navigation we manage the clone ourselves
                if (this._isSliding)
                    return;
                this._currentImage = image;
                this._clonedImg = ctx.currentClone;
                if (this._clonedImg) {
                    this._clonedImg.addEventListener('click', () => {
                        if (!ctx.closeButton)
                            ctx.zoomOut();
                    });
                }
                this._showNavigation();
            });
            ctx.on('close', () => {
                if (!this._installed)
                    return;
                // during slide navigation we manage the state ourselves
                if (this._isSliding)
                    return;
                this._cancelPendingSlide();
                this._hideNavigation();
                this._currentImage = null;
                this._clonedImg = null;
            });
            ctx.on('keydown', (event) => {
                if (!this._installed)
                    return;
                if (event.key === 'ArrowLeft')
                    this._navigateBy(-1);
                else if (event.key === 'ArrowRight')
                    this._navigateBy(1);
            });
            document.addEventListener('touchstart', this._handleTouchStart, { passive: true });
            document.addEventListener('touchmove', this._handleTouchMove, { passive: false });
            document.addEventListener('touchend', this._handleTouchEnd, { passive: true });
            document.addEventListener('touchcancel', this._handleTouchEnd, { passive: true });
            document.addEventListener('mousedown', this._handleMouseDown);
            document.addEventListener('mousemove', this._handleMouseMove);
            document.addEventListener('mouseup', this._handleMouseUp);
            // capture-phase click swallow — relies on slider being installed before PanZoom,
            // so this listener registers (and fires) before PanZoom's click handler
            document.addEventListener('click', this._handleClickCapture, { capture: true });
            // re-evaluate hideButtons rule on resize (e.g. crossing a breakpoint) so visibility
            // stays in sync without requiring the user to close & reopen the zoom
            if (this._options.hideButtons !== undefined) {
                window.addEventListener('resize', this._handleResize);
            }
        }
        uninstall() {
            var _a, _b, _c;
            this._installed = false;
            this._cancelPendingSlide();
            this._abortDrag();
            (_a = this._prevBtn) === null || _a === void 0 ? void 0 : _a.remove();
            (_b = this._nextBtn) === null || _b === void 0 ? void 0 : _b.remove();
            (_c = this._counterEl) === null || _c === void 0 ? void 0 : _c.remove();
            this._prevBtn = null;
            this._nextBtn = null;
            this._counterEl = null;
            this._preloaded.clear();
            document.removeEventListener('touchstart', this._handleTouchStart);
            document.removeEventListener('touchmove', this._handleTouchMove);
            document.removeEventListener('touchend', this._handleTouchEnd);
            document.removeEventListener('touchcancel', this._handleTouchEnd);
            document.removeEventListener('mousedown', this._handleMouseDown);
            document.removeEventListener('mousemove', this._handleMouseMove);
            document.removeEventListener('mouseup', this._handleMouseUp);
            document.removeEventListener('click', this._handleClickCapture, { capture: true });
            window.removeEventListener('resize', this._handleResize);
        }
        _preloadNeighbours(image) {
            var _a;
            const radius = Math.max(0, (_a = this._options.preload) !== null && _a !== void 0 ? _a : 0);
            if (radius === 0)
                return;
            const images = this._ctx.images;
            const idx = images.indexOf(image);
            if (idx === -1)
                return;
            for (let d = 1; d <= radius; d++) {
                this._preloadOne(images[idx + d]);
                this._preloadOne(images[idx - d]);
            }
        }
        _preloadOne(el) {
            if (!el)
                return;
            // fall back to the displayed src when there's no separate big-image URL —
            // ensures drag-follow peeks render properly even for galleries without data-zooom-big
            const url = el.getAttribute('data-zooom-big')
                || el.currentSrc
                || el.src;
            if (!url || this._preloaded.has(url))
                return;
            const img = new Image();
            img.src = url;
            this._preloaded.set(url, img);
        }
        _buildCss() {
            const z = this._ctx.zIndex + 10;
            const parts = [
                `.zooom-nav-btn{position:fixed;top:50%;transform:translateY(-50%);z-index:${z};`,
                `background:rgba(255,255,255,0.85);border:none;border-radius:50%;width:44px;height:44px;`,
                `cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;`,
                `pointer-events:none;transition:opacity 200ms ease-in-out,background 200ms ease;`,
                `box-shadow:0 2px 8px rgba(0,0,0,0.2);}`,
                `.zooom-nav-btn.visible{opacity:1;pointer-events:auto;}`,
                `.zooom-nav-btn:hover{background:rgba(255,255,255,1);}`,
                `.zooom-nav-btn--prev{left:16px;}`,
                `.zooom-nav-btn--next{right:16px;}`,
            ];
            if (this._options.counter) {
                parts.push(`.zooom-counter{position:fixed;top:16px;left:16px;z-index:${z};`, `background:rgba(255,255,255,0.85);border-radius:20px;padding:4px 12px;`, `font-size:14px;font-family:sans-serif;opacity:0;pointer-events:none;`, `transition:opacity 200ms ease-in-out;box-shadow:0 2px 8px rgba(0,0,0,0.2);}`, `.zooom-counter.visible{opacity:1;}`);
            }
            return parts.join('');
        }
        _createButtons() {
            this._prevBtn = document.createElement('button');
            this._prevBtn.className = 'zooom-nav-btn zooom-nav-btn--prev';
            this._prevBtn.setAttribute('aria-label', 'Previous image');
            this._prevBtn.innerHTML =
                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
            this._nextBtn = document.createElement('button');
            this._nextBtn.className = 'zooom-nav-btn zooom-nav-btn--next';
            this._nextBtn.setAttribute('aria-label', 'Next image');
            this._nextBtn.innerHTML =
                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
            this._prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this._navigateBy(-1);
            });
            this._nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this._navigateBy(1);
            });
            document.body.appendChild(this._prevBtn);
            document.body.appendChild(this._nextBtn);
        }
        _createCounter() {
            this._counterEl = document.createElement('div');
            this._counterEl.className = 'zooom-counter';
            this._counterEl.setAttribute('aria-live', 'polite');
            this._counterEl.setAttribute('aria-atomic', 'true');
            document.body.appendChild(this._counterEl);
        }
        _cancelPendingSlide() {
            const p = this._pendingSlide;
            if (!p)
                return;
            p.anim.cancel();
            p.el.remove();
            p.original.style.removeProperty('visibility');
            this._pendingSlide = null;
        }
        _navigateBy(direction) {
            const ctx = this._ctx;
            const currentImage = this._currentImage;
            if (!currentImage)
                return;
            const currentIndex = ctx.images.indexOf(currentImage);
            const nextIndex = currentIndex + direction;
            if (nextIndex < 0 || nextIndex >= ctx.images.length)
                return;
            const nextImage = ctx.images[nextIndex];
            const bigImage = nextImage.getAttribute('data-zooom-big');
            this._cancelPendingSlide();
            const proceed = () => {
                var _a, _b;
                if (this._options.effect === 'slide') {
                    this._navigateWithSlide(nextImage, direction);
                }
                else {
                    (_b = (_a = this._clonedImg) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(this._clonedImg);
                    currentImage.setAttribute('data-zoomed', 'false');
                    currentImage.style.removeProperty('visibility');
                    ctx.notifyClose(currentImage);
                    ctx.zoomIn(nextImage, true);
                }
            };
            if (bigImage) {
                loadImage(nextImage, bigImage).then(() => {
                    document.body.classList.remove('zooom-loading');
                    proceed();
                });
            }
            else if (nextImage.naturalWidth === 0) {
                nextImage.loading = 'eager';
                const spinner = this._shouldShowLoading();
                if (spinner)
                    document.body.classList.add('zooom-loading');
                const done = () => {
                    if (spinner)
                        document.body.classList.remove('zooom-loading');
                    proceed();
                };
                nextImage.addEventListener('load', done, { once: true });
                nextImage.addEventListener('error', done, { once: true });
            }
            else {
                proceed();
            }
        }
        _shouldShowLoading() {
            const li = this._options.loadingIndicator;
            if (li === undefined || li === false)
                return false;
            if (li === true)
                return true;
            if (li === 'auto') {
                // Network Information API — Chromium/Edge/Opera only. Safari & Firefox return undefined.
                const conn = navigator.connection;
                if (!conn)
                    return false;
                if (conn.saveData)
                    return true;
                const eff = conn.effectiveType;
                return eff === 'slow-2g' || eff === '2g' || eff === '3g';
            }
            if (typeof li === 'function')
                return li();
            return false;
        }
        _navigateWithSlide(nextImage, direction) {
            var _a, _b;
            const ctx = this._ctx;
            const animTime = ctx.animTime;
            const { clientWidth } = document.documentElement;
            const slideOffset = clientWidth + Math.max(0, (_a = this._options.gap) !== null && _a !== void 0 ? _a : 0);
            const outgoing = this._clonedImg;
            const outgoingOriginal = this._currentImage;
            this._isSliding = true;
            ctx.notifyClose(outgoingOriginal);
            if (outgoing) {
                // capture the current visual bounds (after any in-flight transform) and create
                // a plain fixed element at that position — no transform offset needed, clean translateX slide
                const rect = outgoing.getBoundingClientRect();
                const slideOutgoing = document.createElement('img');
                slideOutgoing.src = outgoing.src;
                slideOutgoing.className = 'zooom-clone';
                // sit above the semi-transparent overlay — same z-index rule as the live clone.
                // without data-zoomed, the slideOutgoing renders BELOW the overlay and the 90%
                // white wash makes it look bleached (the "ghost image" effect).
                slideOutgoing.setAttribute('data-zoomed', 'true');
                slideOutgoing.style.position = 'fixed';
                slideOutgoing.style.top = `${rect.top}px`;
                slideOutgoing.style.left = `${rect.left}px`;
                slideOutgoing.style.width = `${rect.width}px`;
                slideOutgoing.style.height = `${rect.height}px`;
                document.body.appendChild(slideOutgoing);
                (_b = outgoing.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(outgoing);
                outgoingOriginal.setAttribute('data-zoomed', 'false');
                const anim = slideOutgoing.animate([
                    { transform: 'translateX(0)' },
                    { transform: `translateX(${-slideOffset * direction}px)` },
                ], { duration: animTime, easing: 'ease-in-out', fill: 'forwards' });
                const pending = { el: slideOutgoing, original: outgoingOriginal, anim };
                this._pendingSlide = pending;
                anim.finished
                    .then(() => {
                    if (this._pendingSlide !== pending)
                        return;
                    slideOutgoing.remove();
                    outgoingOriginal.style.removeProperty('visibility');
                    this._pendingSlide = null;
                })
                    .catch(() => { });
            }
            this._currentImage = nextImage;
            ctx.setCurrentImage(nextImage);
            nextImage.setAttribute('data-zoomed', 'true');
            this._cloneImgSlide(nextImage, slideOffset * direction);
            this._showNavigation();
            ctx.notifyOpen(nextImage);
            this._isSliding = false;
        }
        _cloneImgSlide(image, slideFromX) {
            var _a;
            const ctx = this._ctx;
            this._clonedImg = document.createElement('img');
            const src = image.dataset.zoooomSrc || image.currentSrc || image.src;
            const { width, height, left, top } = resolveImageRect(image);
            const { clientWidth, clientHeight, offsetWidth } = document.documentElement;
            const scroll = clientWidth - offsetWidth;
            const X = (clientWidth - scroll) / 2 - left - width / 2;
            const Y = -top + (clientHeight - height) / 2;
            const ratio = height / width;
            let maxWidth = image.naturalWidth
                || parseInt((_a = image.getAttribute('width')) !== null && _a !== void 0 ? _a : '0')
                || width;
            if (maxWidth >= clientWidth)
                maxWidth = clientWidth;
            const maxHeight = maxWidth * ratio;
            if (maxHeight >= clientHeight)
                maxWidth = (maxWidth * clientHeight) / maxHeight;
            const scale = maxWidth !== width ? maxWidth / width : 1;
            const img = this._clonedImg;
            img.src = src;
            img.style.position = 'fixed';
            img.style.top = `${top}px`;
            img.style.left = `${left}px`;
            img.style.width = `${width}px`;
            img.style.height = `${height}px`;
            img.className = 'zooom-clone';
            img.setAttribute('data-zoomed', 'true');
            image.style.setProperty('visibility', 'hidden');
            // start off-screen, scaled to final size — matches _cloneImg layout so _reset() animates back correctly
            img.style.transition = 'none';
            img.style.transform = `matrix(${scale},0,0,${scale},${X + slideFromX},${Y})`;
            document.body.appendChild(img);
            img.offsetWidth;
            img.style.transition = `transform ${ctx.animTime}ms ease-in-out`;
            img.style.transform = `matrix(${scale},0,0,${scale},${X},${Y})`;
            ctx.setClone(img);
            img.addEventListener('click', () => {
                if (!ctx.closeButton)
                    ctx.zoomOut();
            });
        }
        _showNavigation() {
            if (!this._prevBtn || !this._nextBtn || !this._currentImage)
                return;
            const index = this._ctx.images.indexOf(this._currentImage);
            const hide = this._shouldHideButtons();
            this._prevBtn.classList.toggle('visible', !hide && index > 0);
            this._nextBtn.classList.toggle('visible', !hide && index < this._ctx.images.length - 1);
            if (this._counterEl) {
                this._counterEl.textContent = `${index + 1} / ${this._ctx.images.length}`;
                this._counterEl.classList.add('visible');
            }
        }
        _shouldHideButtons() {
            const h = this._options.hideButtons;
            if (h === undefined || h === false)
                return false;
            if (h === true)
                return true;
            if (h === 'mobile') {
                return typeof window.matchMedia === 'function'
                    && window.matchMedia('(pointer: coarse)').matches;
            }
            if (typeof h === 'number')
                return document.documentElement.clientWidth <= h;
            if (typeof h === 'function')
                return h();
            return false;
        }
        _hideNavigation() {
            var _a, _b, _c;
            (_a = this._prevBtn) === null || _a === void 0 ? void 0 : _a.classList.remove('visible');
            (_b = this._nextBtn) === null || _b === void 0 ? void 0 : _b.classList.remove('visible');
            (_c = this._counterEl) === null || _c === void 0 ? void 0 : _c.classList.remove('visible');
        }
        _canBeginDrag(target) {
            var _a;
            if (this._committing)
                return false;
            if (!this._currentImage || !this._clonedImg)
                return false;
            const el = target;
            if ((_a = el === null || el === void 0 ? void 0 : el.closest) === null || _a === void 0 ? void 0 : _a.call(el, '.zooom-nav-btn,.zooom-close-btn'))
                return false;
            return true;
        }
        _beginDrag(startX, pointerType) {
            var _a;
            // a lingering pending slide animation would fight the drag — kill it first
            this._cancelPendingSlide();
            const clone = this._clonedImg;
            const vw = document.documentElement.clientWidth;
            const gap = Math.max(0, (_a = this._options.gap) !== null && _a !== void 0 ? _a : 0);
            this._drag = {
                startX,
                vw,
                slideOffset: vw + gap,
                baseTransform: clone.style.transform,
                baseTransition: clone.style.transition,
                next: null,
                prev: null,
                moved: false,
                pointerType,
            };
        }
        _updateDrag(currentX) {
            const d = this._drag;
            if (!d)
                return;
            const dx = currentX - d.startX;
            if (!d.moved) {
                // dead zone so a small jitter on click doesn't trigger drag-follow
                if (Math.abs(dx) < 5)
                    return;
                d.moved = true;
                this._clonedImg.style.transition = 'none';
                this._createPeeks(d);
            }
            this._applyDragOffset(dx);
        }
        _createPeeks(d) {
            const ctx = this._ctx;
            const idx = ctx.images.indexOf(this._currentImage);
            const next = ctx.images[idx + 1];
            const prev = ctx.images[idx - 1];
            if (next)
                d.next = this._createPeek(next, d.slideOffset);
            if (prev)
                d.prev = this._createPeek(prev, -d.slideOffset);
        }
        _createPeek(image, baseOffsetX) {
            // show thumbnail immediately so peek is always visible without waiting for network —
            // consistent with PhotoSwipe's behaviour during load
            const thumbnailSrc = this._resolvePeekSrc(image);
            const bigSrc = image.dataset.zoooomSrc || image.getAttribute('data-zooom-big') || null;
            const peek = document.createElement('img');
            peek.src = thumbnailSrc;
            peek.className = 'zooom-clone zooom-drag-peek';
            // [data-zoomed="true"] rule provides the z-index that puts the peek above the overlay —
            // without it, the 0.9-opacity overlay washes the peek out and it looks faded
            peek.setAttribute('data-zoomed', 'true');
            peek.style.position = 'fixed';
            peek.style.willChange = 'transform';
            peek.style.pointerEvents = 'none';
            peek.style.transition = 'none';
            const result = { el: peek, matrix: '' };
            // (re)compute size/position/scale and apply. for a lazy image not yet loaded the
            // geometry is a best-effort guess (see resolveImageRect); we rerun this on load when
            // the real natural dimensions are known, which fixes wrong aspect ratio / scale=1 for
            // images missing width/height attributes. preserveOffset keeps whatever translateX the
            // drag (or commit) has already applied so the rerun doesn't jump the element.
            const applyGeometry = (preserveOffset) => {
                const t = this._computeCloneTransform(image);
                result.matrix = `matrix(${t.scale},0,0,${t.scale},${t.X},${t.Y})`;
                peek.style.top = `${t.rect.top}px`;
                peek.style.left = `${t.rect.left}px`;
                peek.style.width = `${t.rect.width}px`;
                peek.style.height = `${t.rect.height}px`;
                let offset = `translate3d(${baseOffsetX}px,0,0)`;
                if (preserveOffset) {
                    // keep the current translateX (drag/commit). a committed clone carries a bare
                    // matrix() with no translate3d — treat that as offset 0, not the peek's start offset.
                    const m = /translate3d\([^)]*\)/.exec(peek.style.transform || '');
                    offset = m ? m[0] : 'translate3d(0px,0,0)';
                }
                peek.style.transform = `${offset} ${result.matrix}`;
            };
            applyGeometry(false);
            document.body.appendChild(peek);
            // upgrade to big version once it's ready (swap is invisible if drag is still ongoing)
            if (bigSrc && bigSrc !== thumbnailSrc) {
                const loader = new Image();
                loader.onload = () => { if (peek.isConnected)
                    peek.src = bigSrc; };
                loader.src = bigSrc;
            }
            else if (image.naturalWidth === 0) {
                // lazy / not-yet-loaded image (common for <picture><img loading="lazy">).
                // _resolvePeekSrc already gives a displayable URL; force the original to load eagerly
                // so we can promote the peek to the exact currentSrc and recompute correct geometry.
                image.loading = 'eager';
                const onLoad = () => {
                    if (peek.isConnected) {
                        const resolved = image.currentSrc || image.src;
                        if (resolved && resolved !== peek.src)
                            peek.src = resolved;
                        applyGeometry(true);
                    }
                    image.removeEventListener('load', onLoad);
                };
                image.addEventListener('load', onLoad, { once: true });
            }
            return result;
        }
        /**
         * Resolve a displayable URL for a peek synchronously — critical for a not-yet-loaded
         * <picture><img>, where `image.currentSrc` is empty and `image.src` is the bare fallback
         * (often absent, which resolves to the page URL → broken/empty peek). Reads the matching
         * <source>/srcset so the peek shows the right image immediately instead of waiting for the
         * async eager-load to fill it in.
         */
        _resolvePeekSrc(image) {
            // browser already chose a source (image has loaded at least once)
            if (image.currentSrc)
                return image.currentSrc;
            const parent = image.parentElement;
            if (parent && parent.tagName === 'PICTURE') {
                const sources = parent.querySelectorAll('source');
                for (let i = 0; i < sources.length; i++) {
                    const s = sources[i];
                    const media = s.getAttribute('media');
                    // skip a <source> whose media query doesn't apply to the current viewport
                    if (media && typeof window.matchMedia === 'function' && !window.matchMedia(media).matches)
                        continue;
                    const url = this._firstSrcsetUrl(s.getAttribute('srcset'));
                    if (url)
                        return url;
                }
            }
            // plain <img srcset> before currentSrc resolves, or a bare src
            return this._firstSrcsetUrl(image.getAttribute('srcset')) || image.src;
        }
        /** First candidate URL from a `srcset` string ("a.jpg 1x, b.jpg 2x" → "a.jpg"), absolutised. */
        _firstSrcsetUrl(srcset) {
            var _a;
            if (!srcset)
                return '';
            const first = (_a = srcset.split(',')[0]) === null || _a === void 0 ? void 0 : _a.trim().split(/\s+/)[0];
            if (!first)
                return '';
            try {
                return new URL(first, document.baseURI).href;
            }
            catch (_b) {
                return first;
            }
        }
        _applyDragOffset(dx) {
            const d = this._drag;
            if (!d || !this._clonedImg)
                return;
            this._clonedImg.style.transform = `translate3d(${dx}px,0,0) ${d.baseTransform}`;
            if (d.next)
                d.next.el.style.transform = `translate3d(${dx + d.slideOffset}px,0,0) ${d.next.matrix}`;
            if (d.prev)
                d.prev.el.style.transform = `translate3d(${dx - d.slideOffset}px,0,0) ${d.prev.matrix}`;
        }
        _endDrag(currentX) {
            const d = this._drag;
            if (!d)
                return;
            const dx = currentX - d.startX;
            if (!d.moved) {
                // never crossed dead zone — treat as click, no cleanup needed
                this._drag = null;
                return;
            }
            const threshold = Math.max(50, d.vw * 0.2);
            const idx = this._ctx.images.indexOf(this._currentImage);
            const direction = dx < 0 ? 1 : -1;
            const targetIdx = idx + direction;
            const canCommit = Math.abs(dx) >= threshold
                && targetIdx >= 0 && targetIdx < this._ctx.images.length;
            if (canCommit)
                this._commitDrag(d, dx, direction);
            else
                this._cancelDrag(d, dx);
        }
        _abortDrag() {
            var _a, _b;
            // called when state becomes inconsistent (e.g. second touch during drag).
            // restore clone in place, drop peeks, no animation.
            const d = this._drag;
            if (!d)
                return;
            this._drag = null;
            if (this._clonedImg) {
                this._clonedImg.style.transition = d.baseTransition;
                this._clonedImg.style.transform = d.baseTransform;
            }
            (_a = d.next) === null || _a === void 0 ? void 0 : _a.el.remove();
            (_b = d.prev) === null || _b === void 0 ? void 0 : _b.el.remove();
        }
        _cancelDrag(d, dx) {
            this._drag = null;
            const clone = this._clonedImg;
            const dur = Math.min(260, Math.max(140, Math.abs(dx) * 1.4));
            clone.style.transition = `transform ${dur}ms ease-out`;
            clone.style.transform = `translate3d(0px,0,0) ${d.baseTransform}`;
            if (d.next) {
                d.next.el.style.transition = `transform ${dur}ms ease-out`;
                d.next.el.style.transform = `translate3d(${d.slideOffset}px,0,0) ${d.next.matrix}`;
            }
            if (d.prev) {
                d.prev.el.style.transition = `transform ${dur}ms ease-out`;
                d.prev.el.style.transform = `translate3d(${-d.slideOffset}px,0,0) ${d.prev.matrix}`;
            }
            // any synthetic click after a drag-cancel should not toggle zoom
            this._swallowNextClick = true;
            setTimeout(() => { this._swallowNextClick = false; }, 50);
            setTimeout(() => {
                var _a, _b;
                if (clone === this._clonedImg) {
                    clone.style.transition = d.baseTransition;
                    clone.style.transform = d.baseTransform;
                }
                (_a = d.next) === null || _a === void 0 ? void 0 : _a.el.remove();
                (_b = d.prev) === null || _b === void 0 ? void 0 : _b.el.remove();
            }, dur);
        }
        _commitDrag(d, dx, direction) {
            this._drag = null;
            this._committing = true;
            const ctx = this._ctx;
            const clone = this._clonedImg;
            const target = direction === 1 ? d.next : d.prev;
            const other = direction === 1 ? d.prev : d.next;
            other === null || other === void 0 ? void 0 : other.el.remove();
            const remaining = d.vw - Math.abs(dx);
            const dur = Math.min(320, Math.max(160, remaining * 0.45));
            clone.style.transition = `transform ${dur}ms ease-out`;
            clone.style.transform = `translate3d(${-direction * d.slideOffset}px,0,0) ${d.baseTransform}`;
            if (target) {
                target.el.style.transition = `transform ${dur}ms ease-out`;
                target.el.style.transform = `translate3d(0px,0,0) ${target.matrix}`;
            }
            // suppress the synthetic click that follows mouseup after a drag
            this._swallowNextClick = true;
            setTimeout(() => { this._swallowNextClick = false; }, 50);
            setTimeout(() => {
                var _a;
                this._committing = false;
                if (!target)
                    return;
                const oldImage = this._currentImage;
                const idx = ctx.images.indexOf(oldImage);
                const newImage = ctx.images[idx + direction];
                if (!newImage)
                    return;
                ctx.notifyClose(oldImage);
                oldImage.setAttribute('data-zoomed', 'false');
                oldImage.style.removeProperty('visibility');
                (_a = clone.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(clone);
                // promote the peek to be the new active clone
                target.el.style.transition = '';
                target.el.style.transform = target.matrix;
                target.el.className = 'zooom-clone';
                target.el.style.willChange = '';
                target.el.style.pointerEvents = '';
                target.el.setAttribute('data-zoomed', 'true');
                target.el.addEventListener('click', () => {
                    if (!ctx.closeButton)
                        ctx.zoomOut();
                });
                this._currentImage = newImage;
                ctx.setCurrentImage(newImage);
                newImage.setAttribute('data-zoomed', 'true');
                newImage.style.setProperty('visibility', 'hidden');
                this._clonedImg = target.el;
                ctx.setClone(target.el);
                this._showNavigation();
                ctx.notifyOpen(newImage);
                // upgrade peek to the big image if it hasn't been loaded yet
                const bigImage = newImage.getAttribute('data-zooom-big');
                if (bigImage) {
                    loadImage(newImage, bigImage).then(() => {
                        document.body.classList.remove('zooom-loading');
                        if (this._clonedImg === target.el && newImage.dataset.zoooomSrc) {
                            target.el.src = newImage.dataset.zoooomSrc;
                        }
                    });
                }
            }, dur);
        }
        _computeCloneTransform(image) {
            var _a;
            const rect = resolveImageRect(image);
            const { clientWidth, clientHeight, offsetWidth } = document.documentElement;
            const scroll = clientWidth - offsetWidth;
            const X = (clientWidth - scroll) / 2 - rect.left - rect.width / 2;
            const Y = -rect.top + (clientHeight - rect.height) / 2;
            const ratio = rect.height / rect.width;
            // when data-zooom-big is still set, the gallery img element holds only the thumbnail —
            // its naturalWidth would yield a too-small scale. prefer the preloaded big image's
            // dimensions; if that isn't loaded yet, fall back to clientWidth (assume viewport-fill)
            // so the peek lands at roughly the same size the post-load clone will end up at.
            const bigUrl = image.getAttribute('data-zooom-big');
            let maxWidth;
            if (bigUrl) {
                const preloaded = this._preloaded.get(bigUrl);
                maxWidth = (preloaded && preloaded.naturalWidth > 0)
                    ? preloaded.naturalWidth
                    : clientWidth;
            }
            else {
                maxWidth = image.naturalWidth
                    || parseInt((_a = image.getAttribute('width')) !== null && _a !== void 0 ? _a : '0')
                    || rect.width;
            }
            if (maxWidth >= clientWidth)
                maxWidth = clientWidth;
            const maxHeight = maxWidth * ratio;
            if (maxHeight >= clientHeight)
                maxWidth = (maxWidth * clientHeight) / maxHeight;
            const scale = maxWidth !== rect.width ? maxWidth / rect.width : 1;
            return { rect, scale, X, Y };
        }
    }

    return SliderPlugin;

})();
//# sourceMappingURL=zooom-slider.js.map
