import find from '../assets/img/find.svg'
import favouriteBook from '../assets/img/favourite_book.svg'

const handleSubmit = (e) => {
  e.preventDefault()
}

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
            <img src={find} alt="Пошук" />
          </button>
        </form>
        <button
          className="favorite-button"
          onClick={() => {
            toggleFavorite()
          }}
        >
          <img src={favouriteBook} alt="" />
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
  )
}
