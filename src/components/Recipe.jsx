import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import back from '../assets/img/backarrov.svg';
import { recipes } from '../data/data';

const Recipe = () => {
  const { recipeId } = useParams();
  const recipe = recipes.find((recipe) => recipe.id === parseInt(recipeId));
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.remove('no-scroll');
  }, []);

  const handleAddToFavorites = (recipe) => {
    if (!favorites.find((fav) => fav.id === recipe.id)) {
      setFavorites([...favorites, recipe]);
      localStorage.setItem('favorites', JSON.stringify([...favorites, recipe]));
    } else {
      const updatedFavorites = favorites.filter((fav) => fav.id !== recipe.id);
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites'));
    if (storedFavorites) {
      setFavorites(storedFavorites);
    }
  }, []);

  return (
    <>
      <section className="container day-theme" key={recipeId}>
        <div className="header-menu-wrapper">
          <Link className="to-back" to="/">
            <img src={back} alt="" />
            <span>Назад</span>
          </Link>
        </div>
        {recipes.map((recipe, index) => {
          const { image, name, srcIngredient, description } = recipe;
          if (recipe.id === parseInt(recipeId)) {
            const isFavorite = favorites.some(
              (favorite) => favorite.id === recipe.id
            );

            return (
              <div className="recipe-wrapper" key={index}>
                <img
                  className="recipe-img"
                  src={`/${image}`}
                  width="250"
                  alt={name}
                />
                <div className="header-recipe-wrapper">
                  <h2 className="recipe-title">{name}</h2>
                  <button
                    className={`favorite-btn ${
                      isFavorite ? 'favorite-btn-active' : ''
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
                        stroke="#112D4E"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <ul className="recipe-ingredient-list" key={index}>
                  {srcIngredient.map((item, index) => {
                    const key = Object.keys(item)[0];
                    const value = item[key];

                    return <li key={index}>{value}</li>;
                  })}
                </ul>

                <div className="recipe-description">
                  {description.map((item, index) => {
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
            );
          }
        })}
      </section>
    </>
  );
};

export default Recipe;
