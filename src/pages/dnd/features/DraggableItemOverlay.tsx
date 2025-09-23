import {forwardRef} from "react";
import { useDndStartPoint, useDndCurrentNode } from "./hooks";

type DraggableItemOverlayProps = {};

const DraggableItemOverlay = forwardRef<HTMLDivElement, DraggableItemOverlayProps>(
  function(props, ref) {
    const {

    } = props;

    const { startPoint, offset } = useDndStartPoint()
    const { currentNode } = useDndCurrentNode()

    if (!startPoint || !offset) return null

    return (
      <div
        ref={ref}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          transform: `translate(${startPoint.x - offset.x}px, ${startPoint.y - offset.y}px)`,
        }}
      >
        {currentNode}
      </div>
    )
  }
)

export default DraggableItemOverlay;
