
import cls from './Home.module.scss'
import {useRef, useState} from "react";
import type {PointerEvent} from "react";

type Word = {
  id: number;
  word: string;
};

type Coord = {
  x: number;
  y: number;
};

const initialWordList: Word[] = [
  { id: 1, word: "he" },
  { id: 2, word: "wanted" },
  { id: 3, word: "to" },
  { id: 4, word: "go" },
  { id: 5, word: "in" },
  { id: 6, word: "the" },
  { id: 7, word: "zoo" },
];

const DELETE_DELAY = 500;


// TODO: вынести в хуки
// TODO:
//  при переносе элементов из контейнера нужно возвращать в начальное положение
//  как отловить выход из контейнера если Mouse Move ловит только внутри контейнера
export const Home = () => {

  const [wordList, setWordList] = useState<Word[]>(initialWordList);
  const [storageWordList, setStorageWordList] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);

  const storageRef = useRef<HTMLUListElement>(null);
  const dragZoneContainerRef = useRef<HTMLDivElement>(null);

  // const [overlayPos, setOverlayPos] = useState<Coord>({x:0,y:0});
  const overlayPosRef = useRef<Coord>({ x: 0, y: 0 });
  const overlayElRef = useRef<HTMLDivElement | null>(null);

  const [offset, setOffset] = useState<Coord>({x:0,y:0});

  // для возврата слова в начальное положение, если оно не попало в storage
  const [isMouseUp, setIsMouseUp] = useState<boolean>(false);
  const [dragStartCoord, setDragStartCoord] = useState<Coord>({x:0,y:0});

  function handleMouseDown(e: PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    setCurrentWord(null);
    setIsMouseUp(false)

    const id = (e.target as HTMLDivElement).closest('li')?.id;
    const word = wordList.find((word) => String(word.id) === id);
    if (!word) return;

    // размещение в точке взятия
    const offset = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY};
    setOffset(offset);

    // setOverlayPos({x: e.clientX - offset.x, y: e.clientY - offset.y});
    overlayPosRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };

    // начало drag чтобы потом вернуть в это положение
    setDragStartCoord({x: e.clientX - offset.x, y: e.clientY - offset.y});

    setCurrentWord(word);
  }

  function handleMouseUp(e: PointerEvent<HTMLDivElement>) {
    if (!currentWord) return;

    setIsMouseUp(true)
    if (storageRef.current) {
      const rect = storageRef.current.getBoundingClientRect();
      // если отпустить внутри storage
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        setStorageWordList((prev) => [...prev, currentWord]);
        setWordList((prev) => prev.filter((w) => w.id !== currentWord.id));
        // удалим сразу
        setCurrentWord(null);
      } else {
        if (overlayElRef.current) {
          overlayElRef.current.style.transform =
            `translate(${dragStartCoord.x}px, ${dragStartCoord.y}px)`;
        }
        setTimeout(() => {
          // отложим удаление чтобы он вернулся назад
          setCurrentWord(null);
        }, DELETE_DELAY)
      }
    }
  }

  function handleMouseMove(e: PointerEvent<HTMLDivElement>) {

    if (!currentWord || isMouseUp) {
      // были баги, mouseMove может пойматься после mouseUp
      if (overlayElRef.current) {
        overlayElRef.current.style.transform =
          `translate(${dragStartCoord.x}px, ${dragStartCoord.y}px)`;
      }
      return
    }
    requestAnimationFrame(() => {
      // setOverlayPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      overlayPosRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
      if (overlayElRef.current) {
        overlayElRef.current.style.transform =
          `translate(${overlayPosRef.current.x}px, ${overlayPosRef.current.y}px)`;
      }
    })
  }

  return (
    <div
      className={cls.container}
      onPointerUp={handleMouseUp}
      onPointerDown={handleMouseDown}
      ref={dragZoneContainerRef}
      onPointerMove={handleMouseMove}
    >
      <ul className={cls.list}>
        {wordList.map((word: Word) => (
          <li
            key={word.id}
            id={String(word.id)}
            className={cls.listItem}
            style={{
              opacity: word.id === currentWord?.id ? 0.5 : 1,
            }}
          >
            {word.word}
          </li>
        ))}
      </ul>

      <ul
        className={cls.storage}
        ref={storageRef}
      >
        {storageWordList.map((word: Word) => (
          <li key={word.id} className={cls.listItem}>
            {word.word}
          </li>
        ))}
      </ul>

      {currentWord && (
        <div
          className={cls.overlay}
          ref={overlayElRef}
          style={{
            transition: isMouseUp ? `transform ${DELETE_DELAY}ms` : "none",
          }}
        >
          <div className={cls.listItem}>
            {currentWord.word}
          </div>
        </div>
      )}
    </div>
  )
}