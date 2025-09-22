import {createContext, useContext, useLayoutEffect, useRef, useState} from "react";
import type { PointerEvent } from "react";
import cls from './Dnd.module.scss'


const words = [
  {
    id: '1',
    value: 'one',
  },
  {
    id: '2',
    value: 'two',
  },
  {
    id: '3',
    value: 'three',
  },
  {
    id: '4',
    value: 'four',
  },
  {
    id: '5',
    value: 'five',
  }
]

const Dnd = () => {

  const [items, setItems] = useState(words)

  const [currentItemId, setCurrentItemId] = useState<string>('');

  function handleDrop() {
    setItems(prev => prev.filter((item) => item.id !== currentItemId));
  }

  function handlePointerDown(id: any) {
    setCurrentItemId(id);
  }

  return (
    <DndContainer>
      <div className={cls.innerContainer}>
        <h2>draggable container</h2>

        <div className={cls.itemscontainer}>
          {items.map((item) => (
            <DraggableItem
              key={item.id}
              onPointerDown={() => handlePointerDown(item.id)}
            >
              <div className={cls.item}>
                {item.value}
              </div>
            </DraggableItem>
          ))}
        </div>

        <div>
          <h3>storage</h3>
        </div>
        <div className={cls.storage}>
          <DndStorage
            className={cls.dndstorage}
            onDrop={handleDrop}
          >
            <p style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}>
              put it here
            </p>
          </DndStorage>
        </div>

      </div>
    </DndContainer>
  )
}

export default Dnd

const DndCurrentNodeContext = createContext<any>({})
const DndStartPointContext = createContext<any>({})

function DndContextProvider({ children }: any) {

  const [currentNode, setCurrentNode] = useState<Node | null>(null)
  const [startPoint, setStartPoint] = useState<{x: number, y: number} | null>(null)
  const [offset, setOffset] = useState<{x: number, y: number} | null>(null)

  return (
    <DndCurrentNodeContext.Provider value={{ currentNode, setCurrentNode }}>
      <DndStartPointContext.Provider value={{ startPoint, setStartPoint, offset, setOffset }}>
        {children}
      </DndStartPointContext.Provider>
    </DndCurrentNodeContext.Provider>
  )
}

function DndContainer(props: any) {
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

function DndContainerInner(props: any) {
  const {
    children,
  } = props;

  const { setStartPoint, setOffset, offset } = useContext(DndStartPointContext)
  const { setCurrentNode } = useContext(DndCurrentNodeContext)
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
    if (!overlayElRef.current) return

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


function DraggableItemOverlay(props: any) {
  const {
    ref,
  } = props;

  const currentNodeCtx = useContext(DndCurrentNodeContext);
  const startPointCtx = useContext(DndStartPointContext)

  const {startPoint, offset} = startPointCtx

  if (!startPointCtx.startPoint) return null

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
      {currentNodeCtx.currentNode}
    </div>
  )
}

function DraggableItem(props: any) {
  const {
    children,
    onPointerDown,
  } = props;

  const currentNodeCtx = useContext(DndCurrentNodeContext);
  const startPointCtx = useContext(DndStartPointContext);

  const handlePointerDown = (e: any) => {
    e.preventDefault();
    currentNodeCtx.setCurrentNode(children);
    startPointCtx.setStartPoint({x: e.clientX, y: e.clientY});

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


// хранилище куда складывать drag item, занимает 100% ширины и в
function DndStorage(props: any) {
  const {
    children,
    className,
    onDrop,
  } = props;

  const ctx = useContext(DndCurrentNodeContext);

  const [arrivedNodes, setArrivedNodes] = useState<any>([]);

  function handlePointerUp() {
    if (ctx.currentNode === null) {
      return;
    }
    setArrivedNodes((prev: any) => [...prev, ctx.currentNode]);

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
