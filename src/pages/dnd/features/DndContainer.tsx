import DndContextProvider from "./DndContextProvider";
import DndContainerInner from "./DndContainerInner";
import type {ReactNode} from "react";

type Props = { children: ReactNode };

export default function DndContainer(props: Props) {
  const {
    children,
  } = props;

  return (
    <DndContextProvider>
      <DndContainerInner>
        {children}
      </DndContainerInner>
    </DndContextProvider>
  )
}
