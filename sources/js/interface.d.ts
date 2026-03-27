interface ConstructorObject {
  zIndex?: number;
  animationTime?: number;
  overlay?: string;
  cursor?: ObjectCursor;
  onResize?: () => void;
  onOpen?: (image: HTMLElement) => void;
  onClose?: (image: HTMLElement) => void;
}

interface ObjectCursor {
  in?: string;
  out?: string;
}

interface ZooomPlugin {
  name: string;
  install(ctx: ZooomContext): void;
}

type ZooomEvent = 'open' | 'close' | 'keydown' | 'init';

interface ZooomContext {
  readonly images: HTMLElement[];
  readonly currentImage: HTMLElement;
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

interface SliderOptions {
  effect?: 'slide';
  counter?: boolean;
}
