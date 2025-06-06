import React from 'react';
import { Link } from 'react-router-dom';
import bake from '../assets/img/bake.svg';

export default function RecipeList({
  menuItem,
  resetList,
  handleAddToFavorites,
  favorites,
}) {
  const getImagePath = (path) => {
    if (!path) return '';
    // Для локальних зображень
    if (path.startsWith('./')) {
      return path.replace('./', '/');
    }
    return path;
  };

  if (!menuItem || menuItem.length === 0) {
    return (
      <div
        className="error-find"
        onClick={() => {
          resetList();
          document.querySelector('.search-input').value = '';
        }}
      >
        <h3 className="error-title">
          Нічого не знайдено, спробуй пошукати щось інше
        </h3>
        <img className="error-img" src={bake} alt="error" />
      </div>
    );
  }

  return (
    <section className="recipe-list-wrapper">
      {menuItem.map((recipe) => {
        return (
          <Link
            to={`/recipe/${recipe.id}`}
            key={recipe.id}
            className="recipe-item"
          >
            <div className="recipe-item-inner">
              <div className="image">
                <img
                  src={getImagePath(recipe.image)}
                  alt={recipe.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = bake;
                  }}
                />
              </div>
              <div className="description">
                <div className="description-title-wrapper">
                  <h3 className="description-title">{recipe.name}</h3>
                  <div className="recipe-actions">
                    <button
                      className={`favorite-btn ${
                        favorites.some(
                          (fav) => String(fav.id) === String(recipe.id)
                        )
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
                        viewBox="0 -1 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.5 1.85081C19.6875 -4.77919 36.875 7.22081 12.5 21.8508C-11.875 7.22081 5.3125 -4.77919 12.5 1.85081Z"
                          stroke="#112D4E"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="description-info">
                  {recipe.iconInfo.map((item, id) => {
                    return (
                      <div key={id} className="info-item time">
                        <img src={getImagePath(item.image)} alt="icon" />
                        <span>{item.info}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
