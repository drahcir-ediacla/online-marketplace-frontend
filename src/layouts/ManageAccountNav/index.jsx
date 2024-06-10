import React from 'react'
import { NavLink } from 'react-router-dom'
import './style.scss'

const ManageAccountNav = () => {

  return (
    <>
      <div className="manage-account-nav-container">
        <div className='row1'>
          <div className='nav-title'>Manage Account</div>
          <div><NavLink activeClassName="active" to='/editprofile'>Profile</NavLink></div>
          <div><NavLink activeClassName="active" to='/activities'>Activities</NavLink></div>
          <div><NavLink activeClassName="active" to='/notificationlist'>Notification List</NavLink></div>
          <div><NavLink activeClassName="active" to='/addressbook'>Address Book</NavLink></div>
        </div>
        <div className='row2'>
          <div className='nav-title'>Settings</div>
          <div><NavLink activeClassName="active" to='/deactivateaccount'>Account</NavLink></div>
          <div><NavLink activeClassName="active" to='/setpassword'>Security</NavLink></div>
          <div><NavLink activeClassName="active" to='/notifications'>Notifications</NavLink></div>
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
