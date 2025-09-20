import React, { useState } from 'react'
import classes from './App.module.scss';
import { Link, Outlet } from 'react-router-dom';

export const App = () => {



  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

function Header() {
  return (
    <header className={classes.header}>
      <Link to="/" className={classes.link}>Main</Link>
      <Link to="/shop" className={classes.link}>Shop</Link>
      <Link to="/about" className={classes.link}>About</Link>
    </header>
  )
}
