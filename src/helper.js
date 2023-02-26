import React, { useState } from 'react'
import { recipes } from './data/data'

// Local storage
export const fetchData = (key) => {
  return JSON.parse(localStorage.getItem(key))
}

export const deleteItem = ({ key }) => {
  return localStorage.removeItem(key)
}

export const searchRecipe = (e) => {
  return console.log(e.target.value)
}
