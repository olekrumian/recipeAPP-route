import React, { useCallback, useEffect, useState } from 'react';
import Categories from '../components/Categories';
import Favorite from '../components/Favorite';
import Header from '../components/Header';
import RecipeList from '../components/RecipeList';
import { recipeService } from '../firebase/recipeService';

const Dashboard = () => {
  const [allRecipes, setAllRecipes] = useState([]);
  const [menuItem, setMenuItem] = useState([]);
  const [categories, setCategories] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favoriteOpen, setFavoriteOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Завантаження рецептів один раз при монтуванні
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);
        const recipes = await recipeService.getAllRecipes();
        setAllRecipes(recipes);
        setMenuItem(recipes);
        const allCategories = [
          'Всі',
          ...new Set(recipes.map((item) => item.category)),
        ].sort();
        setCategories(allCategories);
      } catch (error) {
        console.error('Error loading recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, []);

  // Завантаження збережених улюблених рецептів
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error parsing favorites:', error);
        localStorage.removeItem('favorites');
      }
    }
  }, []);

  const resetList = useCallback(() => {
    setMenuItem(allRecipes);
  }, [allRecipes]);

  const filterItem = useCallback(
    (category) => {
      if (category === 'Всі') {
        resetList();
      } else {
        const newItem = allRecipes.filter((item) => item.category === category);
        setMenuItem(newItem);
      }
    },
    [allRecipes, resetList]
  );

  const searchRecipe = useCallback(
    (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const result = allRecipes.filter((item) =>
        item.name.toLowerCase().includes(searchTerm)
      );
      setMenuItem(result);
    },
    [allRecipes]
  );

  const toggleFavorite = useCallback(() => {
    setFavoriteOpen(!favoriteOpen);
    document.body.classList.toggle('no-scroll', !favoriteOpen);
    window.scrollTo(0, 0);
  }, [favoriteOpen]);

  const handleAddToFavorites = useCallback((recipe) => {
    setFavorites((prevFavorites) => {
      const recipeExists = prevFavorites.some((fav) => fav.id === recipe.id);
      let newFavorites;

      if (recipeExists) {
        newFavorites = prevFavorites.filter((fav) => fav.id !== recipe.id);
      } else {
        newFavorites = [...prevFavorites, recipe];
      }

      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

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
  );
};

export default Dashboard;
