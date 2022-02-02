/**
 * @function fadeIn - fade in overlay div layer
 *
 * @param {HTMLDivElement} overlay - add class and opacity to overlay div layer
 * @param {Stieng} bgrWithOpacity - opacity of overlay div layer
 */
const fadeIn = (overlay: HTMLDivElement, bgrWithOpacity?: string) => {
  overlay.className = "zooom-overlay-in";
  overlay.style.pointerEvents = "auto";
  overlay.style.background = String(bgrWithOpacity);
};

/**
 * @function fadeOut - fade out overlay div layer
 *
 * @param {HTMLDivElement} overlay - remove class and style from overlay div
 */
const fadeOut = (overlay: HTMLDivElement) => {
  overlay.classList.remove("zooom-overlay-in");
  overlay.removeAttribute("style");
};

/**
 * @function debounce - debounce function
 *
 * @param {Function} fn function
 * @param {Number} ms time
 */
const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export { fadeIn, fadeOut, debounce };
