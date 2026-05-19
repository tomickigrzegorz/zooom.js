export interface ConstructorObject {
  zIndex?: number;
  animationTime?: number;
  overlay?: string;
  cursor?: ObjectCursor;
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
}

export interface PanZoomOptions {
  /** Maximum scale beyond the core's fit-to-viewport base. Default: 3 */
  maxScale?: number;
  /** Scale applied on double-click (and reverted on next double-click). Default: 2 */
  doubleClickScale?: number;
  /** Scale delta applied per mouse-wheel tick. Default: 0.15 */
  wheelStep?: number;
}
