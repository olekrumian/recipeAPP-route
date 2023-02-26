import find from '../assets/img/find.svg'
import { searchRecipe } from '../helper'

export default function Header() {
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
