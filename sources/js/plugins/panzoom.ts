import type { PanZoomOptions, ZooomContext, ZooomPlugin } from "../types";

export type { PanZoomOptions };

type Vec = { scale: number; x: number; y: number };

const DEFAULTS: Required<PanZoomOptions> = {
  maxScale: 3,
  doubleClickScale: 2,
  wheelStep: 0.15,
};

/**
 * PanZoomPlugin — wheel/dblclick/pinch/pan zoom on the active Zooom clone.
 * Usage: new Zooom('img-zoom').use(new ZooomSlider()).use(new ZooomPanZoom())
 * Order matters: install AFTER SliderPlugin so PanZoom layers on top.
 */
export default class PanZoomPlugin implements ZooomPlugin {
  name = 'zooom-panzoom';

  private _ctx!: ZooomContext;
  private _options: Required<PanZoomOptions>;
  private _clone: HTMLImageElement | null = null;
  private _base: Vec = { scale: 1, x: 0, y: 0 };
  private _current: Vec = { scale: 1, x: 0, y: 0 };
  private _installed = false;
  private _animating = false;

  // cached layout reads — populated in _onOpen, used in _clampPan to avoid forced
  // reflows on every mousemove. invalidated on close and on window resize.
  private _layout: { vw: number; vh: number; baseW: number; baseH: number; offsetLeft: number; offsetTop: number } | null = null;

  private _panStart = { x: 0, y: 0 };
  private _panStartCurrent = { x: 0, y: 0 };
  private _panActive = false;
  private _panMoved = false;

  private _pinchActive = false;
  private _pinchStartDist = 0;
  private _pinchStartScale = 1;
  private _pinchAnchor = { x: 0, y: 0 };
  private _touchPanActive = false;
  private _touchPanStart = { x: 0, y: 0 };
  private _touchPanStartCurrent = { x: 0, y: 0 };

  constructor(options: PanZoomOptions = {}) {
    this._options = { ...DEFAULTS, ...options };
  }

  install(ctx: ZooomContext): void {
    this._ctx = ctx;
    this._installed = true;
    ctx.on('open',  (image: HTMLElement) => this._onOpen(image as HTMLImageElement));
    ctx.on('close', () => this._onClose());
    document.addEventListener('wheel', this._onWheel, { capture: true, passive: false });
    document.addEventListener('click', this._onClick, { capture: true });
    document.addEventListener('mousedown', this._onMouseDown, { capture: true });
    document.addEventListener('mousemove', this._onMouseMove, { capture: true });
    document.addEventListener('mouseup',   this._onMouseUp,   { capture: true });
    document.addEventListener('touchstart', this._onTouchStart, { capture: true, passive: false });
    document.addEventListener('touchmove',  this._onTouchMove,  { capture: true, passive: false });
    document.addEventListener('touchend',   this._onTouchEnd,   { capture: true, passive: false });
    document.addEventListener('touchcancel',this._onTouchEnd,   { capture: true, passive: false });
    window.addEventListener('resize', this._onResize);
  }

  private _onResize = (): void => {
    if (this._clone) this._cacheLayout();
  };

  uninstall(): void {
    this._installed = false;
    document.removeEventListener('wheel', this._onWheel, { capture: true } as EventListenerOptions);
    document.removeEventListener('click', this._onClick, { capture: true } as EventListenerOptions);
    document.removeEventListener('mousedown', this._onMouseDown, { capture: true } as EventListenerOptions);
    document.removeEventListener('mousemove', this._onMouseMove, { capture: true } as EventListenerOptions);
    document.removeEventListener('mouseup',   this._onMouseUp,   { capture: true } as EventListenerOptions);
    document.removeEventListener('touchstart', this._onTouchStart, { capture: true } as EventListenerOptions);
    document.removeEventListener('touchmove',  this._onTouchMove,  { capture: true } as EventListenerOptions);
    document.removeEventListener('touchend',   this._onTouchEnd,   { capture: true } as EventListenerOptions);
    document.removeEventListener('touchcancel',this._onTouchEnd,   { capture: true } as EventListenerOptions);
    window.removeEventListener('resize', this._onResize);
    this._clone = null;
    this._base = { scale: 1, x: 0, y: 0 };
    this._current = { scale: 1, x: 0, y: 0 };
  }

  get isZoomed(): boolean {
    return this._current.scale > this._base.scale + 1e-6;
  }

