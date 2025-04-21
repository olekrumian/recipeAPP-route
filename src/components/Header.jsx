import React from 'react';
import favourite_book from '../assets/img/favourite_book.svg';

const handleSubmit = (e) => {
  e.preventDefault();
};

export default function Header({ searchRecipe, favorites, toggleFavorite }) {
  return (
    <>
      <div className="header-wrapper">
        <form className="header-form" onSubmit={handleSubmit}>
          <input
            className="search-input"
            type="text"
            name="recipe"
            id="find"
            placeholder="Пошук"
            onChange={searchRecipe}
          />
          <label htmlFor="find">Пошук</label>
          <button type="button" className="form-find-btn">
            <img
              src="/src/assets/img/find.svg"
              alt="Пошук"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </button>
        </form>
        <button
          className="favorite-button"
          onClick={() => {
            toggleFavorite();
          }}
        >
          <img
            src={favourite_book}
            alt="Обрані рецепти"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
          <span
            className={
              favorites.length > 0 ? 'active-favorite' : 'non-favorite'
            }
          >
            {favorites ? favorites.length : 0}
          </span>
        </button>
      </div>
    </>
  );
}
