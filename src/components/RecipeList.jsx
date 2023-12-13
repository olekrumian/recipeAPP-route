import { Link } from 'react-router-dom';
import bake from '../assets/img/bake.svg';

export default function RecipeList({
  menuItem,
  resetList,
  handleAddToFavorites,
  favorites,
}) {
  const sortedMenuItem = menuItem.sort((a, b) => a.name.localeCompare(b.name));

  if (menuItem.length < 1) {
    return (
      <div
        className="error-find"
        onClick={() => {
          resetList();
          //TODO - reset input value
          // reset input value
          document.querySelector('.search-input').value = '';
        }}
      >
        <h3 className="error-title">
          Нічого не знайдено, спробуй пошукати щось інше
        </h3>
        <img className="error-img" src={bake} alt="error" />
      </div>
    );
  } else {
    return (
      <section className="recipe-list-wrapper">
        {sortedMenuItem.map((recipe, index) => {
          const isFavorite = favorites.some(
            (favorite) => favorite.id === recipe.id
          );

          return (
            <Link
              className="recipe-item"
              key={index}
              to={`/recipe/${recipe.id}`}
            >
              <div key={index} className="recipe-item-inner">
                <div className="image">
                  <img src={recipe.image} alt={recipe.name} />
                </div>
                <div className="description">
                  <div className="description-title-wrapper">
                    <h3 className="description-title">{recipe.name}</h3>
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
                  <div className="description-info">
                    {recipe.iconInfo.map((item, id) => {
                      return (
                        <div key={id} className="info-item time">
                          <img src={item.image} alt="icon" />
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
}
