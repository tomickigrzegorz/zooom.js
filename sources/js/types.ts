export interface ConstructorObject {
  zIndex?: number;
  animationTime?: number;
  overlay?: string;
  cursor?: ObjectCursor;
  closeButton?: boolean;
  onResize?: () => void;
  onOpen?: (image: HTMLElement) => void;
  onClose?: (image: HTMLElement) => void;
}

export interface ObjectCursor {
  in?: string;
  out?: string;
}

export interface ZooomPlugin {
  name: string;
  install(ctx: ZooomContext): void;
  uninstall?(): void;
}

export type ZooomEvent = 'open' | 'close' | 'keydown' | 'init';

export interface ZooomContext {
  readonly images: HTMLElement[];
  readonly currentImage: HTMLElement;
  readonly currentClone: HTMLImageElement | null;
  readonly animTime: number;
  readonly zIndex: number;
  readonly overlayLayer: HTMLDivElement;
  readonly closeButton: boolean;
  on(event: ZooomEvent, handler: (...args: any[]) => void): void;
  zoomIn(image: HTMLElement, instant?: boolean): void;
  zoomOut(): void;
  addStyle(css: string): void;
  setCurrentImage(image: HTMLElement): void;
  setClone(img: HTMLImageElement): void;
  notifyOpen(image: HTMLElement): void;
  notifyClose(image: HTMLElement): void;
}

export interface SliderOptions {
  // 'slide' animates a translateX between adjacent images; omitted = instant swap
  effect?: 'slide';
  counter?: boolean;
  // preload N neighbour images on each side (with `data-zooom-big`) for instant navigation; 0 disables
  preload?: number;
  /**
   * Hide prev/next navigation buttons. Keyboard arrows, swipe and mouse-drag still work.
   * - `true` — always hide
   * - number — hide when viewport width is ≤ this value (px)
   * - `'mobile'` — hide on coarse-pointer (touch) devices
   * - function — custom predicate, re-evaluated on every open and on window resize
   */
  hideButtons?: boolean | number | 'mobile' | (() => boolean);
  /**
   * Visual spacing in pixels between adjacent images during swipe/drag and the
   * `effect: 'slide'` animation. Default: 0 (images sit edge to edge).
   */
  gap?: number;
  /**
   * Toggle the `zooom-loading` class on `<body>` while navigating to an image that
   * isn't loaded yet (host page styles the spinner — the demo CSS ships one).
   * - `true` — always show while loading
   * - `'auto'` — only on slow networks, via `navigator.connection.effectiveType`
   *   (≤ 3g) or `saveData`. Silently does nothing in browsers without the API.
   * - function — custom predicate, evaluated per navigation
   * - omitted / `false` — never show (default)
   */
  loadingIndicator?: boolean | 'auto' | (() => boolean);
}

export interface PanZoomOptions {
  /** Maximum scale beyond the core's fit-to-viewport base. Default: 3 */
  maxScale?: number;
  /** Scale applied on double-click (and reverted on next double-click). Default: 2 */
  doubleClickScale?: number;
  /** Scale delta applied per mouse-wheel tick. Default: 0.15 */
  wheelStep?: number;
}
