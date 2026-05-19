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

/**
 * @function loadImage - swap thumbnail src for a full-size image, resolving when loaded
 */
const loadImage = (target: HTMLImageElement, bigImage: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const newImage = new Image();
    newImage.onload = () => resolve("image loaded");
    newImage.onerror = () => reject(`image ${bigImage} not loaded`);
    document.body.classList.add("zooom-loading");
    newImage.src = bigImage;
    target.src = newImage.src;
    target.dataset.zoooomSrc = newImage.src;
    target.removeAttribute("data-zooom-big");
  });
};

export { fadeIn, fadeOut, debounce, loadImage };
