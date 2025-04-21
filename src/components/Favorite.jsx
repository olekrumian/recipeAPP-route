import React from 'react';
import { Link } from 'react-router-dom';

export default function Favorite({
  favorites,
  favoriteOpen,
  toggleFavorite,
  handleAddToFavorites,
}) {
  const getImagePath = (path) => {
    if (!path) return '';
    return path.replace('./', '/');
  };

  return (
    <section
      className={`favorite-container ${
        favoriteOpen ? 'favorite-container-hiden' : ''
      }`}
    >
      <button className="favorite-close-button" onClick={toggleFavorite}>
        Закрити
      </button>
      {favorites.map((favorite, index) => (
        <Link key={index} to={`/recipe/${favorite.id}`}>
          <div className="recipe-item-favorite">
            <div className="image">
              <img src={getImagePath(favorite.image)} alt={favorite.name} />
            </div>
            <div className="description favorite-description">
              <div className="description-title-wrapper">
                <h3 className="description-title favorite-description-title">
                  {favorite.name}
                </h3>
                <button
                  className="favorite-btn favorite-btn-delete"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToFavorites(favorite);
                  }}
                >
                  <svg
                    className="favorite-svg-cross"
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 128 128"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <g
                      transform="translate(0.000000,128.000000) scale(0.100000,-0.100000)"
                      fill="#000000"
                      stroke="none"
                    >
                      <path
                        d="M29 1251 c-57 -57 -56 -58 233 -348 l262 -263 -262 -263 c-235 -236
-262 -266 -262 -295 0 -44 38 -82 82 -82 29 0 59 27 295 262 l263 262 263
-262 c236 -235 266 -262 295 -262 44 0 82 38 82 82 0 29 -27 59 -262 295
l-262 263 262 263 c289 290 290 291 233 348 -57 57 -58 56 -348 -233 l-263
-262 -263 262 c-290 289 -291 290 -348 233z"
                      />
                    </g>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
