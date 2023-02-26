import React, { useState } from 'react'
// react router dom imports
import { Outlet, useLoaderData } from 'react-router-dom'
// Components
import Header from '../components/Header'

const Main = () => {
  return (
    <div className="container day-theme">
      <Header />
      <Outlet />
    </div>
  )
}

export default Main
