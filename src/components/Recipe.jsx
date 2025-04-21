import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import back from '../assets/img/backarrov.svg';
import shareIcon from '../assets/img/icons8-share.svg';
import { recipeService } from '../firebase/recipeService';

const Recipe = () => {
  const { recipeId } = useParams();
  const location = useLocation();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const recipes = await recipeService.getAllRecipes();
        const foundRecipe = recipes.find(
          (r) => String(r.id) === String(recipeId)
        );
        setRecipe(foundRecipe);
        setLoading(false);
      } catch (error) {
        console.error('Error loading recipe:', error);
        setLoading(false);
      }
    };

    loadRecipe();
    window.scrollTo(0, 0);
    document.body.classList.remove('no-scroll');
  }, [recipeId]);

  const handleAddToFavorites = (recipe) => {
    setFavorites((prevFavorites) => {
      const recipeExists = prevFavorites.some(
        (fav) => String(fav.id) === String(recipe.id)
      );
      let newFavorites;

      if (recipeExists) {
        newFavorites = prevFavorites.filter(
          (fav) => String(fav.id) !== String(recipe.id)
        );
      } else {
        newFavorites = [...prevFavorites, recipe];
      }

      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

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

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${location.pathname}`;
    if (navigator.share) {
      navigator.share({
        title: recipe?.name || 'Рецепт',
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Посилання скопійовано!');
    }
  };

  const getImagePath = (path) => {
    if (!path) return '';
    return path.replace('./', '/');
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (!recipe) {
    return <div>Рецепт не знайдено</div>;
  }

  return (
    <>
      <section className="container day-theme">
        <div className="header-menu-wrapper">
          <Link className="to-back" to="/">
            <img src={back} alt="" />
            <span>Назад</span>
          </Link>
          <img
            className="logo"
            src={shareIcon}
            alt="share"
            width={24}
            height={24}
            style={{
              cursor: 'pointer',
              minWidth: 24,
              minHeight: 24,
              color: '#112d4e',
            }}
            onClick={handleShare}
          />
        </div>
        <div className="recipe-wrapper">
          <img
            className="recipe-img"
            src={getImagePath(recipe.image)}
            width="250"
            alt={recipe.name}
          />
          <div className="header-recipe-wrapper">
            <h2 className="recipe-title">{recipe.name}</h2>
            <button
              className={`favorite-btn ${
                favorites.some((fav) => String(fav.id) === String(recipe.id))
                  ? 'favorite-btn-active'
                  : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleAddToFavorites(recipe);
              }}
            >
              <svg
                width="25"
                height="23"
                viewBox="0 0 25 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.1111 8.1879C23.1111 9.8203 22.4843 11.3882 21.365 12.5481C18.7885 15.2187 16.2895 18.0036 13.6167 20.5775C13.0041 21.1589 12.0322 21.1377 11.446 20.53L3.74563 12.5481C1.41812 10.1354 1.41812 6.24041 3.74563 3.82777C6.09602 1.39142 9.92505 1.39142 12.2754 3.82777L12.5553 4.11789L12.8351 3.82794C13.962 2.65919 15.4968 2 17.1 2C18.7033 2 20.238 2.65913 21.365 3.82777C22.4844 4.9877 23.1111 6.55554 23.1111 8.1879Z"
                  stroke="#112d4e"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <ul className="recipe-ingredient-list">
            {recipe.srcIngredient.map((item, index) => {
              const key = Object.keys(item)[0];
              const value = item[key];
              return <li key={index}>{value}</li>;
            })}
          </ul>

          <div className="recipe-description">
            {recipe.description.map((item, index) => {
              const key = Object.keys(item)[0];
              const value = item[key];
              return (
                <p key={index}>
                  <strong>{index + 1}.</strong> {value}
                </p>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Recipe;
