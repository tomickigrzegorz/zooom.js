/**
 * @function fadeIn - fade in overlay div layer
 *
 * @param {HTMLDivElement} overlay - add class and opacity to overlay div layer
 * @param {Stieng} bgrWithOpacity - opacity of overlay div layer
 */
declare const fadeIn: (overlay: HTMLDivElement, bgrWithOpacity?: string) => void;
/**
 * @function fadeOut - fade out overlay div layer
 *
 * @param {HTMLDivElement} overlay - remove class and style from overlay div
 */
declare const fadeOut: (overlay: HTMLDivElement) => void;
/**
 * @function debounce - debounce function
 *
 * @param {Function} fn function
 * @param {Number} ms time
 */
declare const debounce: (fn: Function, ms?: number) => (this: any, ...args: any[]) => void;
/**
 * @function loadImage - swap thumbnail src for a full-size image, resolving when loaded
 */
declare const loadImage: (target: HTMLImageElement, bigImage: string) => Promise<string>;
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
declare const resolveImageRect: (image: HTMLImageElement) => {
    width: number;
    height: number;
    left: number;
    top: number;
};
export { fadeIn, fadeOut, debounce, loadImage, resolveImageRect };
