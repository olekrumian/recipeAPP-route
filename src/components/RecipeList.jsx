import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import bake from '../assets/img/bake.svg'
import favoriteImg from '../assets/img/heart.svg'

export default function RecipeList({ menuItem, resetList }) {
  if (menuItem.length < 1) {
    return (
      <div
        className="error-find"
        onClick={() => {
          resetList()
        }}
      >
        <h3 className="error-title">
          Нічого не знайдено, спробуй пошукати щось інше
        </h3>
        <img className="error-img" src={bake} alt="error" />
      </div>
    )
  } else {
    return (
      <section className="recipe-list-wrapper">
        {menuItem.map((recipe, index) => {
          return (
            <Link key={index} to={`/recipe/${recipe.id}`}>
              <div key={index} className="recipe-item">
                <div className="image">
                  <img src={recipe.image} alt={recipe.name} />
                </div>
                <div className="description">
                  <div className="description-title-wrapper">
                    <h3 className="description-title">{recipe.name}</h3>
                    <button
                      className="favorite-btn"
                      onClick={(e) => {
                        e.preventDefault()
                        console.log('added to favorite')
                      }}
                    >
                      <img src={favoriteImg} alt="" />
                    </button>
                  </div>
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
            </Link>
          )
        })}
      </section>
    )
  }
}
