import find from '../assets/img/find.svg'
import { recipes } from '../data/data'

export const searchRecipe = (e) => {
  const result = recipes.filter(
    (item) => item.name.toLowerCase() === e.target.value
  )
  return console.log(result)
}

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
