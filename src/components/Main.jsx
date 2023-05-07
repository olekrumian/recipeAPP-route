import React, { useState } from 'react'
import { Outlet, useLoaderData } from 'react-router-dom'

const Main = () => {
  return (
    <div className="container day-theme">
      <Outlet />
    </div>
  )
}

export default Main
