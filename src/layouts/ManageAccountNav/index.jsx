import React from 'react'
import {NavLink} from 'react-router-dom'
import './style.scss'

const ManageAccountNav = (className) => {
  return (
    <>
      <div className="manage-account-nav-container">
        <div className='row1'>
            <div className='nav-title'>Manage Account</div>
            <div><NavLink activeClassName="active" to='/EditProfile'>Profile</NavLink></div>
            <div><NavLink activeClassName="active" to='/Activities'>Activities</NavLink></div>
            <div><NavLink activeClassName="active" to='/AddressBook'>Address Book</NavLink></div>
        </div>
        <div className='row2'>
            <div className='nav-title'>Settings</div>
                <div><NavLink activeClassName="active" to='/DeactivateAccount'>Account</NavLink></div>
                <div><NavLink activeClassName="active" to='/SetPassword'>Security</NavLink></div>
                <div><NavLink activeClassName="active" to='/Notifications'>Notifications</NavLink></div>
            </div>
        <div className='row3'>
            <div className='nav-title'><NavLink to='/Wishlist'>Wishlist & Favorites</NavLink></div>
        </div>
        <div className='row4'>
            <div className='nav-title'>Sell Now</div>
        </div>
      </div>
    </>
  )
}

export default ManageAccountNav
