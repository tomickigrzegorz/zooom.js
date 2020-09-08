interface ImageParameters {
  naturalWidth: number,
  naturalHeight: number,
  clientWidth: number,
  clientHeight: number
}

interface ConstructorObject {
  zIndex?: number;
  animationTime?: number;
  cursor?: Object<ObjectCursor>;
  overlay?: Object<ObjectOverlay>;
  onLoaded?: Function;
  onCleared?: Function;
}

interface ObjectCursor {
  in?: string;
  out?: string;
}

interface ObjectOverlay {
  color?: string;
  opacity?: number;
}