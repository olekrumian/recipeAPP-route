import find from '../assets/img/find.svg'
import { recipes } from '../data/data'

const handleSubmit = (e) => {
  e.preventDefault()
}

export default function Header({ searchRecipe }) {
  return (
    <>
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
    </>
  )
}
