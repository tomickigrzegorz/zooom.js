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
  private _clickTimer: ReturnType<typeof setTimeout> | null = null;
  private _clickPending: { x: number; y: number } | null = null;
  private _animating = false;

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
  }

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
    if (this._clickTimer !== null) { clearTimeout(this._clickTimer); this._clickTimer = null; }
    this._clickPending = null;
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
    this._base = this._parseTransform(clone.style.transform);
    this._current = { ...this._base };
  }

  private _onClose(): void {
    if (!this._installed) return;
    this._clone = null;
    this._base = { scale: 1, x: 0, y: 0 };
    this._current = { scale: 1, x: 0, y: 0 };
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
    this._current = {
      scale: newS,
      x: anchorX - (anchorX - this._current.x) * ratio,
      y: anchorY - (anchorY - this._current.y) * ratio,
    };
    this._clampPan();
    this._applyTransform();
  }

  private _onClick = (event: MouseEvent): void => {
    if (!this._installed || !this._clone) return;
    // ignore clicks on slider buttons — they should still work
    const target = event.target as Element | null;
    if (target && target.closest && target.closest('.zooom-nav-btn')) return;
    // suppress core's window-level close handler for *every* click while we own the zoom
    event.stopPropagation();

    if (this._clickTimer !== null) {
      // second click within window → dblclick
      clearTimeout(this._clickTimer);
      this._clickTimer = null;
      this._clickPending = null;
      this._doubleClickToggle(event.clientX, event.clientY);
      return;
    }
    this._clickPending = { x: event.clientX, y: event.clientY };
    this._clickTimer = setTimeout(() => {
      this._clickTimer = null;
      this._clickPending = null;
      this._ctx.zoomOut();
    }, 300);
  };

  private _doubleClickToggle(anchorX: number, anchorY: number): void {
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
    if (!this._installed || !this._clone || !this.isZoomed) return;
    if (event.button !== 0) return;
    this._panActive = true;
    this._panMoved = false;
    this._panStart = { x: event.clientX, y: event.clientY };
    this._panStartCurrent = { x: this._current.x, y: this._current.y };
  };

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
    // if the mouse actually moved, suppress the synthetic click that follows mouseup
    // so _onClick doesn't fire a close on what was really a drag gesture
    if (this._panMoved) {
      event.stopPropagation();
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
    const c = this._clone;
    if (!c) return;
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const w = c.clientWidth  * this._current.scale;
    const h = c.clientHeight * this._current.scale;
    const baseLeft = c.offsetLeft - (w - c.clientWidth)  / 2;
    const baseTop  = c.offsetTop  - (h - c.clientHeight) / 2;
    const minX = (vw - w) - baseLeft;
    const maxX = -baseLeft;
    const minY = (vh - h) - baseTop;
    const maxY = -baseTop;
    if (w <= vw) this._current.x = (minX + maxX) / 2;
    else         this._current.x = Math.min(maxX, Math.max(minX, this._current.x));
    if (h <= vh) this._current.y = (minY + maxY) / 2;
    else         this._current.y = Math.min(maxY, Math.max(minY, this._current.y));
  }
}
