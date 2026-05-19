import type { PanZoomOptions, ZooomContext, ZooomPlugin } from "../types";
export type { PanZoomOptions };
/**
 * PanZoomPlugin — wheel/dblclick/pinch/pan zoom on the active Zooom clone.
 * Usage: new Zooom('img-zoom').use(new ZooomSlider()).use(new ZooomPanZoom())
 * Order matters: install AFTER SliderPlugin so PanZoom layers on top.
 */
export default class PanZoomPlugin implements ZooomPlugin {
    name: string;
    private _ctx;
    private _options;
    private _clone;
    private _base;
    private _current;
    private _installed;
    private _clickTimer;
    private _clickPending;
    private _animating;
    private _panStart;
    private _panStartCurrent;
    private _panActive;
    private _panMoved;
    private _pinchActive;
    private _pinchStartDist;
    private _pinchStartScale;
    private _pinchAnchor;
    private _touchPanActive;
    private _touchPanStart;
    private _touchPanStartCurrent;
    constructor(options?: PanZoomOptions);
    install(ctx: ZooomContext): void;
    uninstall(): void;
    get isZoomed(): boolean;
    private _onOpen;
    private _onClose;
    /**
     * Parse `matrix(a,0,0,d,tx,ty)` (the shape the core writes).
     * Falls back to identity if the transform is empty or unparseable —
     * defensive: should never happen because the core always writes matrix().
     */
    private _parseTransform;
    private _applyTransform;
    private _onWheel;
    /**
     * Apply a scale multiplier anchored on (anchorX, anchorY) viewport coords,
     * clamping the resulting scale to [_base.scale, _base.scale * maxScale].
     */
    private _zoomAt;
    private _onClick;
    private _doubleClickToggle;
    private _onMouseDown;
    private _onMouseMove;
    private _onMouseUp;
    private _firstTwoTouches;
    private _onTouchStart;
    private _onTouchMove;
    private _onTouchEnd;
    /**
     * Clamp _current.{x,y} so the clone's visual bounding box never moves past
     * the viewport edge. The clone has CSS width/height equal to the original
     * thumbnail's rect; the displayed size is (width|height) * _current.scale.
     */
    private _clampPan;
}
