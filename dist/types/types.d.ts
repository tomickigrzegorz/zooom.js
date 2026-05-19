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
    effect?: 'slide';
    counter?: boolean;
    preload?: number;
}
