import React, { useState } from 'react'

export default function Categories({ categories, filterItem }) {
  const [clickedButton, setClickedButton] = useState(categories[0])

  const handleClick = (category) => {
    filterItem(category)
    setClickedButton(category)
  }

  return (
    <div className="btn-category">
      {categories.map((category, index) => {
        return (
          <button
            key={index}
            type="button"
            className={clickedButton === category ? 'btn btn-active' : 'btn'}
            onClick={() => {
              filterItem(category)
              handleClick(category)
            }}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
