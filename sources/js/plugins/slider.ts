/**
 * SliderPlugin — navigation between zoomed images
 * Usage: new Zooom('zooom', options).use(new SliderPlugin({ effect: 'slide' }))
 */
export default class SliderPlugin implements ZooomPlugin {
  name = 'zooom-slider';

  private _ctx!: ZooomContext;
  private _prevBtn: HTMLButtonElement | null = null;
  private _nextBtn: HTMLButtonElement | null = null;
  private _clonedImg: HTMLImageElement | null = null;
  private _isSliding: boolean = false;
  private _slideTimeout: ReturnType<typeof setTimeout> | null = null;
  private _pendingOutgoing: HTMLImageElement | null = null;
  private _pendingOutgoingOriginal: HTMLElement | null = null;
  private _currentImage: HTMLElement | null = null;
  private _options: SliderOptions;
  private _touchStartX: number = 0;
  private _counterEl: HTMLDivElement | null = null;

  constructor(options: SliderOptions = {}) {
    this._options = options;
  }

  install(ctx: ZooomContext): void {
    this._ctx = ctx;

    if (ctx.images.length > 1) {
      ctx.addStyle(this._buildCss());
      this._createButtons();
      if (this._options.counter) this._createCounter();
    }

    ctx.on('open', (image: HTMLElement) => {
      // during slide navigation we manage the clone ourselves
      if (this._isSliding) return;
      this._currentImage = image;
      this._clonedImg = document.querySelector('.zooom-clone') as HTMLImageElement;
      if (this._clonedImg) {
        this._clonedImg.addEventListener('click', () => ctx.zoomOut());
      }
      this._showNavigation();
    });

    ctx.on('close', () => {
      // during slide navigation we manage the state ourselves
      if (this._isSliding) return;

      if (this._slideTimeout !== null) {
        clearTimeout(this._slideTimeout);
        this._slideTimeout = null;
      }
      // restore previous image if its timeout was cancelled
      if (this._pendingOutgoing) {
        this._pendingOutgoing.parentNode?.removeChild(this._pendingOutgoing);
        this._pendingOutgoing = null;
      }
      if (this._pendingOutgoingOriginal) {
        // data-zoomed already set to false at slide start; just restore visibility
        this._pendingOutgoingOriginal.style.removeProperty('visibility');
        this._pendingOutgoingOriginal = null;
      }
      this._hideNavigation();
      this._currentImage = null;
      this._clonedImg = null;
    });

    ctx.on('keydown', (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') this._navigateBy(-1);
      else if (event.key === 'ArrowRight') this._navigateBy(1);
    });

    document.addEventListener('touchstart', this._handleTouchStart, { passive: true });
    document.addEventListener('touchend', this._handleTouchEnd, { passive: true });
  }

