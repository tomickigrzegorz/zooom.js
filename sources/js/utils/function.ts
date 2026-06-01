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
const resolveImageRect = (
  image: HTMLImageElement
): { width: number; height: number; left: number; top: number } => {
  const r = image.getBoundingClientRect();
  let width = r.width;
  let height = r.height;
  if (width > 0 && height > 0) {
    return { width, height, left: r.left, top: r.top };
  }
  const nw = image.naturalWidth;
  const nh = image.naturalHeight;
  const aw = parseFloat(image.getAttribute("width") || "") || 0;
  const ah = parseFloat(image.getAttribute("height") || "") || 0;
  // ratio = height / width
  const ratio = nw > 0 && nh > 0 ? nh / nw : aw > 0 && ah > 0 ? ah / aw : 0;
  if (width > 0 && ratio > 0) height = width * ratio;
  else if (height > 0 && ratio > 0) width = height / ratio;
  else {
    width = width || nw || aw;
    height = height || nh || ah;
  }
  // never hand back a zero box — fall back to intrinsic/attribute size as a last resort
  if (!(width > 0)) width = nw || aw || 1;
  if (!(height > 0)) height = nh || ah || 1;
  return { width, height, left: r.left, top: r.top };
};

export { fadeIn, fadeOut, debounce, loadImage, resolveImageRect };
