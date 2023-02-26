import React from 'react'
import topBtn from '../assets/img/topBtn.svg'

function BtnToTop() {
  return (
    <>
      <button className="btn-to-top hidden">
        <img src={topBtn} alt="" />
      </button>
    </>
  )
}

export default BtnToTop
