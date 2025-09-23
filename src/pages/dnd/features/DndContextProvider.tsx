import {createContext, useState} from "react";
import type {ReactNode, Dispatch, SetStateAction} from "react";

type Point = { x: number; y: number };

type DndCurrentNodeCtx = {
  currentNode: ReactNode | null;
  setCurrentNode: Dispatch<SetStateAction<ReactNode | null>>;
};

type DndStartPointCtx = {
  startPoint: Point | null;
  setStartPoint: Dispatch<SetStateAction<Point | null>>;
  offset: Point | null;
  setOffset: Dispatch<SetStateAction<Point | null>>;
};

export const DndCurrentNodeContext = createContext<DndCurrentNodeCtx>({
  currentNode: null,
  setCurrentNode: () => {},
});

export const DndStartPointContext = createContext<DndStartPointCtx>({
  startPoint: null,
  setStartPoint: () => {},
  offset: null,
  setOffset: () => {},
});

type ProviderProps = { children: ReactNode };

export default function DndContextProvider({ children }: ProviderProps) {
  const [currentNode, setCurrentNode] = useState<ReactNode | null>(null);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [offset, setOffset] = useState<Point | null>(null);

  return (
    <DndCurrentNodeContext.Provider value={{ currentNode, setCurrentNode }}>
      <DndStartPointContext.Provider value={{ startPoint, setStartPoint, offset, setOffset }}>
        {children}
      </DndStartPointContext.Provider>
    </DndCurrentNodeContext.Provider>
  )
}
