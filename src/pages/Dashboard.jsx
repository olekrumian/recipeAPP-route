import React, { useEffect, useState } from 'react'
// Components
import Header from '../components/Header'
import Categories from '../components/Categories'
import RecipeList from '../components/RecipeList'
import { recipes } from '../data/data'

const allCategories = ['Всі', ...new Set(recipes.map((item) => item.category))]

const Dashboard = () => {
  const [menuItem, setMenuItem] = useState(recipes)
  const [categories, setCategories] = useState(allCategories)

  const resetList = () => {
    setMenuItem(recipes)
  }

  const filterItem = (category) => {
    if (category === 'Всі') {
      return setMenuItem(recipes)
    }
    const newItem = recipes.filter((item) => item.category === category)
    setMenuItem(newItem)
  }

  const searchRecipe = (e) => {
    const result = recipes.filter((item) =>
      item.name.toLowerCase().includes(e.target.value.toLowerCase())
    )

    return setMenuItem(result)
  }

  //TODO - function favorite recipes list
  const favoriteList = () => {
    return console.log('ít is work')
  }

  return (
    <>
      <Header searchRecipe={searchRecipe} favoriteList={favoriteList} />
      <Categories categories={categories} filterItem={filterItem} />
      <RecipeList menuItem={menuItem} resetList={resetList} />
    </>
  )
}

export default Dashboard
