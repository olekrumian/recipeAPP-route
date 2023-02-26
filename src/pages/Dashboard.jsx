import React, { useState } from 'react'
// react router dom imports
import { useLoaderData } from 'react-router-dom'
// helper function
import { fetchData } from '../helper'
// Components
import Categories from '../components/Categories'
import RecipeList from '../components/RecipeList'
import BtnToTop from '../components/BtnToTop'
import { recipes } from '../data/data'

const allCategories = ['Всі', ...new Set(recipes.map((item) => item.category))]

// loader
// export function dashboardLoader() {
//   const userName = fetchData('userName')
//   return { userName }
// }

const Dashboard = () => {
  // const { userName } = useLoaderData()
  const [menuItem, setMenuItem] = useState(recipes)
  const [categories, setCategories] = useState(allCategories)

  const filterItem = (category) => {
    if (category === 'Всі') {
      return setMenuItem(recipes)
    }
    const newItem = recipes.filter((item) => item.category === category)
    setMenuItem(newItem)
  }

  return (
    <>
      <Categories categories={categories} filterItem={filterItem} />
      <RecipeList menuItem={menuItem} />
      <BtnToTop />
    </>
  )
}

export default Dashboard
