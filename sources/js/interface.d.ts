interface ConstructorObject {
  zIndex?: number;
  animationTime?: number;
  overlay?: string;
  cursor?: ObjectCursor;
  onResize?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
}

interface ObjectCursor {
  in?: string;
  out?: string;
}
