import React from 'react'
import MenuBar from "./MenuBar";
import { Outlet } from 'react-router-dom';

const LayoutPage = () => {
  return (
    <>
        <MenuBar/>
        <Outlet/>
    </>
  )
}

export default LayoutPage