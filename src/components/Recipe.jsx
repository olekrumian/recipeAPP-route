import { Link, useParams } from 'react-router-dom'
import { recipes } from '../data/data'
import Main from './Main'

const Recipe = () => {
  const { recipeId } = useParams()
  const recipe = recipes.find((recipe) => recipe.id === parseInt(recipeId))

  return (
    <>
      <section className="container day-theme" key={recipeId}>
        {recipes.map((recipe, index) => {
          const { image, name, srcIngredient, description } = recipe
          if (recipe.id === parseInt(recipeId)) {
            return (
              <div className="recipe-wrapper" key={index}>
                <img
                  className="recipe-img"
                  src={`/${image}`}
                  width="250"
                  alt={name}
                />
                <h2 className="recipe-title">{name}</h2>
                <ul className="recipe-ingredient-list" key={index}>
                  {srcIngredient.map((item, index) => {
                    const key = Object.keys(item)[0]
                    const value = item[key]

                    return <li key={index}>{value}</li>
                  })}
                </ul>

                <div className="recipe-description">
                  {description.map((item, index) => {
                    const key = Object.keys(item)[0]
                    const value = item[key]

                    return <p key={index}>&nbsp; {value}</p>
                  })}
                </div>
              </div>
            )
          }
        })}
        <Link className="to-home" to="/">
          На головну
        </Link>
      </section>
    </>
  )
}

export default Recipe
