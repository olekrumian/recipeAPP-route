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
  const [favorites, setFavorites] = useState([])

  console.log(favorites.map((item) => item.id))

  //*Reset list
  const resetList = () => {
    setMenuItem(recipes)
  }

  //*Filter by category
  const filterItem = (category) => {
    if (category === 'Всі') {
      return setMenuItem(recipes)
    }
    const newItem = recipes.filter((item) => item.category === category)
    setMenuItem(newItem)
  }
  //*Find recipe
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

  const handleAddToFavorites = (recipe) => {
    if (!favorites.find((fav) => fav.id === recipe.id)) {
      setFavorites([...favorites, recipe])
      localStorage.setItem('favorites', JSON.stringify([...favorites, recipe]))
      console.log('Added to favorites:', recipe.name)
    } else {
      const updatedFavorites = favorites.filter((fav) => fav.id !== recipe.id)
      setFavorites(updatedFavorites)
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
      console.log('Removed from favorites:', recipe.name)
    }
  }

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites'))
    if (storedFavorites) {
      setFavorites(storedFavorites)
    }
  }, [])

  return (
    <>
      <Header
        searchRecipe={searchRecipe}
        favoriteList={favoriteList}
        favorites={favorites}
      />
      <Categories categories={categories} filterItem={filterItem} />
      <RecipeList
        menuItem={menuItem}
        resetList={resetList}
        handleAddToFavorites={handleAddToFavorites}
        favorites={favorites}
      />
    </>
  )
}

export default Dashboard
