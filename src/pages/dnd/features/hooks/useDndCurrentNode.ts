import { useContext } from "react";
import { DndCurrentNodeContext } from "../DndContextProvider";

export function useDndCurrentNode() {
  return useContext(DndCurrentNodeContext);
}

export default useDndCurrentNode;