  private _onOpen(_image: HTMLImageElement): void {
    if (!this._installed) return;
    const clone = this._ctx.currentClone;
    if (!clone) return;
    this._clone = clone;
    // prevent native HTML5 image drag — otherwise the browser shows a drag ghost
    // and swallows mouseup, leaving _panActive stuck as true
    clone.draggable = false;
    clone.addEventListener('dragstart', this._preventDrag);
    clone.style.cursor = 'grab';
    // hint compositor — keeps transform updates on the GPU during pan, avoids repaints
    clone.style.willChange = 'transform';
    // iOS Safari: disable native pinch/double-tap zoom, long-press callout (Save Image),
    // selection and image drag — otherwise these gestures fight our pan/zoom handlers
    clone.style.touchAction = 'none';
    (clone.style as CSSStyleDeclaration & { webkitTouchCallout?: string; webkitUserSelect?: string; webkitUserDrag?: string }).webkitTouchCallout = 'none';
    clone.style.userSelect = 'none';
    (clone.style as CSSStyleDeclaration & { webkitUserSelect?: string }).webkitUserSelect = 'none';
    (clone.style as CSSStyleDeclaration & { webkitUserDrag?: string }).webkitUserDrag = 'none';
    this._cacheLayout();
    this._base = this._parseTransform(clone.style.transform);
    this._current = { ...this._base };
  }

  private _cacheLayout(): void {
    const c = this._clone;
    if (!c) { this._layout = null; return; }
    this._layout = {
      vw: document.documentElement.clientWidth,
      vh: document.documentElement.clientHeight,
      baseW: c.clientWidth,
      baseH: c.clientHeight,
      offsetLeft: c.offsetLeft,
      offsetTop: c.offsetTop,
    };
  }

  private _preventDrag = (e: Event): void => { e.preventDefault(); };

  private _onClose(): void {
    if (!this._installed) return;
    if (this._clone) {
      this._clone.removeEventListener('dragstart', this._preventDrag);
      this._clone.style.willChange = '';
      this._clone.style.touchAction = '';
      (this._clone.style as CSSStyleDeclaration & { webkitTouchCallout?: string; webkitUserSelect?: string; webkitUserDrag?: string }).webkitTouchCallout = '';
      this._clone.style.userSelect = '';
      (this._clone.style as CSSStyleDeclaration & { webkitUserSelect?: string }).webkitUserSelect = '';
      (this._clone.style as CSSStyleDeclaration & { webkitUserDrag?: string }).webkitUserDrag = '';
    }
    this._clone = null;
    this._layout = null;
    this._base = { scale: 1, x: 0, y: 0 };
    this._current = { scale: 1, x: 0, y: 0 };
    this._panActive = false;
    this._panMoved = false;
    this._pinchActive = false;
    this._touchPanActive = false;
    this._animating = false;
  }

