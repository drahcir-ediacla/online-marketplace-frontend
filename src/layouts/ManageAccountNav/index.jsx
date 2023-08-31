import React from 'react'
import {Link} from 'react-router-dom'
import './style.scss'

const ManageAccountNav = () => {
  return (
    <>
      <div className="manage-account-nav-container">
        <div className='row1'>
            <div className='nav-title'>Manage Account</div>
            <div><Link to='#' className='active'>Profile</Link></div>
            <div><Link to='#'>Activities</Link></div>
            <div><Link to='#'>Address Book</Link></div>
        </div>
        <div className='row2'>
            <div className='nav-title'>Settings</div>
                <div><Link to='#'>Account</Link></div>
                <div><Link to='#'>Security</Link></div>
                <div><Link to='#'>Notifications</Link></div>
            </div>
        <div className='row3'>
            <div className='nav-title'>Wishlist & Favorites</div>
        </div>
        <div className='row4'>
            <div className='nav-title'>Sell Now</div>
        </div>
      </div>
    </>
  )
}

export default ManageAccountNav
