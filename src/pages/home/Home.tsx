
import cls from './Home.module.scss'
import {useEffect, useRef, useState} from "react";
import type {PointerEvent, MouseEvent} from "react";

type Word = {
  id: number;
  word: string;
};

type Coord = {
  x: number;
  y: number;
};


const sentences: string[] = [
  "he wanted to go in the zoo",
  "when they decided to go to the party?",
  "i've been to England",
  "i used to go to the gym",
  "Mark tried his best",
]

const DELETE_DELAY = 300;


// TODO: вынести в хуки
// TODO: проверить вынос за контейнер и очистить event listener
// TODO: проверить работу на телефоне


export const Home = () => {

  const [wordList, setWordList] = useState<Word[]>([]);
  const [storageWordList, setStorageWordList] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);

  const storageRef = useRef<HTMLUListElement>(null);
  const dragZoneContainerRef = useRef<HTMLDivElement>(null);

  const overlayPosRef = useRef<Coord>({ x: 0, y: 0 });
  const overlayElRef = useRef<HTMLDivElement | null>(null);

  // для возврата слова в начальное положение, если оно не попало в storage
  const [isMouseUp, setIsMouseUp] = useState<boolean>(false);

  const dragStartRef = useRef<Coord>({x:0,y:0});
  const offsetRef = useRef<Coord>({x:0,y:0});

  const [currentSentence, setCurrentSentence] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isAnswerVisible, setIsAnswerVisible] = useState<boolean>(false);

  // for managing word lists
  function handleRestart() {
    setIsCorrect(null)
    const wordObjectArray = currentSentence.split(' ').map((item, index) => ({
      id: index,
      word: item,
    }))
    setWordList(wordObjectArray);
    setStorageWordList([]);
  }

  function handleSetNewSentence() {
    setIsAnswerVisible(false)
    setStorageWordList([]);
    setIsCorrect(null)
    const randomIndex = Math.floor(Math.random() * sentences.length);
    const wordArray = sentences[randomIndex].split(' ')
    setCurrentSentence(sentences[randomIndex])
    console.log(sentences[randomIndex])
    const wordObjectArray = wordArray.map((item, index) => ({
      id: index,
      word: item,
    }))
    setWordList(wordObjectArray);
  }

  function handleCheck() {
    const storageWordArray = storageWordList.map((item) => item.word)
    let storageString = storageWordArray.join(' ')

    if (storageString === currentSentence) {
      setIsCorrect(true)
      return
    }
    setIsCorrect(false)
  }

  function showAnswer() {
     setIsAnswerVisible(true);
  }

  // задать начальное слово
  useEffect(() => {
    handleSetNewSentence()
  }, []);

  function handleRemoveWordFromStorage(e: MouseEvent) {
    const currentWord: Word = {
      id: Number(e.currentTarget.id),
      word: e.currentTarget.innerHTML
    }
    setWordList(prev => [...prev, currentWord]);
    setStorageWordList(prev => prev.filter((item) => item.id !== currentWord.id));
  }


  // отловить курсор вне drag контейнера
  useEffect(() => {
    window.addEventListener("pointermove", (e) => {
      if (dragZoneContainerRef.current) {
        const rect = dragZoneContainerRef.current.getBoundingClientRect();
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        ) {
          setIsMouseUp(true)

          // вернуть в начальное положение если вышли за пределы
          requestAnimationFrame(() => {
            if (overlayElRef.current) {
              overlayElRef.current.style.transform =
                `translate(${dragStartRef.current.x}px, ${dragStartRef.current.y}px)`;
            }
          })
          setTimeout(() => {
            setCurrentWord(null)
          }, DELETE_DELAY)
        }
      }
    })
  }, [])


  function handleMouseDown(e: PointerEvent<HTMLDivElement>) {
    setCurrentWord(null);
    setIsMouseUp(false)

    const id = (e.target as HTMLDivElement).closest('li')?.id;
    const word = wordList.find((word) => String(word.id) === id);
    if (!word) return;

    // отменяем выделение текста если нажимаем в li в слове
    e.preventDefault();

    // размещение в точке взятия
    const offset = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY};
    offsetRef.current = offset;

    const startPoint: Coord = {x: e.clientX - offset.x, y: e.clientY - offset.y};
    overlayPosRef.current = startPoint;

    requestAnimationFrame(() => {
      if (overlayElRef.current) {
        overlayElRef.current.style.transform =
          `translate(${startPoint.x}px, ${startPoint.y}px)`;
      }
    })
    // начало drag чтобы потом вернуть в это положение
    dragStartRef.current = startPoint;
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
            `translate(${dragStartRef.current.x}px, ${dragStartRef.current.y}px)`;
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
          `translate(${dragStartRef.current.x}px, ${dragStartRef.current.y}px)`;
      }
      return
    }
    requestAnimationFrame(() => {
      overlayPosRef.current = { x: e.clientX - offsetRef.current.x, y: e.clientY - offsetRef.current.y };
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
      <button
        className={cls.button}
        onClick={handleRestart}
      >try again</button>
      <button
        className={cls.button}
        onClick={handleSetNewSentence}
      >
        get new exercise
      </button>
      <button
        onClick={handleCheck}
        className={cls.button}
      >
        check if it's right
      </button>
      <button
        className={cls.button}
        onClick={showAnswer}
      >
        show answer
      </button>

      {isCorrect === false && <p style={{ color: 'red' }}>it's incorrect! Try again</p>}
      {isCorrect === true && <p style={{ color: 'green' }}>it's correct! Congratulations!</p>}

      {isAnswerVisible && (<>
        <p>correct answer: {currentSentence}</p>
      </>)}

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
          <li
            key={word.id}
            id={String(word.id)}
            onClick={handleRemoveWordFromStorage}
            className={cls.listItem}
          >
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