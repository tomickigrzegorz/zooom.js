interface ConstructorObject {
  zIndex?: number;
  animationTime?: number;
  overlay?: ObjectOverlay;
  cursor?: ObjectCursor;
  onLoaded?: () => void;
  onCleared?: () => void;
}

interface ObjectCursor {
  in?: string;
  out?: string;
}

interface ObjectOverlay {
  color?: string;
  opacity?: number;
}