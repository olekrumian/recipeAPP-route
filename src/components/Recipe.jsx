import { Link, useParams } from 'react-router-dom'
import { recipes } from '../data/data'
import back from '../assets/img/backarrov.svg'
import { useEffect } from 'react'

const Recipe = () => {
  const { recipeId } = useParams()
  const recipe = recipes.find((recipe) => recipe.id === parseInt(recipeId))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <section className="container day-theme" key={recipeId}>
        <div className="header-menu-wrapper">
          <Link className="to-back" to="/">
            <img src={back} alt="" />
            <span>Назад</span>
          </Link>
        </div>
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

                    return (
                      <p key={index}>
                        <strong>{index + 1}.</strong> {value}
                      </p>
                    )
                  })}
                </div>
              </div>
            )
          }
        })}
      </section>
    </>
  )
}

export default Recipe
