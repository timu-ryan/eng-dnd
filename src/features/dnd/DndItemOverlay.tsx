import type { ReactNode} from "react";
import {usePointerDnd} from "@/features/dnd/usePointerDnd";


interface DndItemProps {
  children?: ReactNode;
  isVisible: boolean;
}

export const DndOverlayItem = (props: DndItemProps) => {
  const {
    children,
    isVisible,
  } = props;

  const { overlayElRef } = usePointerDnd({})
  console.log(overlayElRef.current);

  return (
    <div
      ref={overlayElRef}
      style={{
        visibility: isVisible ? "visible" : "hidden",
      }}
    >
      {children}
    </div>
  )
}