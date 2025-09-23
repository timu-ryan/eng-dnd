import type {ReactNode, PointerEvent} from "react";
import {useDndCurrentNode, useDndStartPoint } from "./hooks";

type Props = {
  children: ReactNode;
  onPointerDown?: () => void; // оставляю обязательным как в твоём использовании
};

export default function DraggableItem(props: Props) {
  const {
    children,
    onPointerDown = () => {},
  } = props;

  const { setCurrentNode } = useDndCurrentNode()
  const { setStartPoint } = useDndStartPoint();

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setCurrentNode(children);
    setStartPoint({x: e.clientX, y: e.clientY});

    // дополнительные действия, которые нужно сделать при взятии элемента
    onPointerDown();
  }

  return (
    <div
      onPointerDown={handlePointerDown}
    >
      {children}
    </div>
  )
}
