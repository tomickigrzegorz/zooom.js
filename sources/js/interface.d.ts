/**
 * @interface ImageParameters
 */
interface ImageParameters {
  naturalWidth: number,
  naturalHeight: number,
  clientWidth: number,
  clientHeight: number
}

interface ConstructorObject {
  padding?: number;
  zIndex?: number;
  animationTime?: number;
  cursor?: Object<ObjectCursor>;
  overlay?: Object<ObjectOverlay>;
  onLoaded?: Function;
  onCleared?: Function;
}

/**
 * @interface ObjectCursor
 * type of cursors
 */
interface ObjectCursor {
  in?: string;
  out?: string;
}

/**
 * @interface ObjectOverlay
 * 
 */
interface ObjectOverlay {
  color?: string;
  opacity?: number;
}