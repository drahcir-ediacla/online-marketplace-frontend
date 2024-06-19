import React from 'react'
import { NavLink } from 'react-router-dom'
import './style.scss'
import SmallScreenHeader from '../../layouts/Header/SmallScreenHeader'

const ResponsiveManageAccountNav = () => {

    return (
        <>
            <div className="manage-account-container-small-screen">
                <div className="mac-row1">
                    <SmallScreenHeader />
                </div>
                <div className="mac-row2">
                    <h5>MANAGE ACCOUNT</h5>
                    <ul>
                        <li>
                            <NavLink to='/editprofile'>Account Information</NavLink>
                        </li>
                        <li>
                            <NavLink to='/notificationlist'>Notification List</NavLink>
                        </li>
                    </ul>
                    <h5>SETTINGS</h5>
                    <ul>
                        <li>
                            <NavLink to='/deactivateaccount'>Account</NavLink>
                        </li>
                        <li>
                            <NavLink to='/setpassword'>Security</NavLink>
                        </li>
                    </ul>
                    <NavLink to='/wishlist'><h5>MY WISHLIST</h5></NavLink>
                    <NavLink to='/addlisting'><h5>SELL</h5></NavLink>
                </div>
            </div>
        </>
    )
}

export default ResponsiveManageAccountNav
