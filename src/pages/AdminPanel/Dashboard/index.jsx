import React from 'react'
import './style.scss'
import SideMenu from '../../../layouts/AdminPanel/SideMenu'
import Header from '../../../layouts/AdminPanel/Header'

const index = () => {
  return (
    <>
    <div className='dashboard-body'>
      <div className='col1'><SideMenu /></div>
      <div className='col2'><Header /></div>
    </div>
    </>
  )
}

export default index
