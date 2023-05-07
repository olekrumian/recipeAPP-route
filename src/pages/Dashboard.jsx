import React, { useEffect, useState } from 'react'
// Components
import Header from '../components/Header'
import Categories from '../components/Categories'
import RecipeList from '../components/RecipeList'
import Favorite from '../components/Favorite'
import { recipes } from '../data/data'

const allCategories = ['Всі', ...new Set(recipes.map((item) => item.category))]

const Dashboard = () => {
  const [menuItem, setMenuItem] = useState(recipes)
  const [categories, setCategories] = useState(allCategories)
  const [favorites, setFavorites] = useState([])
  const [favoriteOpen, setFavoriteOpen] = useState(true)

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

  const toggleFavorite = () => {
    setFavoriteOpen(!favoriteOpen)
    document.body.classList.toggle('no-scroll', favoriteOpen)
    window.scrollTo(0, 0)
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
      <Favorite
        favorites={favorites}
        favoriteOpen={favoriteOpen}
        toggleFavorite={toggleFavorite}
        handleAddToFavorites={handleAddToFavorites}
      />
      <Header
        searchRecipe={searchRecipe}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
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
