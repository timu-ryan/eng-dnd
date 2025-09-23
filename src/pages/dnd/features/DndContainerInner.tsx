import {useRef} from "react";
import type { PointerEvent, ReactNode } from "react";

import DraggableItemOverlay from "./DraggableItemOverlay";
import { useDndCurrentNode, useDndStartPoint } from "./hooks";

type Props = { children: ReactNode };

export default function DndContainerInner(props: Props) {
  const {
    children,
  } = props;

  const { setStartPoint, setOffset, offset } = useDndStartPoint()
  const { setCurrentNode } = useDndCurrentNode()
  const overlayElRef = useRef<HTMLDivElement | null>(null)

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    setStartPoint({ x: e.clientX, y: e.clientY });

    setOffset({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  }

  function handlePointerUp() {
    setStartPoint(null);
    setCurrentNode(null);
    setOffset(null);
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!overlayElRef.current || !offset) return

    overlayElRef.current.style.transform = `translate(${e.clientX - offset.x}px, ${e.clientY - offset.y}px)`;
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <DraggableItemOverlay ref={overlayElRef}/>
      {children}
    </div>
  )
}