  private _buildCss(): string {
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
      parts.push(
        `.zooom-counter{position:fixed;top:16px;left:16px;z-index:${z};`,
        `background:rgba(255,255,255,0.85);border-radius:20px;padding:4px 12px;`,
        `font-size:14px;font-family:sans-serif;opacity:0;pointer-events:none;`,
        `transition:opacity 200ms ease-in-out;box-shadow:0 2px 8px rgba(0,0,0,0.2);}`,
        `.zooom-counter.visible{opacity:1;}`,
      );
    }
    return parts.join('');
  }

  private _createButtons(): void {
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

  private _createCounter(): void {
    this._counterEl = document.createElement('div');
    this._counterEl.className = 'zooom-counter';
    document.body.appendChild(this._counterEl);
  }

  private _navigateBy(direction: number): void {
    const ctx = this._ctx;
    const currentImage = this._currentImage;
    if (!currentImage) return;

    const currentIndex = ctx.images.indexOf(currentImage as HTMLElement);
    const nextIndex = currentIndex + direction;

    if (nextIndex < 0 || nextIndex >= ctx.images.length) return;

    const nextImage = ctx.images[nextIndex] as HTMLImageElement;
    const bigImage = nextImage.getAttribute('data-zooom-big');

    if (this._slideTimeout !== null) {
      clearTimeout(this._slideTimeout);
      this._slideTimeout = null;
      this._pendingOutgoing?.parentNode?.removeChild(this._pendingOutgoing);
      this._pendingOutgoing = null;
      if (this._pendingOutgoingOriginal) {
        this._pendingOutgoingOriginal.setAttribute('data-zoomed', 'false');
        this._pendingOutgoingOriginal.style.removeProperty('visibility');
        this._pendingOutgoingOriginal = null;
      }
    }

    const proceed = () => {
      if (this._options.effect === 'slide') {
        this._navigateWithSlide(nextImage, direction);
      } else {
        this._clonedImg?.parentNode?.removeChild(this._clonedImg);
        (currentImage as HTMLElement).setAttribute('data-zoomed', 'false');
        (currentImage as HTMLElement).style.removeProperty('visibility');
        ctx.notifyClose(currentImage);
        ctx.zoomIn(nextImage, true);
      }
    };

    if (bigImage) {
      this._loadImage(nextImage, bigImage).then(() => {
        document.body.classList.remove('zooom-loading');
        proceed();
      });
    } else if ((nextImage as HTMLImageElement).naturalWidth === 0) {
      nextImage.loading = 'eager';
      nextImage.addEventListener('load', proceed, { once: true });
      nextImage.addEventListener('error', proceed, { once: true });
    } else {
      proceed();
    }
  }

  private _loadImage(target: HTMLImageElement, bigImage: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let newImage = new Image();
      newImage.onload = function () { resolve('image loaded'); };
      newImage.onerror = function () { reject(`image ${bigImage} not loaded`); };
      document.body.classList.add('zooom-loading');
      newImage.src = bigImage;
      target.src = newImage.src;
      target.dataset.zoooomSrc = newImage.src;
      target.removeAttribute('data-zooom-big');
    });
  }

  private _navigateWithSlide(nextImage: HTMLImageElement, direction: number): void {
    const ctx = this._ctx;
    const animTime = ctx.animTime;
    const { clientWidth } = document.documentElement;

    const outgoing = this._clonedImg;
    const outgoingOriginal = this._currentImage!;

    this._isSliding = true;
    ctx.notifyClose(outgoingOriginal);

    if (outgoing) {
      // capture the current visual bounds (after any active transform) and create
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
      slideOutgoing.style.transition = 'none';
      document.body.appendChild(slideOutgoing);
      outgoing.parentNode?.removeChild(outgoing);
      slideOutgoing.offsetWidth;

      slideOutgoing.style.transition = `transform ${animTime}ms ease-in-out`;
      slideOutgoing.style.transform = `translateX(${-clientWidth * direction}px)`;

      outgoingOriginal.setAttribute('data-zoomed', 'false');
      this._pendingOutgoing = slideOutgoing;
      this._pendingOutgoingOriginal = outgoingOriginal;
      this._slideTimeout = setTimeout(() => {
        this._slideTimeout = null;
        this._pendingOutgoing = null;
        this._pendingOutgoingOriginal = null;
        slideOutgoing.parentNode?.removeChild(slideOutgoing);
        outgoingOriginal.style.removeProperty('visibility');
      }, animTime);
    }

    this._currentImage = nextImage;
    ctx.setCurrentImage(nextImage);
    nextImage.setAttribute('data-zoomed', 'true');
    this._cloneImgSlide(nextImage, clientWidth * direction);

    this._showNavigation();
    ctx.notifyOpen(nextImage);
    this._isSliding = false;
  }

  private _cloneImgSlide(image: HTMLImageElement, slideFromX: number): void {
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
      || parseInt(image.getAttribute('width') ?? '0')
      || width;
    maxWidth >= clientWidth && (maxWidth = clientWidth);
    const maxHeight = maxWidth * ratio;
    maxHeight >= clientHeight && (maxWidth = (maxWidth * clientHeight) / maxHeight);
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

  private _showNavigation(): void {
    if (!this._prevBtn || !this._nextBtn || !this._currentImage) return;
    const index = this._ctx.images.indexOf(this._currentImage as HTMLElement);
    this._prevBtn.classList.toggle('visible', index > 0);
    this._nextBtn.classList.toggle('visible', index < this._ctx.images.length - 1);
    if (this._counterEl) {
      this._counterEl.textContent = `${index + 1} / ${this._ctx.images.length}`;
      this._counterEl.classList.add('visible');
    }
  }

  private _hideNavigation(): void {
    this._prevBtn?.classList.remove('visible');
    this._nextBtn?.classList.remove('visible');
    this._counterEl?.classList.remove('visible');
  }

  private _handleTouchStart = (event: TouchEvent): void => {
    if (!this._currentImage) return;
    this._touchStartX = event.changedTouches[0].clientX;
  };

  private _handleTouchEnd = (event: TouchEvent): void => {
    if (!this._currentImage) return;
    const dx = event.changedTouches[0].clientX - this._touchStartX;
    if (Math.abs(dx) < 50) return;
    this._navigateBy(dx < 0 ? 1 : -1);
  };
}
