import React from 'react'
import './style.scss'
import {Link} from 'react-router-dom'

const ChooseUsCard = (props) => {
  return (
    <>
    <Link className="why-choose-us-card" to={props.path}>
          <figure><img src={props.img} alt="" /></figure>
          <h4>{props.title}</h4>
          <span>{props.text}</span>
      </Link>
    </>
  )
}

export default ChooseUsCard
