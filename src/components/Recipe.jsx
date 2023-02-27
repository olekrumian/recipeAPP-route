import { Link, useParams } from 'react-router-dom'
import { recipes } from '../data/data'
import Main from './Main'

const Recipe = () => {
  const { recipeId } = useParams()
  const recipe = recipes.find((recipe) => recipe.id === parseInt(recipeId))

  return (
    <>
      <Main />
      <section className="container" key={recipeId}>
        {recipes.map((recipe) => {
          const { image, name, srcIngredient } = recipe
          if (recipe.id === parseInt(recipeId)) {
            return (
              <>
                <h2>{name}</h2>
                <img src={`/${image}`} width="250" alt={name} />
                <ul key={recipe.toString()}>
                  {srcIngredient.map((item) => {
                    const key = Object.keys(item)[0]
                    const value = item[key]
                    return <li>{value}</li>
                  })}
                </ul>
                <Link to="/">На головну</Link>
              </>
            )
          }
        })}
      </section>
    </>
  )
}

export default Recipe
