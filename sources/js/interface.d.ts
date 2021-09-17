interface ConstructorObject {
  zIndex?: number;
  animationTime?: number;
  overlay?: ObjectOverlay;
  cursor?: ObjectCursor;
  onResize?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
}

interface ObjectCursor {
  in?: string;
  out?: string;
}

interface ObjectOverlay {
  color?: string;
  opacity?: number;
}
