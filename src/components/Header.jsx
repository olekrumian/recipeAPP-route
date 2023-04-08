import find from '../assets/img/find.svg'
import favouriteBook from '../assets/img/favourite_book.svg'

const handleSubmit = (e) => {
  e.preventDefault()
}

export default function Header({ searchRecipe, favoriteList }) {
  return (
    <>
      <div className="header-wrapper">
        <form className="header-form" onSubmit={handleSubmit}>
          <input
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
            //TODO - favorite recipes list
            favoriteList()
          }}
        >
          <img src={favouriteBook} alt="" />
          {/* <span className="active-favorite">3</span> */}
        </button>
      </div>
    </>
  )
}
