import {useState} from "react";
import type { ReactNode } from "react";
import { useDndCurrentNode } from "./hooks";

type Props = {
  children?: ReactNode;
  className?: string;
  onDrop?: () => void; // оставляю обязательным, чтобы не менять логику вызова onDrop()
};

// хранилище куда складывать drag item, занимает 100% ширины и в
export default function DndStorage(props: Props) {
  const {
    children,
    className,
    onDrop = () => {},
  } = props;

  const {currentNode} = useDndCurrentNode()

  const [arrivedNodes, setArrivedNodes] = useState<any>([]);

  function handlePointerUp() {
    if (currentNode === null) {
      return;
    }
    setArrivedNodes((prev: any) => [...prev, currentNode]);

    // дополнительные действия, которые нужно делать при попадании элемента в storage
    onDrop();
  }

  return (
    <div
      onPointerUp={handlePointerUp}
      className={className}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {children}
      {arrivedNodes}
    </div>
  )
}
