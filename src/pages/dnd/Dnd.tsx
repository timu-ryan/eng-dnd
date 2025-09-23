import {useState} from "react";

import cls from './Dnd.module.scss'

import {
  DndContainer,
  DraggableItem,
  DndStorage,
} from './features'

type Word = {
  id: string;
  value: string;
}

const words: Word[] = [
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

  const [items, setItems] = useState<Word[]>(words);
  const [storageItems, setStorageItems] = useState<Word[]>([]);

  const [currentItemId, setCurrentItemId] = useState<string>('');

  function handleDrop() {
    const currentItem = items.find(item => item.id === currentItemId)
    if (currentItem) {
      setItems(prev => prev.filter(item => item.id !== currentItemId));
      setStorageItems(prev => [...prev, currentItem]);
    }

  }

  function handlePointerDown(id: string) {
    setCurrentItemId(id);
  }

  function handleCheckStorage() {
    console.log(storageItems)
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
          <button
            onClick={handleCheckStorage}
          >
            check storage
          </button>
        </div>
        <div className={cls.storage}>
          <DndStorage
            className={cls.dndstorage}
            onDrop={handleDrop}
          >
            <p className={cls.storagetext}>
              put it here
            </p>
          </DndStorage>
        </div>

      </div>
    </DndContainer>
  )
}

export default Dnd
