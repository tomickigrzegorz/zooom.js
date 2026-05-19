/*!
* Zooom.js SliderPlugin - navigation plugin for Zooom
* @version v1.2.0
* @link https://github.com/tomickigrzegorz/zooom.js
* @license MIT
*/
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
        this._touchStartX = 0;
        this._counterEl = null;
        this._installed = false;
        this._preloaded = new Set();
        this._handleTouchStart = (event) => {
            if (!this._currentImage)
                return;
            this._touchStartX = event.changedTouches[0].clientX;
        };
        this._handleTouchEnd = (event) => {
            if (!this._currentImage)
                return;
            const dx = event.changedTouches[0].clientX - this._touchStartX;
            if (Math.abs(dx) < 50)
                return;
            this._navigateBy(dx < 0 ? 1 : -1);
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
                this._clonedImg.addEventListener('click', () => ctx.zoomOut());
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
        document.addEventListener('touchend', this._handleTouchEnd, { passive: true });
    }
    uninstall() {
        var _a, _b, _c;
        this._installed = false;
        this._cancelPendingSlide();
        (_a = this._prevBtn) === null || _a === void 0 ? void 0 : _a.remove();
        (_b = this._nextBtn) === null || _b === void 0 ? void 0 : _b.remove();
        (_c = this._counterEl) === null || _c === void 0 ? void 0 : _c.remove();
        this._prevBtn = null;
        this._nextBtn = null;
        this._counterEl = null;
        this._preloaded.clear();
        document.removeEventListener('touchstart', this._handleTouchStart);
        document.removeEventListener('touchend', this._handleTouchEnd);
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
        const url = el.getAttribute('data-zooom-big');
        if (!url || this._preloaded.has(url))
            return;
        this._preloaded.add(url);
        const img = new Image();
        img.src = url;
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
            nextImage.addEventListener('load', proceed, { once: true });
            nextImage.addEventListener('error', proceed, { once: true });
        }
        else {
            proceed();
        }
    }
    _navigateWithSlide(nextImage, direction) {
        var _a;
        const ctx = this._ctx;
        const animTime = ctx.animTime;
        const { clientWidth } = document.documentElement;
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
            slideOutgoing.style.position = 'fixed';
            slideOutgoing.style.top = `${rect.top}px`;
            slideOutgoing.style.left = `${rect.left}px`;
            slideOutgoing.style.width = `${rect.width}px`;
            slideOutgoing.style.height = `${rect.height}px`;
            document.body.appendChild(slideOutgoing);
            (_a = outgoing.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(outgoing);
            outgoingOriginal.setAttribute('data-zoomed', 'false');
            const anim = slideOutgoing.animate([
                { transform: 'translateX(0)' },
                { transform: `translateX(${-clientWidth * direction}px)` },
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
        this._cloneImgSlide(nextImage, clientWidth * direction);
        this._showNavigation();
        ctx.notifyOpen(nextImage);
        this._isSliding = false;
    }
    _cloneImgSlide(image, slideFromX) {
        var _a;
        const ctx = this._ctx;
        this._clonedImg = document.createElement('img');
        const src = image.dataset.zoooomSrc || image.currentSrc || image.src;
        const { width, height, left, top } = image.getBoundingClientRect();
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
        img.addEventListener('click', () => ctx.zoomOut());
    }
    _showNavigation() {
        if (!this._prevBtn || !this._nextBtn || !this._currentImage)
            return;
        const index = this._ctx.images.indexOf(this._currentImage);
        this._prevBtn.classList.toggle('visible', index > 0);
        this._nextBtn.classList.toggle('visible', index < this._ctx.images.length - 1);
        if (this._counterEl) {
            this._counterEl.textContent = `${index + 1} / ${this._ctx.images.length}`;
            this._counterEl.classList.add('visible');
        }
    }
    _hideNavigation() {
        var _a, _b, _c;
        (_a = this._prevBtn) === null || _a === void 0 ? void 0 : _a.classList.remove('visible');
        (_b = this._nextBtn) === null || _b === void 0 ? void 0 : _b.classList.remove('visible');
        (_c = this._counterEl) === null || _c === void 0 ? void 0 : _c.classList.remove('visible');
    }
}

export { SliderPlugin as default };
//# sourceMappingURL=zooom-slider.es.js.map
