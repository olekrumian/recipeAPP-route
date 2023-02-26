import find from '../assets/img/find.svg'
import { recipes } from '../data/data.js'

const fetchRecipes = recipes

export default function Header() {
  function searchRecipe(e) {
    console.log(fetchRecipes)
  }

  return (
    <>
      <form className="header-form">
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
    </>
  )
}
