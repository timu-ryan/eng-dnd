import {createContext, useContext, useRef, useState} from "react";
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

  return (
    <DndContainer>
      <div className={cls.innerContainer}>
        <h2>draggable container</h2>

        <div className={cls.itemscontainer}>
          {items.map((item) => (
            <DraggableItem key={item.id}>
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

const DndContext = createContext<any>({})

function DndContextProvider({ children }: any) {

  const [currentNode, setCurrentNode] = useState<Node | null>(null)

  return (
    <DndContext.Provider value={{ currentNode, setCurrentNode }}>
      {children}
    </DndContext.Provider>
  )
}

function DndContainer(props: any) {
  const {
    children,
  } = props;

  function handlePointerDown() {
    console.log('down')
  }

  function handlePointerUp() {
    console.log('up')
  }

  return (
    <DndContextProvider>
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {children}
        <DraggableItemOverlay />
      </div>
    </DndContextProvider>
  )
}

function DraggableItemOverlay(props: any) {

  const ctx = useContext(DndContext);


  return (
    <div
      style={{
        position: "fixed",
      }}
    >
      {ctx.currentNode}
    </div>
  )
}

function DraggableItem(props: any) {
  const {
    children,
  } = props;

  const ctx = useContext(DndContext);

  const handlePointerDown = (e: any) => {
    e.preventDefault();
    ctx.setCurrentNode(children);
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
  } = props;

  const ctx = useContext(DndContext);

  const [arrivedNodes, setArrivedNodes] = useState<any>([]);

  function handlePointerUp() {
    if (ctx.currentNode === null) {
      return;
    }
    setArrivedNodes((prev: any) => [...prev, ctx.currentNode]);
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
