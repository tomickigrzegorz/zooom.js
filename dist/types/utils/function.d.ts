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
export { fadeIn, fadeOut, debounce, loadImage };
