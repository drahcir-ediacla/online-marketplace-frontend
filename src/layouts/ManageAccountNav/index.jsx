import React from 'react'
import { NavLink } from 'react-router-dom'
import './style.scss'
import SmallScreenHeader from '../Header/SmallScreenHeader'

const ManageAccountNav = () => {

  return (
    <>
      <div className="manage-account-nav-container">
        <div className='row1'>
          <div className='nav-title'>Manage Account</div>
          <div><NavLink activeClassName="active" to='/editprofile'>Account Information</NavLink></div>
          <div><NavLink activeClassName="active" to='/notificationlist'>Notification List</NavLink></div>
        </div>
        <div className='row2'>
          <div className='nav-title'>Settings</div>
          <div><NavLink activeClassName="active" to='/deactivateaccount'>Account</NavLink></div>
          <div><NavLink activeClassName="active" to='/setpassword'>Security</NavLink></div>
        </div>
        <div className='row3'>
          <div className='nav-title'><NavLink to='/wishlist'>Wishlist & Favorites</NavLink></div>
        </div>
        <div className='row4'>
          <NavLink to='/addlisting' className='nav-title'>Sell Now</NavLink>
        </div>
      </div>
    </>
  )
}

export default ManageAccountNav
