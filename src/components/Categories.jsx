import React, { useState } from 'react'

export default function Categories({ categories, filterItem }) {
  const reorderedCategories = [
    'Всі',
    ...categories.filter((category) => category !== 'Всі'),
  ]
  const [clickedButton, setClickedButton] = useState(reorderedCategories[0])

  const handleClick = (category) => {
    filterItem(category)
    setClickedButton(category)
  }

  return (
    <div className="btn-category">
      {reorderedCategories.map((category, index) => (
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
      ))}
    </div>
  )
}
