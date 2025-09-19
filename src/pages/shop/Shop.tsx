import React, {useState} from 'react'
import {Link, Outlet} from "react-router-dom";
import examplePng from '@/assets/png-example.png';
import exampleJpg from '@/assets/jpg-example.jpg';
import ExampleSvg from '@/assets/svg-example.svg';
import classes from "./Shop.module.scss";

const Shop = () => {

  const [counter, setCounter] = useState<number>(0);

  function handleClick() {
    setCounter(counter => counter + 1)
  }

  return (
    <div>
      <h1>PLATFORM: {__PLATFORM__}</h1>
      <div>
        <img width={200} src={examplePng} alt='example image' />
        <img width={200} src={exampleJpg} alt='example image' />
        <ExampleSvg style={{ color: 'green' }} width={200} height={200}/>
      </div>
      <Link to={`/about`}>about</Link>
      <Link to={`/shop`}>shop</Link>
      <div>
        Hello world
      </div>
      <div>{counter}</div>
      <button className={classes.button} onClick={handleClick}>add 1</button>
    </div>
  )
}

export default Shop