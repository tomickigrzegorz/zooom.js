import type { SliderOptions, ZooomContext, ZooomPlugin } from "../types";
export type { SliderOptions };
/**
 * SliderPlugin — navigation between zoomed images
 * Usage: new Zooom('zooom', options).use(new SliderPlugin({ effect: 'slide' }))
 */
export default class SliderPlugin implements ZooomPlugin {
    name: string;
    private _ctx;
    private _prevBtn;
    private _nextBtn;
    private _clonedImg;
    private _isSliding;
    private _pendingSlide;
    private _currentImage;
    private _options;
    private _drag;
    private _committing;
    private _swallowNextClick;
    private _counterEl;
    private _installed;
    private _preloaded;
    constructor(options?: SliderOptions);
    install(ctx: ZooomContext): void;
    uninstall(): void;
    private _preloadNeighbours;
    private _preloadOne;
    private _buildCss;
    private _createButtons;
    private _createCounter;
    private _cancelPendingSlide;
    private _navigateBy;
    private _shouldShowLoading;
    private _navigateWithSlide;
    private _cloneImgSlide;
    private _showNavigation;
    private _shouldHideButtons;
    private _handleResize;
    private _hideNavigation;
    private _handleMouseDown;
    private _handleMouseMove;
    private _handleMouseUp;
    private _handleTouchStart;
    private _handleTouchMove;
    private _handleTouchEnd;
    private _handleClickCapture;
    private _canBeginDrag;
    private _beginDrag;
    private _updateDrag;
    private _createPeeks;
    private _createPeek;
    /**
     * Resolve a displayable URL for a peek synchronously — critical for a not-yet-loaded
     * <picture><img>, where `image.currentSrc` is empty and `image.src` is the bare fallback
     * (often absent, which resolves to the page URL → broken/empty peek). Reads the matching
     * <source>/srcset so the peek shows the right image immediately instead of waiting for the
     * async eager-load to fill it in.
     */
    private _resolvePeekSrc;
    /** First candidate URL from a `srcset` string ("a.jpg 1x, b.jpg 2x" → "a.jpg"), absolutised. */
    private _firstSrcsetUrl;
    private _applyDragOffset;
    private _endDrag;
    private _abortDrag;
    private _cancelDrag;
    private _commitDrag;
    private _computeCloneTransform;
}
