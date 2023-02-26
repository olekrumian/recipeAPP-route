import React from 'react'
import { Link } from 'react-router-dom'

export default function RecipeList({ menuItem }) {
  return (
    <section className="recipe-list-wrapper">
      {menuItem.map((recipe, index) => {
        return (
          <div key={index} className="recipe-item">
            <div className="image">
              <img src={recipe.image} alt={recipe.name} />
            </div>
            <div className="description">
              <h3 className="description-title">
                <Link to={`/recipe/${recipe.id}`}>{recipe.name}</Link>
              </h3>
              <div className="description-info">
                {recipe.iconInfo.map((item, id) => {
                  return (
                    <div key={id} className="info-item time">
                      <img src={item.image} alt="icon" />
                      <span>{item.info}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
