import React from 'react'
import './style.scss'
import {Link} from 'react-router-dom'

const ChooseUsCard = (props) => {
  return (
    <>
    <div className="why-choose-us-card" to={props.path}>
          <figure><img src={props.img} alt="" loading='lazy' /></figure>
          <h4>{props.title}</h4>
          <span>{props.text}</span>
      </div>
    </>
  )
}

export default ChooseUsCard
