import type { ConstructorObject, ObjectCursor, ZooomContext, ZooomEvent, ZooomPlugin } from "./types";
export type { ConstructorObject, ObjectCursor, ZooomContext, ZooomEvent, ZooomPlugin, };
/**
 * @class Zooom
 */
export default class Zooom {
    private _element;
    private _dataAttr;
    private _overlayId;
    _imageZooom: HTMLImageElement;
    private _clonedImg;
    private _zIndex;
    private _cursorIn?;
    private _cursorOut?;
    private _overlay?;
    _animTime?: number;
    _overlayLayer: HTMLDivElement;
    private _onResize;
    private _onOpen;
    private _onClose;
    _allImages: HTMLElement[];
    private _plugins;
    private _listeners;
    private _coreClones;
    private _returnFocus;
    constructor(className: string, { zIndex, animationTime, cursor, overlay, onResize, onOpen, onClose, }: ConstructorObject);
    use: (plugin: ZooomPlugin) => this;
    _createContext: () => ZooomContext;
    _emit: (event: ZooomEvent, ...args: any[]) => void;
    _eventHandle: () => void;
    _event: () => void;
    _cursorType: ({ in: zIn, out: zOut }?: ObjectCursor) => void;
    _handleClick: (event: MouseEvent) => void;
    _handleEvent: () => void;
    _handleKeydown: (event: KeyboardEvent) => void;
    _createStyleAndAddToHead: () => void;
    _zooomInit: (instant?: boolean) => void;
    _cloneImg: (image: HTMLImageElement, instant?: boolean) => void;
    _reset: () => void;
}
