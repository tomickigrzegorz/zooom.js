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
    private _touchStartX;
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
    private _navigateWithSlide;
    private _cloneImgSlide;
    private _showNavigation;
    private _hideNavigation;
    private _handleTouchStart;
    private _handleTouchEnd;
}
