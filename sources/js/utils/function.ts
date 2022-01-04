/**
 *
 * @param overlay - add class and opacity to overlay div layer
 * @param opacity - opacity of overlay div layer
 */
const fadeIn = (overlay: HTMLDivElement, opacity: number | undefined) => {
  overlay.className = 'zooom-overlay-in';
  overlay.style.opacity = String(opacity);
  overlay.style.pointerEvents = 'auto';
};

/**
 *
 * @param overlay - remove class and style from overlay div
 */
const fadeOut = (overlay: HTMLDivElement) => {
  overlay.classList.remove('zooom-overlay-in');
  overlay.removeAttribute('style');
};

/**
 * debounce function
 *
 * @param fn function
 * @param ms time
 * @returns function
 */
const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export { fadeIn, fadeOut, debounce };
