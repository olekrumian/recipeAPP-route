import { Link, useParams } from 'react-router-dom'
import { recipes } from '../data/data'
import Main from '../layouts/Main'

const Recipe = () => {
  const { recipeId } = useParams()
  const recipe = recipes.find((recipe) => recipe.id === parseInt(recipeId))
  const { image, name } = recipe

  return (
    <>
      <Main />
      <section className="container" key={recipeId}>
        <h2>{name}</h2>
        <img src={`/${image}`} width="250" alt={name} />
        <Link to="/">На головну</Link>
      </section>
    </>
  )
}

export default Recipe
