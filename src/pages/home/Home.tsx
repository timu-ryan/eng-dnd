
import cls from './Home.module.scss'
import { useEffect, useState } from "react";

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


  return (
    <div>
      Home Page
    </div>
  )
}