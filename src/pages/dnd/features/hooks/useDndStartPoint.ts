import { useContext } from "react";
import { DndStartPointContext } from "../DndContextProvider";

export function useDndStartPoint() {
  return useContext(DndStartPointContext);
}

export default useDndStartPoint;
