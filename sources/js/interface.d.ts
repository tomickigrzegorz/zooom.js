interface ConstructorObject {
  zIndex?: number;
  animationTime?: number;
  overlay?: string;
  cursor?: ObjectCursor;
  navigation?: boolean;
  navigationEffect?: 'slide';
  onResize?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
}

interface ObjectCursor {
  in?: string;
  out?: string;
}
