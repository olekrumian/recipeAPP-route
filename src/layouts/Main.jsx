import React, { useState } from 'react'
// react router dom imports
import { Outlet, useLoaderData } from 'react-router-dom'
// Components
import Header from '../components/Header'
// helper function
import { fetchData } from '../helper'

// loader
export function mainLoader() {
  const userName = fetchData('userName')
  return { userName }
}

const Main = () => {
  return (
    <div className="container day-theme">
      <Header />
      <Outlet />
    </div>
  )
}

export default Main
