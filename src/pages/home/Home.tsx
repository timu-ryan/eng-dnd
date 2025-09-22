
import cls from './Home.module.scss'
import {SyntheticEvent, useEffect, useRef, useState} from "react";
import type {MouseEvent} from "react";
// import { DndContainer } from '@/features/dnd/DndContainer'
// import { DndOverlayItem } from '@/features/dnd/DndOverlayItem'
// import {useDndDropZone} from "@/features/dnd/useDndContainer";
// import { usePointerDnd } from "@/features/dnd/usePointerDnd";
// import { DndStorage } from "@/features/dnd/DndStorage";
// import {DndItem} from "@/features/dnd/DndItem";



import { DndContainer } from '@/features/dnd/DndContainer';
import { DndItem } from '@/features/dnd/DndItem';
import { StorageBox } from '@/features/dnd/StorageBox';

type Word = {
  id: number;
  word: string;
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
    setIsCorrect(null)
    const currentWord: Word = {
      id: Number(e.currentTarget.id),
      word: e.currentTarget.innerHTML
    }
    setWordList(prev => [...prev, currentWord]);
    setStorageWordList(prev => prev.filter((item) => item.id !== currentWord.id));
  }

  // function setOverlayTransition(ms: number) {
  //   const el = overlayElRef.current;
  //   if (!el) return;
  //   el.style.transition = ms
  //     ? `transform ${DELETE_DELAY}ms cubic-bezier(.2,.7,.3,1)`
  //     : 'none';
  // }

  // function snapBackToStart() {
  //   setIsReturning(true);
  //
  //   const el = overlayElRef.current;
  //   if (!el) return;
  //   // включим transition на КАДР ПОЗЖЕ, чтобы анимация стабильно сработала
  //   setOverlayTransition(0);
  //   // текущая позиция уже стоит в style.transform
  //   requestAnimationFrame(() => {
  //     setOverlayTransition(DELETE_DELAY);
  //     moveOverlayTo(dragStartRef.current);
  //     window.setTimeout(() => {
  //       setCurrentWord(null);
  //       setOverlayTransition(0); // выключим обратно, чтобы следующий drag был без анимаций
  //       setIsReturning(false);
  //     }, DELETE_DELAY);
  //   });
  // }
  //
  // function moveOverlayTo(p: Coord) {
  //   if (overlayElRef.current) {
  //     overlayElRef.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
  //   }
  // }
  //
  // useEffect(() => {
  //   if (isOutsideContainer && currentWord && !isReturning) {
  //     snapBackToStart();
  //   }
  // }, [isOutsideContainer, currentWord]);

  //
  // function handleMouseDown(e: React.PointerEvent<HTMLDivElement>) {
  //   const id = (e.target as HTMLDivElement).closest('li')?.id;
  //   const word = wordList.find((word) => String(word.id) === id);
  //   if (!word) return;
  //
  //   // отменяем выделение текста если нажимаем в li в слове
  //   e.preventDefault();
  //
  //   // отключаем анимации когда мышка зажата
  //   setOverlayTransition(0);
  //
  //   // размещение в точке взятия
  //   const offset: Coord = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY};
  //   offsetRef.current = offset;
  //   const startPoint: Coord = {x: e.clientX - offset.x, y: e.clientY - offset.y};
  //   dragStartRef.current = startPoint;
  //
  //   moveOverlayTo(startPoint)
  //   setCurrentWord(word);
  // }
  //
  // function handleMouseUp(e: React.PointerEvent<HTMLDivElement>) {
  //   if (!currentWord || isReturning) return;
  //   if (storageRef.current) {
  //     const rect = storageRef.current.getBoundingClientRect();
  //     // если отпустить внутри storage
  //     if (
  //       e.clientX >= rect.left &&
  //       e.clientX <= rect.right &&
  //       e.clientY >= rect.top &&
  //       e.clientY <= rect.bottom
  //     ) {
  //       setStorageWordList((prev) => [...prev, currentWord]);
  //       setWordList((prev) => prev.filter((w) => w.id !== currentWord.id));
  //       // удалим сразу
  //       setCurrentWord(null);
  //       return;
  //     }
  //
  //     snapBackToStart();
  //
  //   }
  // }
  //
  // function handleMouseMove(e: React.PointerEvent<HTMLDivElement>) {
  //   if (isReturning) return
  //   if (!isOutsideContainer) {
  //     // были баги, mouseMove может пойматься после mouseUp
  //     moveOverlayTo({ x: e.clientX - offsetRef.current.x, y: e.clientY - offsetRef.current.y });
  //     return
  //   }
  //   snapBackToStart();
  // }

  return (
    // <DndContainer
    //   className={cls.container}
    // >
    //   <button
    //     className={cls.button}
    //     onClick={handleRestart}
    //   >try again</button>
    //   <button
    //     className={cls.button}
    //     onClick={handleSetNewSentence}
    //   >
    //     get new exercise
    //   </button>
    //   <button
    //     onClick={handleCheck}
    //     className={cls.button}
    //   >
    //     check if it's right
    //   </button>
    //   <button
    //     className={cls.button}
    //     onClick={showAnswer}
    //   >
    //     show answer
    //   </button>
    //
    //   {isCorrect === false && <p style={{ color: 'red' }}>it's incorrect! Try again</p>}
    //   {isCorrect === true && <p style={{ color: 'green' }}>it's correct! Congratulations!</p>}
    //
    //   {isAnswerVisible && (<>
    //     <p>correct answer: {currentSentence}</p>
    //   </>)}
    //
    //   <ul className={cls.list}>
    //     {wordList.map((word: Word) => (
    //       // TODO: DnD item
    //       <DndItem key={word.id}>
    //         <li
    //           key={word.id}
    //           id={String(word.id)}
    //           className={cls.listItem}
    //           style={{
    //             opacity: word.id === currentWord?.id ? 0.5 : 1,
    //           }}
    //         >
    //           {word.word}
    //         </li>
    //       </DndItem>
    //     ))}
    //   </ul>
    //
    //   <DndStorage>
    //     <ul
    //       className={cls.storage}
    //     >
    //       {storageWordList.map((word: Word) => (
    //         <li
    //           key={word.id}
    //           id={String(word.id)}
    //           onClick={handleRemoveWordFromStorage}
    //           className={cls.listItem}
    //         >
    //           {word.word}
    //         </li>
    //       ))}
    //     </ul>
    //   </DndStorage>
    //
    //   {/*<DndOverlayItem*/}
    //   {/*  // isVisible={!!currentWord}*/}
    //   {/*>*/}
    //   {/*  <div className={cls.listItem}>*/}
    //   {/*    {currentWord?.word}*/}
    //   {/*  </div>*/}
    //   {/*</DndOverlayItem>*/}
    // </DndContainer>


    <DndContainer className="p-4">
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        {['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'].map((word, i) => (
          <DndItem key={i}>
            <button style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }}>{word}</button>
          </DndItem>
        ))}
      </div>

      <div style={{ height: 16 }} />

      <StorageBox>Drop here</StorageBox>
    </DndContainer>
  )
}