  /**
   * Parse `matrix(a,0,0,d,tx,ty)` (the shape the core writes).
   * Falls back to identity if the transform is empty or unparseable —
   * defensive: should never happen because the core always writes matrix().
   */
  private _parseTransform(t: string): Vec {
    const m = /matrix\(\s*([-\d.]+)\s*,\s*[-\d.]+\s*,\s*[-\d.]+\s*,\s*[-\d.]+\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/.exec(t);
    if (!m) return { scale: 1, x: 0, y: 0 };
    return { scale: parseFloat(m[1]), x: parseFloat(m[2]), y: parseFloat(m[3]) };
  }

  private _applyTransform(): void {
    const c = this._clone;
    if (!c) return;
    const { scale, x, y } = this._current;
    // ensure instant pan/wheel — slider sets inline `transition: transform Nms` on its clones,
    // which would otherwise animate every mousemove and make pan feel laggy.
    // only allow CSS transition while we're animating a click toggle.
    if (!this._animating && c.style.transition !== 'none') c.style.transition = 'none';
    c.style.transform = `matrix(${scale},0,0,${scale},${x},${y})`;
  }

  private _onWheel = (event: WheelEvent): void => {
    if (!this._installed || !this._clone) return;
    event.preventDefault();
    const direction = event.deltaY > 0 ? -1 : 1; // wheel up => zoom in
    const factor = 1 + direction * this._options.wheelStep;
    this._zoomAt(factor, event.clientX, event.clientY);
  };

  /**
   * Apply a scale multiplier anchored on (anchorX, anchorY) viewport coords,
   * clamping the resulting scale to [_base.scale, _base.scale * maxScale].
   */
  private _zoomAt(factor: number, anchorX: number, anchorY: number): void {
    const minS = this._base.scale;
    const maxS = this._base.scale * this._options.maxScale;
    const oldS = this._current.scale;
    const newS = Math.min(maxS, Math.max(minS, oldS * factor));
    if (newS === oldS) return;
    const ratio = newS / oldS;
    // CSS transform-origin defaults to center, so the matrix translation tx is RELATIVE
    // to the element's natural CSS center, not to viewport origin. Anchor math must
    // subtract the natural center to keep the cursor's pixel under the cursor.
    const L = this._layout;
    const cx = L ? L.offsetLeft + L.baseW / 2 : 0;
    const cy = L ? L.offsetTop  + L.baseH / 2 : 0;
    this._current = {
      scale: newS,
      x: (anchorX - cx) * (1 - ratio) + ratio * this._current.x,
      y: (anchorY - cy) * (1 - ratio) + ratio * this._current.y,
    };
    this._clampPan();
    this._applyTransform();
  }

  private _onClick = (event: MouseEvent): void => {
    if (!this._installed || !this._clone) return;
    // ignore clicks on slider/close buttons — they should still work
    const target = event.target as Element | null;
    if (target && target.closest && target.closest('.zooom-nav-btn,.zooom-close-btn')) return;
    // click outside the image (overlay/backdrop) → don't intercept; let the core's
    // window-level handler close the zoom, matching Escape / close-button behaviour
    if (target !== this._clone) return;
    // click landed on the clone — we own the toggle; block core's close handler
    event.stopPropagation();
    // synthetic click after a pan gesture — don't toggle, just consume
    if (this._panMoved) {
      this._panMoved = false;
      return;
    }
    this._toggleZoom(event.clientX, event.clientY);
  };

  private _toggleZoom(anchorX: number, anchorY: number): void {
    if (!this._clone || this._animating) return;
    const target = this.isZoomed ? this._base.scale : this._base.scale * this._options.doubleClickScale;
    const factor = target / this._current.scale;
    // briefly enable a CSS transition for the animated toggle
    this._animating = true;
    const c = this._clone;
    const prev = c.style.transition;
    c.style.transition = 'transform 200ms ease-out';
    this._zoomAt(factor, anchorX, anchorY);
    const finish = () => {
      c.style.transition = prev || 'none';
      this._animating = false;
      c.removeEventListener('transitionend', finish);
    };
    c.addEventListener('transitionend', finish, { once: true });
    // safety fallback if transitionend doesn't fire
    setTimeout(finish, 260);
  }

  private _onMouseDown = (event: MouseEvent): void => {
    if (!this._installed || !this._clone) return;
    if (event.button !== 0) return;
    // a fresh primary-button press starts a new gesture — clear any stale post-pan
    // flag here, BEFORE the isZoomed guard. otherwise: pan while zoomed (sets
    // _panMoved), wheel out to base scale (isZoomed→false), then click — the guard
    // below would early-return and leave _panMoved set, so _onClick consumes the
    // click as a synthetic post-drag click instead of toggling the zoom.
    this._panMoved = false;
    if (!this.isZoomed) return;
    // when zoomed, we own the gesture — block slider's bubble-phase mousedown so
    // pan drags don't get reinterpreted as swipe-to-navigate on release
    event.stopPropagation();
    // belt-and-suspenders: also blocks native image drag if dragstart handler somehow misses
    event.preventDefault();
    this._cancelAnim();
    this._panActive = true;
    this._panStart = { x: event.clientX, y: event.clientY };
    this._panStartCurrent = { x: this._current.x, y: this._current.y };
    this._clone.style.cursor = 'grabbing';
  };

  private _cancelAnim(): void {
    if (!this._animating || !this._clone) return;
    this._clone.style.transition = 'none';
    this._animating = false;
  }

  private _onMouseMove = (event: MouseEvent): void => {
    if (!this._panActive) return;
    event.preventDefault();
    const dx = event.clientX - this._panStart.x;
    const dy = event.clientY - this._panStart.y;
    if (!this._panMoved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) this._panMoved = true;
    this._current = {
      scale: this._current.scale,
      x: this._panStartCurrent.x + dx,
      y: this._panStartCurrent.y + dy,
    };
    this._clampPan();
    this._applyTransform();
  };

  private _onMouseUp = (event: MouseEvent): void => {
    if (!this._panActive) return;
    this._panActive = false;
    if (this._clone) this._clone.style.cursor = 'grab';
    // we owned this gesture (mousedown was stopProp'd above) — mirror that on release
    // so slider's bubble-phase mouseup doesn't see it and try to navigate
    event.stopPropagation();
    // if the mouse actually moved, suppress the synthetic click that follows mouseup
    // so _onClick doesn't fire a toggle on what was really a drag gesture
    if (this._panMoved) {
      const swallow = (e: Event) => { e.stopPropagation(); document.removeEventListener('click', swallow, true); };
      document.addEventListener('click', swallow, { capture: true });
      // also drop the swallow if no click follows
      setTimeout(() => document.removeEventListener('click', swallow, true), 50);
    }
  };

  private _firstTwoTouches(list: TouchList): [Touch, Touch] | null {
    if (list.length < 2) return null;
    const arr: Touch[] = [];
    for (let i = 0; i < list.length; i++) arr.push(list[i]);
    arr.sort((a, b) => a.identifier - b.identifier);
    return [arr[0], arr[1]];
  }

  private _onTouchStart = (event: TouchEvent): void => {
    if (!this._installed || !this._clone) return;

    const two = this._firstTwoTouches(event.touches);
    if (two) {
      // two-finger pinch start
      event.stopPropagation();
      event.preventDefault();
      this._cancelAnim();
      this._pinchActive = true;
      this._touchPanActive = false;
      const [t1, t2] = two;
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      this._pinchStartDist = Math.hypot(dx, dy) || 1;
      this._pinchStartScale = this._current.scale;
      this._pinchAnchor = { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
      return;
    }

    // single finger
    if (this.isZoomed) {
      // we own the gesture — pan, and block slider's bubble-phase swipe
      event.stopPropagation();
      this._cancelAnim();
      const t = event.touches[0];
      this._touchPanActive = true;
      this._touchPanStart = { x: t.clientX, y: t.clientY };
      this._touchPanStartCurrent = { x: this._current.x, y: this._current.y };
    }
    // else: at base scale, let slider's bubble-phase listener handle the swipe
  };

  private _onTouchMove = (event: TouchEvent): void => {
    if (!this._installed || !this._clone) return;

    if (this._pinchActive) {
      const two = this._firstTwoTouches(event.touches);
      if (!two) return;
      event.stopPropagation();
      event.preventDefault();
      const [t1, t2] = two;
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      const dist = Math.hypot(dx, dy) || 1;
      const targetScale = this._pinchStartScale * (dist / this._pinchStartDist);
      const factor = targetScale / this._current.scale;
      // anchor stays at the original midpoint — feels stable to the user
      this._zoomAt(factor, this._pinchAnchor.x, this._pinchAnchor.y);
      return;
    }

    if (this._touchPanActive) {
      event.stopPropagation();
      event.preventDefault();
      const t = event.touches[0];
      const dx = t.clientX - this._touchPanStart.x;
      const dy = t.clientY - this._touchPanStart.y;
      this._current = {
        scale: this._current.scale,
        x: this._touchPanStartCurrent.x + dx,
        y: this._touchPanStartCurrent.y + dy,
      };
      this._clampPan();
      this._applyTransform();
      return;
    }

    // at base scale, single-finger move → let it bubble to slider
    if (this.isZoomed) {
      // defensive: zoomed but no pan/pinch state — still block slider
      event.stopPropagation();
    }
  };

  private _onTouchEnd = (event: TouchEvent): void => {
    if (!this._installed || !this._clone) return;

    if (this._pinchActive) {
      event.stopPropagation();
      // if one finger remains, transition to pan with the remaining finger as anchor
      if (event.touches.length === 1) {
        const t = event.touches[0];
        this._pinchActive = false;
        this._touchPanActive = true;
        this._touchPanStart = { x: t.clientX, y: t.clientY };
        this._touchPanStartCurrent = { x: this._current.x, y: this._current.y };
      } else if (event.touches.length === 0) {
        this._pinchActive = false;
      }
      return;
    }

    if (this._touchPanActive) {
      event.stopPropagation();
      if (event.touches.length === 0) this._touchPanActive = false;
      return;
    }

    // single-finger touch ended at base scale — let slider handle it.
    // While isZoomed but no pan started, still block bubble (defensive).
    if (this.isZoomed) event.stopPropagation();
  };

  /**
   * Clamp _current.{x,y} so the clone's visual bounding box never moves past
   * the viewport edge. The clone has CSS width/height equal to the original
   * thumbnail's rect; the displayed size is (width|height) * _current.scale.
   */
  private _clampPan(): void {
    const L = this._layout;
    if (!L) return;
    const w = L.baseW * this._current.scale;
    const h = L.baseH * this._current.scale;
    const baseLeft = L.offsetLeft - (w - L.baseW) / 2;
    const baseTop  = L.offsetTop  - (h - L.baseH) / 2;
    const minX = (L.vw - w) - baseLeft;
    const maxX = -baseLeft;
    const minY = (L.vh - h) - baseTop;
    const maxY = -baseTop;
    if (w <= L.vw) this._current.x = (minX + maxX) / 2;
    else           this._current.x = Math.min(maxX, Math.max(minX, this._current.x));
    if (h <= L.vh) this._current.y = (minY + maxY) / 2;
    else           this._current.y = Math.min(maxY, Math.max(minY, this._current.y));
  }
}
